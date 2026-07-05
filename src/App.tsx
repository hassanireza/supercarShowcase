import type React from "react";
import { useEffect } from "react";
import { cars } from "./data/cars";
import { CarSection } from "./components/CarSection";
import { ExplodedViewCenterpiece } from "./components/ExplodedViewCenterpiece";
import { GallerySection } from "./components/GallerySection";
import { FooterSection } from "./components/FooterSection";
import { IntroSection } from "./components/IntroSection";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ScrollTrigger } from "./utils/gsapSetup";
import "./styles/main.css";

function App(): React.ReactElement {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Section pin distances are computed from the current layout. Web fonts
    // (loaded async in main.css) can swap in after that first measurement and
    // change text/element heights, and images finishing decode can do the
    // same. Re-measuring once things settle prevents a visible jump the first
    // time the user scrolls past a section boundary.
    if ("fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => undefined);
    }
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      // Deliberately not killing all ScrollTriggers here: every component
      // that creates one already kills/reverts it in its own effect
      // cleanup. A blanket "kill everything" at this level can run out of
      // order relative to when individual pinned elements are torn down
      // (especially under React's dev-mode double-invoke or Vite HMR),
      // which can orphan a GSAP pin-spacer div in the DOM — leaving
      // leftover height that inflates the page's real scroll height beyond
      // what's actually visible, which shows up as a second/phantom
      // scrollbar until something forces a full layout recalculation.
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [reducedMotion]);

  return (
    <main className="app" data-motion={reducedMotion}>
      <IntroSection />
      {cars.map((car, index) =>
        car.isCenterpiece ? (
          <div key={car.id}>
            <CarSection car={car} reducedMotion={reducedMotion} index={index} />
            <ExplodedViewCenterpiece car={car} reducedMotion={reducedMotion} />
          </div>
        ) : (
          <CarSection key={car.id} car={car} reducedMotion={reducedMotion} index={index} />
        ),
      )}
      <GallerySection cars={cars} />
      <FooterSection />
    </main>
  );
}

export default App;
