import type React from "react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapSetup";

export function FooterSection(): React.ReactElement {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    gsap.set(node, { opacity: 0, y: 20 });
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      onEnter: () => gsap.to(node, { opacity: 1, y: 0, duration: 1 }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <footer ref={footerRef} className="footer-section">
      <div className="footer-section__content">
        <h2 className="footer-section__title">Six cars. One obsession.</h2>
        <p className="footer-section__subtitle">
          Speed, craft, and electricity, told the way each one deserves.
        </p>
        <div className="footer-section__contact">
          <a href="mailto:hello@example.com" className="footer-section__link">
            hello@example.com
          </a>
          <div className="footer-section__meta">
            <span>Built with React, TypeScript, and GSAP.</span>
            <span>All specifications sourced from manufacturer data.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
