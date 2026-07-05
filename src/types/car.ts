export interface CarStats {
  zeroToSixty: string;
  topSpeed: string;
  horsepower: string;
  weight: string;
}

export interface CarStatTargets {
  zeroToSixty: number;
  topSpeed: number;
  horsepower: number;
  weight: number;
}

export interface DetailPoint {
  id: string;
  label: string;
  caption: string;
  image: string;
}

export interface HeroFrameSequence {
  /** Folder under /public/assets/frames containing frame_0001.webp, frame_0002.webp, ... */
  path: string;
  /** Total number of frames in that folder. */
  frameCount: number;
}

export interface CarData {
  id: string;
  name: string;
  manufacturer: string;
  tagline: string;
  accentColor: string;
  accentColorSecondary: string;
  /** Scroll-scrubbed image sequence shown behind the section title. */
  heroFrames: HeroFrameSequence;
  placeholderHeroImage: string;
  details: DetailPoint[];
  stats: CarStats;
  statTargets: CarStatTargets;
  statUnits: {
    zeroToSixty: string;
    topSpeed: string;
    horsepower: string;
    weight: string;
  };
  isCenterpiece?: boolean;
}

export type ReducedMotionMode = "full" | "reduced";
