import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CarData, ReducedMotionMode } from "../types/car";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";

interface ExplodedViewCenterpieceProps {
  car: CarData;
  reducedMotion: ReducedMotionMode;
}

interface ExplodedComponent {
  id: string;
  label: string;
  description: string;
  restX: number;
  explodedX: number;
  restY: number;
  explodedY: number;
  width: number;
  height: number;
  color: string;
  image: string;
}

function buildComponents(accent: string, secondary: string): ExplodedComponent[] {
  // GitHub Pages serves this app from /<repo>/, not the domain root, so this
  // raw path string needs the base prefix applied manually (Vite only
  // rewrites index.html and static imports automatically, not runtime
  // strings like this one). import.meta.env.BASE_URL is "/" locally and
  // "/supercarShowcase/" in production.
  const basePath = `${import.meta.env.BASE_URL}assets/exploded/bugatti-tourbillon`;
  return [
    {
      id: "chassis",
      label: "Carbon Monocoque Chassis",
      description: "A single carbon fiber cell. The backbone everything else attaches to.",
      restX: 0,
      explodedX: 0,
      restY: 0,
      explodedY: 0,
      width: 480,
      height: 300,
      color: secondary,
      image: `${basePath}/chassis.webp`,
    },
    {
      id: "engine",
      label: "Hybrid V16 Powertrain",
      description: "Naturally aspirated V16, no turbos, backed by three electric motors.",
      restX: 0,
      explodedX: 0,
      restY: 0,
      explodedY: -260,
      width: 300,
      height: 190,
      color: accent,
      image: `${basePath}/engine.webp`,
    },
    {
      id: "front-wheels",
      label: "Front Axle Assembly",
      description: "Independent suspension tuned for a car that reshapes physics.",
      restX: 0,
      explodedX: 380,
      restY: 0,
      explodedY: -40,
      width: 260,
      height: 170,
      color: "#c9c9c9",
      image: `${basePath}/front-axle.webp`,
    },
    {
      id: "rear-wheels",
      label: "Rear Axle Assembly",
      description: "Where 1800 horsepower finally meets the road.",
      restX: 0,
      explodedX: -380,
      restY: 0,
      explodedY: -40,
      width: 260,
      height: 170,
      color: "#c9c9c9",
      image: `${basePath}/rear-axle.webp`,
    },
    {
      id: "body",
      label: "Body Panels",
      description: "Every surface shaped in the wind tunnel before it was shaped by hand.",
      restX: 0,
      explodedX: 0,
      restY: 0,
      explodedY: 260,
      width: 380,
      height: 220,
      color: accent,
      image: `${basePath}/body-panels.webp`,
    },
  ];
}

type ImageState = "loading" | "loaded" | "error";

export function ExplodedViewCenterpiece({ car, reducedMotion }: ExplodedViewCenterpieceProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const components = useMemo(
    () => buildComponents(car.accentColor, car.accentColorSecondary),
    [car.accentColor, car.accentColorSecondary],
  );
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});

  const setImageState = (id: string, state: ImageState): void => {
    setImageStates((prev) => (prev[id] === state ? prev : { ...prev, [id]: state }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const id = `exploded-${car.id}`;
    ScrollTrigger.getAll()
      .filter((trigger) => trigger.vars.id === id)
      .forEach((trigger) => trigger.kill());

    if (reducedMotion === "reduced") {
      components.forEach((component) => {
        const node = componentRefs.current[component.id];
        if (node) {
          gsap.set(node, {
            x: component.explodedX,
            y: component.explodedY,
            opacity: 1,
          });
        }
      });
      if (introRef.current) gsap.set(introRef.current, { opacity: 1 });
      return;
    }

    components.forEach((component) => {
      const node = componentRefs.current[component.id];
      if (!node) return;
      gsap.set(node, { x: component.restX, y: component.restY, opacity: component.id === "chassis" ? 1 : 0 });
    });
    if (introRef.current) gsap.set(introRef.current, { opacity: 1 });

    // Horizontal-feeling scroll: explode outward across the first half of the
    // pinned duration, then reassemble across the second half. The intro
    // caption fades out just before parts start moving and fades back in
    // once everything has reassembled, so it never overlaps the exploded
    // components mid-scroll.
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          id,
          trigger: section,
          start: "top top",
          end: "+=260%",
          scrub: 0.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (introRef.current) {
        timeline.to(introRef.current, { opacity: 0, duration: 0.12 }, 0);
      }

      const explodableComponents = components.filter((component) => component.id !== "chassis");

      explodableComponents.forEach((component, i) => {
        const node = componentRefs.current[component.id];
        if (!node) return;

        timeline.to(
          node,
          {
            opacity: 1,
            x: component.explodedX,
            y: component.explodedY,
            duration: 0.4,
            ease: "power2.out",
          },
          i * 0.08,
        );
      });

      // Hold at full explosion so the exploded state is clearly readable
      // before anything starts moving back together.
      const explodeEndTime = (explodableComponents.length - 1) * 0.08 + 0.4;
      const holdEndTime = explodeEndTime + 0.35;

      // Reassemble in reverse order, staggered the same way the explosion
      // was, so parts settle back one at a time instead of all snapping to
      // the same point simultaneously.
      [...explodableComponents].reverse().forEach((component, i) => {
        const node = componentRefs.current[component.id];
        if (!node) return;

        timeline.to(
          node,
          {
            x: component.restX,
            y: component.restY,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          holdEndTime + i * 0.08,
        );
      });

      const reassembleEndTime = holdEndTime + (explodableComponents.length - 1) * 0.08 + 0.4;

      if (introRef.current) {
        timeline.to(introRef.current, { opacity: 1, duration: 0.15 }, reassembleEndTime + 0.05);
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion, components, car.id]);

  return (
    <section ref={sectionRef} className="exploded-view" aria-label={`${car.name} engineering breakdown`}>
      <div ref={trackRef} className="exploded-view__track">
        <div ref={introRef} className="exploded-view__intro">
          <span className="exploded-view__eyebrow">Engineering Breakdown</span>
          <h2 className="exploded-view__title">{car.name}, taken apart.</h2>
          <p className="exploded-view__subtitle">
            Every component built in isolation, then obsessed over until it worked as one.
          </p>
        </div>
        <div className="exploded-view__stage">
          {components.map((component) => (
            <div
              key={component.id}
              ref={(el) => {
                componentRefs.current[component.id] = el;
              }}
              className="exploded-view__component"
              style={{
                width: component.width,
                height: component.height,
                top: `calc(50% - ${component.height / 2}px)`,
                left: `calc(50% - ${component.width / 2}px)`,
                backgroundColor: imageStates[component.id] === "error" ? component.color : undefined,
              }}
            >
              <div
                className="exploded-view__component-image-wrap"
                data-image-state={imageStates[component.id] ?? "loading"}
              >
                <img
                  src={component.image}
                  alt={component.label}
                  className="exploded-view__component-image"
                  loading="lazy"
                  data-hidden={imageStates[component.id] === "error" ? "true" : "false"}
                  onLoad={() => setImageState(component.id, "loaded")}
                  onError={() => setImageState(component.id, "error")}
                />
              </div>
              <div className="exploded-view__component-caption">
                <span className="exploded-view__component-label">{component.label}</span>
                <p className="exploded-view__component-description">{component.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
