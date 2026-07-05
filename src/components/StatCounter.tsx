import type React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsapSetup";

interface StatCounterProps {
  label: string;
  targetValue: number;
  unit: string;
  decimals?: number;
  accentColor: string;
  shouldAnimate: boolean;
}

export function StatCounter({
  label,
  targetValue,
  unit,
  decimals = 0,
  accentColor,
  shouldAnimate,
}: StatCounterProps): React.ReactElement {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimatedRef.current) return;
    const node = valueRef.current;
    if (!node) return;

    hasAnimatedRef.current = true;
    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetValue,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = counter.value.toFixed(decimals);
      },
    });
  }, [shouldAnimate, targetValue, decimals]);

  return (
    <div className="stat-counter">
      <span className="stat-counter__label">{label}</span>
      <div className="stat-counter__value-row">
        <span ref={valueRef} className="stat-counter__value" style={{ color: accentColor }}>
          0
        </span>
        <span className="stat-counter__unit">{unit}</span>
      </div>
    </div>
  );
}
