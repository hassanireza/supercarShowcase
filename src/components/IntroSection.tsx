import type React from "react";
export function IntroSection(): React.ReactElement {
  return (
    <section className="intro-section" aria-label="Introduction">
      <div className="intro-section__content">
        <span className="intro-section__eyebrow">A Showcase in Six Parts</span>
        <h1 className="intro-section__title">
          Speed has a shape.
          <br />
          Scroll to see it.
        </h1>
        <p className="intro-section__subtitle">
          Ferrari. Lamborghini. Bugatti. Pagani. Tesla. Six machines, six obsessions.
        </p>
        <div className="intro-section__scroll-cue" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
