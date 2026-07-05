import type React from "react";
import { useEffect, useRef } from "react";
import type { CarData } from "../types/car";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";

interface GallerySectionProps {
  cars: CarData[];
}

export function GallerySection({ cars }: GallerySectionProps): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const triggers = cardRefs.current.map((card) =>
      ScrollTrigger.create({
        trigger: card,
        start: "left 70%",
        end: "right 30%",
        onToggle: (self) => {
          gsap.to(card, { scale: self.isActive ? 1.06 : 1, duration: 0.4, ease: "power2.out" });
        },
      }),
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToCar = (carId: string): void => {
    const target = document.querySelector(`[data-car-id="${carId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="gallery-section" aria-label="Full lineup gallery">
      <h2 className="gallery-section__title">The Full Lineup</h2>
      <div ref={trackRef} className="gallery-section__track">
        {cars.map((car, i) => (
          <button
            key={car.id}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            className="gallery-card"
            style={{ "--accent": car.accentColor } as React.CSSProperties}
            onClick={() => scrollToCar(car.id)}
            onMouseEnter={(event) => gsap.to(event.currentTarget, { scale: 1.06, duration: 0.3 })}
            onMouseLeave={(event) => gsap.to(event.currentTarget, { scale: 1, duration: 0.3 })}
          >
            <img src={car.placeholderHeroImage} alt={car.name} className="gallery-card__image" loading="lazy" />
            <div className="gallery-card__info">
              <span className="gallery-card__name">{car.name}</span>
              <span className="gallery-card__tagline">{car.tagline}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
