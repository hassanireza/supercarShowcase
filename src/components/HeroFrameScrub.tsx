import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { HeroFrameSequence, ReducedMotionMode } from "../types/car";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";

interface HeroFrameScrubProps {
  carId: string;
  frames: HeroFrameSequence;
  poster: string;
  label: string;
  reducedMotion: ReducedMotionMode;
  children?: React.ReactNode;
}

// Sticky panel is always 100vh. This is how much *extra* scroll distance (on
// top of that) is dedicated to scrubbing when the full configured frame
// count actually loads. If fewer frames turn out to be real (see
// `effectiveFrameCount` below), this is scaled down proportionally so the
// scroll distance always matches the amount of real content, and scrolling
// never "runs dry" and leaves the visitor scrolling through nothing.
// Sized so a moderate, continuous scroll (~800px/sec) takes roughly 5
// seconds to traverse — there's no way to guarantee an exact duration with
// a true scroll-scrub (it's driven by scroll position, not a clock, same as
// Apple's own product pages: scroll fast and it flashes by fast), but this
// targets a comfortable middle ground at a normal scroll pace.
const FULL_SCRUB_VH = 250;
const MIN_SCRUB_VH = 60;

function frameUrl(basePath: string, index: number): string {
  const padded = String(index).padStart(4, "0");
  return `${basePath}/frame_${padded}.webp`;
}

function isFrameLoaded(img: HTMLImageElement | undefined): boolean {
  return !!img && img.complete && img.naturalWidth > 0;
}

/**
 * Returns the 1-based frame index closest to `target` that has actually
 * finished loading, searching outward in both directions. Returns null if
 * no frame in the array has loaded yet. This means a mismatch between the
 * configured frameCount and how many frame files actually exist (or a few
 * dropped requests) degrades to "hold the nearest real frame" instead of
 * silently freezing the canvas and leaving a dead zone in the scrub.
 */
function findNearestLoadedFrame(images: HTMLImageElement[], target: number): number | null {
  if (isFrameLoaded(images[target - 1])) return target;

  const maxOffset = images.length;
  for (let offset = 1; offset <= maxOffset; offset += 1) {
    const back = target - offset;
    const forward = target + offset;
    if (back >= 1 && isFrameLoaded(images[back - 1])) return back;
    if (forward <= images.length && isFrameLoaded(images[forward - 1])) return forward;
  }
  return null;
}

function probeFrame(basePath: string, index: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = frameUrl(basePath, index);
  });
}

/**
 * Finds the real last-loadable frame index via binary search, assuming a
 * contiguous run from frame 1 (real sequences don't have holes — a mismatch
 * just means the configured `frameCount` overshoots what's actually on
 * disk). This takes ~log2(frameCount) round trips (about 8 for a sequence
 * of 180) instead of waiting for every single frame in the sequence to
 * settle.
 *
 * This matters for timing, not just efficiency: it needs to resolve
 * *before* the visitor scrolls into the hero, so the scroll-scrub distance
 * is already correctly sized by the time it's visible. Waiting for the
 * full sequence to settle (which can take a while under a browser's
 * per-host connection limit) means the correction often doesn't land until
 * the visitor is already mid-scroll or past it — which shows up as the page
 * suddenly shrinking underneath them, a jump straight to raw background
 * before the next section has faded in.
 */
async function findRealFrameCount(basePath: string, configuredCount: number): Promise<number> {
  if (configuredCount <= 1) return configuredCount;
  let lo = 1;
  let hi = configuredCount;
  // We already know frame 1 loaded (checked separately) — confirm the
  // configured upper bound too, since if it's actually correct, skip the
  // search entirely.
  if (await probeFrame(basePath, hi)) return hi;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    // eslint-disable-next-line no-await-in-loop
    const loaded = await probeFrame(basePath, mid);
    if (loaded) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Scroll-scrubbed image-sequence hero, in the style of Apple product pages.
 *
 * This renders the entire `.car-section__hero` block: a tall scroll region
 * with a `position: sticky` inner panel. As the visitor scrolls through the
 * tall region, the sticky panel stays put while scroll progress through that
 * extra height maps directly to a frame index drawn onto a canvas — no
 * video, no autoplay, entirely driven by scroll position. `children` (the
 * title block, speed-line flourish) render inside the sticky panel so they
 * stay pinned in place alongside the canvas.
 *
 * - The scroll-scrub is wired up immediately on mount (not delayed until
 *   images finish loading), so it always tracks the visitor's actual scroll
 *   position from the first frame of scroll. It just draws nothing new
 *   until a frame is available, leaving the poster visible underneath.
 *   Waiting for a network round-trip before wiring it up would leave a
 *   window where scroll advances but nothing updates, so as soon as the
 *   image finally loads the sequence has to jump ahead to catch up with
 *   however far the visitor has already scrolled — eating into the
 *   sequence and making it feel like it rushes past.
 * - Draws frame 1 as soon as it loads so there's never a blank canvas, and
 *   immediately redraws at the visitor's *current* scroll position at that
 *   point (rather than waiting for the next scroll event) for the same
 *   reason.
 * - Loads the rest of the sequence in the background.
 * - If fewer frames actually load than `frameCount` claims, the scroll
 *   distance dedicated to scrubbing shrinks to match — so the visitor is
 *   never left scrolling through a stretch where the frame has already
 *   frozen on the last real image.
 * - Falls back to a single static poster image (no scroll-scrub, no extra
 *   scroll height) if frame 1 fails to load, or in reduced-motion mode.
 */
export function HeroFrameScrub({ carId, frames, poster, label, reducedMotion, children }: HeroFrameScrubProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const effectiveFrameCountRef = useRef(frames.frameCount);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [effectiveFrameCount, setEffectiveFrameCount] = useState(frames.frameCount);

  // Load the frame sequence, but only once this hero is close to view — with
  // six cars at up to ~180 frames each, loading every sequence on mount would
  // mean well over a thousand concurrent image requests on first paint.
  useEffect(() => {
    if (reducedMotion === "reduced") return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let cancelled = false;
    let started = false;
    const images: HTMLImageElement[] = [];

    const draw = (index: number): void => {
      const canvas = canvasRef.current;
      const img = images[index - 1];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.drawImage(img, 0, 0);
    };

    const startLoading = (): void => {
      if (started) return;
      started = true;

      const first = new Image();
      first.src = frameUrl(frames.path, 1);
      first.onload = () => {
        if (cancelled) return;
        draw(1);
        setIsReady(true);
      };
      first.onerror = () => {
        if (cancelled) return;
        setHasError(true);
      };
      images[0] = first;
      imagesRef.current = images;

      // Resolve the real frame count fast (binary search — a handful of
      // requests, not the whole sequence) so the scroll distance is sized
      // correctly before the visitor reaches the hero, then load exactly
      // that many frames. No point requesting frames past the real count.
      findRealFrameCount(frames.path, frames.frameCount).then((realCount) => {
        if (cancelled) return;

        if (realCount < frames.frameCount) {
          // eslint-disable-next-line no-console
          console.warn(
            `[HeroFrameScrub] ${carId}: found ${realCount} of the configured ${frames.frameCount} frame(s). This ` +
              `usually means "frameCount" in cars.ts doesn't match the actual number of files in ` +
              `public/assets/frames/${carId}/. The scroll-scrub distance has been adjusted to match, but fixing the ` +
              `count in cars.ts is still the smoothest fix.`,
          );
          effectiveFrameCountRef.current = realCount;
          setEffectiveFrameCount(realCount);
        }

        for (let i = 2; i <= realCount; i += 1) {
          const img = new Image();
          img.src = frameUrl(frames.path, i);
          images[i - 1] = img;
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startLoading();
        });
      },
      { rootMargin: "100% 0px" }, // start loading about a viewport-height before it's reached
    );
    observer.observe(wrap);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [frames.path, frames.frameCount, carId, reducedMotion]);

  // Wire up the scroll-scrub immediately (not gated on images finishing
  // loading) so it's always in sync with the visitor's actual scroll
  // position — see the component doc comment above for why that matters.
  //
  // This pins the hero via GSAP's ScrollTrigger `pin: true` rather than CSS
  // `position: sticky`. Sticky looks equivalent on paper, but it's fragile
  // in practice — it silently stops working if *any* ancestor (however far
  // up the tree) sets `overflow` to anything but `visible`, needs vendor
  // prefixing on some older WebKit builds, and behaves inconsistently with
  // dynamic mobile viewport/address-bar resizing. GSAP's pin is handled
  // entirely in JS (it inserts its own spacer and manages positioning
  // directly), which is the same mechanism already used successfully for
  // the Bugatti exploded-view section elsewhere in this codebase.
  useEffect(() => {
    if (reducedMotion === "reduced" || hasError) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const id = `hero-frames-${carId}`;
    ScrollTrigger.getAll()
      .filter((trigger) => trigger.vars.id === id)
      .forEach((trigger) => trigger.kill());

    const draw = (index: number): void => {
      const images = imagesRef.current;
      const resolved = findNearestLoadedFrame(images, index);
      if (resolved === null) return;
      const img = images[resolved - 1];
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.drawImage(img, 0, 0);
    };

    const scrubVh = Math.max(MIN_SCRUB_VH, (FULL_SCRUB_VH * effectiveFrameCount) / frames.frameCount);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id,
        trigger: wrap,
        start: "top top",
        // Pixel-based (via a function, re-evaluated on refresh/resize)
        // rather than a bare "%" string, so the scrub distance is always
        // an exact multiple of the real viewport height regardless of how
        // GSAP would otherwise interpret a percentage here.
        end: () => `+=${(window.innerHeight * scrubVh) / 100}`,
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const count = effectiveFrameCountRef.current;
          const frame = Math.min(count, Math.max(1, Math.round(self.progress * (count - 1)) + 1));
          currentFrameRef.current = frame;
          draw(frame);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [hasError, carId, reducedMotion, effectiveFrameCount, frames.frameCount]);

  // As soon as the first frame loads, immediately draw whatever frame
  // corresponds to the visitor's *current* scroll position, rather than
  // waiting for their next scroll event. Without this, if loading takes a
  // moment and the visitor keeps scrolling in the meantime, the canvas would
  // sit still until they scroll again and then jump straight to a
  // far-along frame, which reads as the sequence "rushing past".
  useEffect(() => {
    if (!isReady || hasError || reducedMotion === "reduced") return;
    const id = `hero-frames-${carId}`;
    const trigger = ScrollTrigger.getById(id);
    if (trigger) trigger.update();
  }, [isReady, hasError, carId, reducedMotion]);

  // Re-measure ScrollTrigger start/end positions after the scroll-scrub
  // height is trimmed to match the frames that actually loaded, otherwise
  // GSAP keeps using the stale (too-tall) measurement from first render.
  useEffect(() => {
    if (effectiveFrameCount === frames.frameCount) return;
    ScrollTrigger.refresh();
  }, [effectiveFrameCount, frames.frameCount]);

  if (reducedMotion === "reduced" || hasError) {
    return (
      <div className="car-section__hero car-section__hero--static">
        <img src={poster} alt={label} className="hero-frames__fallback-image" />
        {children}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="car-section__hero">
      {!isReady ? <img src={poster} alt={label} className="hero-frames__fallback-image" /> : null}
      <canvas ref={canvasRef} className="hero-frames__canvas" style={{ display: isReady ? "block" : "none" }} />
      {children}
    </div>
  );
}
