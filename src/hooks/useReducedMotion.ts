import { useEffect, useState } from "react";
import type { ReducedMotionMode } from "../types/car";

function detectLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  const lowCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2;
  return lowMemory || lowCores;
}

export function useReducedMotion(): ReducedMotionMode {
  const [mode, setMode] = useState<ReducedMotionMode>("full");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowEnd = detectLowEndDevice();

    const evaluate = () => {
      setMode(mediaQuery.matches || lowEnd ? "reduced" : "full");
    };

    evaluate();
    mediaQuery.addEventListener("change", evaluate);
    return () => mediaQuery.removeEventListener("change", evaluate);
  }, []);

  return mode;
}
