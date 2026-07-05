import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { CarData, ReducedMotionMode } from "../types/car";
import { HeroFrameScrub } from "./HeroFrameScrub";
import { InlineVideo } from "./InlineVideo";
import { StatCounter } from "./StatCounter";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";

interface CarSectionProps {
  car: CarData;
  reducedMotion: ReducedMotionMode;
  index: number;
}

export function CarSection({ car, reducedMotion, index }: CarSectionProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Defensive guard: if a prior instance's ScrollTrigger for this exact
    // section somehow survived (fast refresh, StrictMode double-invoke),
    // kill it before creating a new one. Duplicate triggers stack their
    // scroll distance, which is what produces a page that appears to
    // "restart" mid-scroll and an inflated/doubled scrollbar.
    const idPrefix = `car-${car.id}`;
    ScrollTrigger.getAll()
      .filter((trigger) => trigger.vars.id?.toString().startsWith(idPrefix))
      .forEach((trigger) => trigger.kill());

    const titleEl = section.querySelector<HTMLElement>(".car-section__title-block");
    const fadeTargets = Array.from(section.querySelectorAll<HTMLElement>("[data-fade]"));

    if (reducedMotion === "reduced") {
      gsap.set(fadeTargets, { opacity: 0, y: 20 });
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          id: `${idPrefix}-reduced`,
          trigger: section,
          start: "top 75%",
          onEnter: () => {
            gsap.to(fadeTargets, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 });
            setStatsInView(true);
          },
        });
      }, section);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      // Title + speed-line flourish fade in once the hero is in view. This is
      // a simple enter trigger (not a scroll-scrub/pin), so it can't drift out
      // of sync with content height changes elsewhere on the page, and it
      // doesn't add an extra pinned viewport of scroll distance per section.
      if (titleEl) {
        gsap.set(titleEl, { opacity: 0, y: 40 });
      }
      if (speedLinesRef.current) {
        gsap.set(speedLinesRef.current, { opacity: 0 });
      }

      ScrollTrigger.create({
        id: `${idPrefix}-hero`,
        trigger: section.querySelector(".car-section__hero"),
        start: "top 70%",
        onEnter: () => {
          if (titleEl) gsap.to(titleEl, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
          if (speedLinesRef.current) gsap.to(speedLinesRef.current, { opacity: 0.5, duration: 1.2 });
        },
      });

      // Detail scrub captions.
      const detailCaptions = section.querySelectorAll<HTMLElement>(".detail-scrub__caption");
      detailCaptions.forEach((caption, i) => {
        gsap.set(caption, { opacity: 0 });
        ScrollTrigger.create({
          id: `${idPrefix}-detail-${i}`,
          trigger: section.querySelector(".detail-scrub"),
          start: `${i * (100 / detailCaptions.length)}% top`,
          end: `${(i + 1) * (100 / detailCaptions.length)}% top`,
          onEnter: () => gsap.to(caption, { opacity: 1, duration: 0.5 }),
          onLeave: () => gsap.to(caption, { opacity: 0, duration: 0.5 }),
          onEnterBack: () => gsap.to(caption, { opacity: 1, duration: 0.5 }),
          onLeaveBack: () => gsap.to(caption, { opacity: 0, duration: 0.5 }),
        });
      });

      // Generic fade-ins for remaining [data-fade] blocks (detail grid, color
      // reveal, stat readout), each triggered independently as it scrolls in.
      fadeTargets.forEach((target, i) => {
        if (target === titleEl) return;
        gsap.set(target, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          id: `${idPrefix}-fade-${i}`,
          trigger: target,
          start: "top 85%",
          onEnter: () => gsap.to(target, { opacity: 1, y: 0, duration: 0.8 }),
        });
      });

      // Stat counters trigger once in view.
      ScrollTrigger.create({
        id: `${idPrefix}-stats`,
        trigger: section.querySelector(".stat-readout"),
        start: "top 80%",
        onEnter: () => setStatsInView(true),
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion, car.id]);

  return (
    <section
      ref={sectionRef}
      className="car-section"
      style={{ "--accent": car.accentColor, "--accent-secondary": car.accentColorSecondary } as React.CSSProperties}
      data-car-id={car.id}
      aria-label={`${car.name} showcase`}
    >
      <HeroFrameScrub
        carId={car.id}
        frames={car.heroFrames}
        poster={car.placeholderHeroImage}
        label={car.name}
        reducedMotion={reducedMotion}
      >
        <div ref={speedLinesRef} className="speed-lines" aria-hidden="true" />
        <div className="car-section__title-block">
          <span className="car-section__index">{String(index + 1).padStart(2, "0")}</span>
          <h2 className="car-section__name">{car.name}</h2>
          <p className="car-section__tagline">{car.tagline}</p>
        </div>
      </HeroFrameScrub>

      <div className="detail-scrub">
        {car.details.map((detail) => (
          <div key={detail.id} className="detail-scrub__item" data-fade>
            <img src={detail.image} alt={detail.label} className="detail-scrub__image" loading="lazy" />
            <div className="detail-scrub__caption">
              <span className="detail-scrub__label">{detail.label}</span>
              <p className="detail-scrub__text">{detail.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="color-reveal" data-fade>
        <div className="color-reveal__grid color-reveal__grid--video-only">
          <div className="color-reveal__video-wrap">
            <InlineVideo
              src={`${import.meta.env.BASE_URL}assets/videos/${car.id}.mp4`}
              posterSrc={car.placeholderHeroImage}
              label={car.name}
              defaultMuted={false}
            />
          </div>
        </div>
        <p className="color-reveal__caption">Matte to metal. The moment it wakes up.</p>
      </div>

      <div className="stat-readout" data-fade>
        <StatCounter
          label="0 to 60"
          targetValue={car.statTargets.zeroToSixty}
          unit={car.statUnits.zeroToSixty}
          decimals={2}
          accentColor={car.accentColor}
          shouldAnimate={statsInView}
        />
        <StatCounter
          label="Top Speed"
          targetValue={car.statTargets.topSpeed}
          unit={car.statUnits.topSpeed}
          accentColor={car.accentColor}
          shouldAnimate={statsInView}
        />
        <StatCounter
          label="Horsepower"
          targetValue={car.statTargets.horsepower}
          unit={car.statUnits.horsepower}
          accentColor={car.accentColor}
          shouldAnimate={statsInView}
        />
        <StatCounter
          label="Weight"
          targetValue={car.statTargets.weight}
          unit={car.statUnits.weight}
          accentColor={car.accentColor}
          shouldAnimate={statsInView}
        />
      </div>
    </section>
  );
}
