# Supercar Showcase

A scroll-driven, cinematic showcase for six cars: Ferrari F80, Lamborghini Revuelto,
Bugatti Tourbillon, Pagani Utopia, Tesla Roadster, and Tesla Model Y. Built with
React, TypeScript, Vite, and GSAP/ScrollTrigger.

## What is here right now

This is a fully working, typed, production-buildable project. All layout, scroll
animation logic, and copy are real. `cars.ts` points at `.webp` images and
`.mp4` videos under `public/assets/` — drop your real files in at those exact
paths/names and everything renders as-is, no code changes needed.

If you don't have real assets yet and just want to see the motion and layout
first, `scripts/generate-placeholders.mjs` can generate throwaway SVG stand-ins,
but note it writes `.svg` files while `cars.ts` expects `.webp`/`.mp4` — it's a
local-preview convenience only, not part of the asset pipeline, so you'd need
to point `cars.ts` at the generated `.svg` paths temporarily, or just run with
the graceful missing-image/video fallbacks already built into each component
until your real files are in place.

## Project structure

```
src/
  components/
    CarSection.tsx              Shared section used by all six cars
    HeroFrameScrub.tsx           Scroll-scrubbed image-sequence hero (Apple-style)
    InlineVideo.tsx              Manual play/pause/mute video player (color-reveal)
    ExplodedViewCenterpiece.tsx  Horizontal-feeling exploded view (Bugatti)
    GallerySection.tsx           End-of-page horizontal card gallery
    FooterSection.tsx            Calm closing section
    IntroSection.tsx             Opening landing hero
    StatCounter.tsx              Telemetry-style animated counter
  data/
    cars.ts                      All copy, stats, and asset paths per car
  hooks/
    useReducedMotion.ts          prefers-reduced-motion + low-end device detection
  utils/
    gsapSetup.ts                 GSAP + ScrollTrigger registration
  styles/
    main.css                     All styling, dark HUD aesthetic
public/
  assets/
    videos/                      One clip per car (<car-id>.mp4), used for the
                                  color-reveal block
    frames/<car-id>/             Scroll-scrubbed hero image sequence per car
                                  (frame_0001.webp, frame_0002.webp, ...)
    details/                     Detail close-up images
    placeholders/                Hero poster / gallery thumbnail per car
                                  (<car-id>-hero.webp)
    exploded/bugatti-tourbillon/ Exploded-view component renders (see below)
scripts/
  generate-placeholders.mjs      Optional: generates throwaway SVG stand-ins for local preview
                                  (writes .svg; cars.ts expects .webp/.mp4 for real assets)
```

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL. Everything scrolls and animates immediately using
placeholder art.

## Swapping in real assets

Each car's asset paths live in `src/data/cars.ts` under `heroFrames`,
`placeholderHeroImage`, and `details[].image`.

### 1. Hero image sequence (scroll-scrubbed)

Each car section opens with a scroll-scrubbed image sequence in the style of
Apple product pages (`HeroFrameScrub.tsx`), rather than a video. It:

- Renders onto a `<canvas>` — the frame drawn is driven entirely by scroll
  position, not by time or autoplay.
- Uses a tall scroll region (2.5 viewport heights) with the visible panel
  pinned via `position: sticky`, so scrolling through that region scrubs
  frame 1 through the last frame and back.
- Shows the poster (`placeholderHeroImage`) immediately, then frame 1 as soon
  as it loads, so there's never a blank canvas.
- Only starts loading a car's frame sequence once its section is roughly a
  viewport away from view (via `IntersectionObserver`), rather than loading
  all six cars' sequences on first paint.
- Falls back to a single static poster image (no extra scroll height, no
  scrubbing) if frame 1 fails to load, or in reduced-motion mode.

Drop the sequence into `public/assets/frames/<car-id>/frame_0001.webp`,
`frame_0002.webp`, etc. (4-digit, zero-padded, 1-indexed) — path and total
count are set per car in `cars.ts` as `heroFrames: { path, frameCount }`.
**The `frameCount` for each car currently defaults to 180 (confirmed for
Roadster) — double check and update it per car to match however many frames
you actually have in each folder**, since a mismatched count means the
scrub will either stop early or hold on the last frame for part of the
scroll range.

Because this adds real scroll height (2.5 viewport-heights of scrubbing per
car, on top of the existing content), the page is noticeably longer than the
video-hero version — six cars' worth of scrubbing adds roughly 9 extra
viewport-heights of scroll versus before.

### 2. Color-reveal video

Each section also has a larger, manually-controlled video further down the
page (`InlineVideo.tsx`, in the "matte to metal" color-reveal block), at
`public/assets/videos/<car-id>.mp4`. There's no static color photo alongside
it — just the video, at a wide 21:9 aspect ratio. It starts **unmuted**,
plays once per click, and shows a replay icon once it finishes instead of
looping.

### `placeholderHeroImage`

Used as the hero section's poster/fallback image, as the static thumbnail in
the end-of-page gallery (`GallerySection.tsx`), and as the poster frame for
the color-reveal video before it's played. It points at
`public/assets/placeholders/<car-id>-hero.webp`.

### 3. Detail close-up photos

Replace the files in `public/assets/details/` with your real photography,
keeping the same filenames referenced in `cars.ts`, or update the paths in
`cars.ts` to point at new filenames. Note that four cars use a shorthand
prefix here instead of their full `id` (`revuelto-*`, `tourbillon-*`,
`utopia-*`, `model-y-*` instead of `lamborghini-revuelto-*`,
`bugatti-tourbillon-*`, `pagani-utopia-*`, `tesla-model-y-*`) — `cars.ts`
already accounts for this, just keep it in mind if you rename files.

### 4. Stats

`stats` (display strings) and `statTargets` (numeric values used for the
counting animation) are both in `cars.ts`. Update both together if a number
changes.

## Reduced motion and performance

- `useReducedMotion.ts` respects `prefers-reduced-motion` and also detects
  low `deviceMemory` or `hardwareConcurrency` to route low-end devices into
  the same simplified fade-based experience (hero videos and speed-line
  flourishes are hidden entirely in this mode; content just fades in).
- Detail images load lazily via the `loading="lazy"` attribute; hero and
  color-reveal videos use `preload="metadata"`/`preload="none"` so they don't
  download until they're about to be needed.
- Animations use `transform` and `opacity` almost exclusively.
- Each car section only creates simple enter/scrub triggers (no full-viewport
  pinned scrub per car), which keeps total page scroll height predictable and
  avoids the extra/duplicate-looking scrollbar that stacked pins used to
  cause.

## Building for production

```bash
npm run build
```

This runs a type check and produces an optimized static build in `dist/`.

## Deploying

### Netlify / Vercel

Point either platform at this repository with:

- Build command: `npm run build`
- Publish directory: `dist`

Both platforms auto-detect Vite projects, so this is usually all you need.

### GitHub Pages

1. Set `base` in `vite.config.ts` to `/<your-repo-name>/`.
2. Run `npm run build`.
3. Push the contents of `dist/` to a `gh-pages` branch, or use an action such
   as `peaceiris/actions-gh-pages`.

## Notes on the exploded-view centerpiece

The Bugatti Tourbillon section includes a single pinned, scroll-scrubbed
exploded view (`ExplodedViewCenterpiece.tsx`) — the only pinned section left
on the page. It looks for 5 images in
`public/assets/exploded/bugatti-tourbillon/`:

```
chassis.webp
engine.webp
front-axle.webp
rear-axle.webp
body-panels.webp
```

If any of these files are missing, that component's colored placeholder box
is shown instead (the `<img>` fails silently and falls back), so the section
never breaks while you're still sourcing real photography or renders. Once a
file is in place, it renders as a full-cover image inside that component's
box with the label and description overlaid on top.

Each component is centered on the stage via an explicit `top`/`left` offset
(not flex layout), so it stays correctly centered regardless of viewport size,
and the intro caption fades out just before the parts start moving and fades
back in once they've reassembled, so the heading text never visually overlaps
the exploding parts mid-scroll.

Each image should be shot or rendered in isolation (that single component
only, no other parts attached), against the same near-black background used
elsewhere on the site, so all 5 feel like one continuous shoot when they
animate apart and back together.
