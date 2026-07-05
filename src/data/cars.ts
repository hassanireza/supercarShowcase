import type { CarData } from "../types/car";

// Real asset paths, matching the files under /public/assets exactly as they
// exist on disk. See README for the exact folder structure.
//
// NOTE on naming: the `details/` folder uses a shorter brand-shorthand
// prefix for four cars (revuelto, tourbillon, utopia, model-y) instead of
// the full car id, while `placeholders/` and `videos/` use the full id.

// GitHub Pages serves this app from /<repo>/, not the domain root, so every
// asset path below (all plain strings, not static imports Vite can rewrite)
// needs the base prefix applied manually. import.meta.env.BASE_URL is "/"
// locally and "/supercarShowcase/" in production (set via GITHUB_PAGES_BASE
// in vite.config.ts). Strip any leading slash off the raw path before
// joining so we don't end up with a double slash.
const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const cars: CarData[] = [
  {
    id: "roadster",
    name: "Tesla Roadster",
    manufacturer: "Tesla",
    tagline: "The fastest production car ever conceived. Still coming.",
    accentColor: "#e0e0e0",
    accentColorSecondary: "#8a8a8a",
    heroFrames: {
      path: asset("/assets/frames/roadster"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/roadster
    },
    placeholderHeroImage: asset("/assets/placeholders/roadster-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "No grille needed. Nothing here to cool the old way.",
        image: asset("/assets/details/roadster-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Regenerative braking that thinks faster than you do.",
        image: asset("/assets/details/roadster-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Silent thrust. The only sound left is the wind.",
        image: asset("/assets/details/roadster-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A cabin built around a screen instead of a tachometer.",
        image: asset("/assets/details/roadster-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "1.9s",
      topSpeed: "400 km/h",
      horsepower: "10000 Nm*",
      weight: "1900 kg",
    },
    statTargets: {
      zeroToSixty: 1.9,
      topSpeed: 400,
      horsepower: 1200,
      weight: 1900,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
  {
    id: "ferrari-f80",
    name: "Ferrari F80",
    manufacturer: "Ferrari",
    tagline: "Obsession, distilled into a shape.",
    accentColor: "#ff1a1a",
    accentColorSecondary: "#8b0000",
    heroFrames: {
      path: asset("/assets/frames/ferrari-f80"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/ferrari-f80
    },
    placeholderHeroImage: asset("/assets/placeholders/ferrari-f80-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Air does the talking before the engine ever does.",
        image: asset("/assets/details/ferrari-f80-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Carbon ceramic discs built to erase speed on command.",
        image: asset("/assets/details/ferrari-f80-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Every channel here earns its keep at 300 km/h.",
        image: asset("/assets/details/ferrari-f80-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A seat fused to the chassis. Nothing sits between you and it.",
        image: asset("/assets/details/ferrari-f80-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "2.15s",
      topSpeed: "350 km/h",
      horsepower: "1200 hp",
      weight: "1525 kg",
    },
    statTargets: {
      zeroToSixty: 2.15,
      topSpeed: 350,
      horsepower: 1200,
      weight: 1525,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
  {
    id: "lamborghini-revuelto",
    name: "Lamborghini Revuelto",
    manufacturer: "Lamborghini",
    tagline: "Rage, engineered into rhythm.",
    accentColor: "#ffb800",
    accentColorSecondary: "#ff6a00",
    heroFrames: {
      path: asset("/assets/frames/lamborghini-revuelto"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/lamborghini-revuelto
    },
    placeholderHeroImage: asset("/assets/placeholders/lamborghini-revuelto-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "A face built to intimidate before it ever moves.",
        image: asset("/assets/details/revuelto-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Three motors, one V12, zero hesitation.",
        image: asset("/assets/details/revuelto-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "The exhaust note starts here and never apologizes.",
        image: asset("/assets/details/revuelto-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "Fighter jet ergonomics for a car that flies low.",
        image: asset("/assets/details/revuelto-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "2.5s",
      topSpeed: "350 km/h",
      horsepower: "1015 hp",
      weight: "1772 kg",
    },
    statTargets: {
      zeroToSixty: 2.5,
      topSpeed: 350,
      horsepower: 1015,
      weight: 1772,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
  {
    id: "bugatti-tourbillon",
    name: "Bugatti Tourbillon",
    manufacturer: "Bugatti",
    tagline: "Engineering obsession, worn on the outside.",
    accentColor: "#0a1e4d",
    accentColorSecondary: "#050510",
    isCenterpiece: true,
    heroFrames: {
      path: asset("/assets/frames/bugatti-tourbillon"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/bugatti-tourbillon
    },
    placeholderHeroImage: asset("/assets/placeholders/bugatti-tourbillon-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "The horseshoe grille. Unmistakable from any distance.",
        image: asset("/assets/details/tourbillon-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Titanium construction, machined like a fine watch movement.",
        image: asset("/assets/details/tourbillon-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "A hybrid V16 exhales through here at full throttle.",
        image: asset("/assets/details/tourbillon-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "An analog instrument cluster in a digital era. On purpose.",
        image: asset("/assets/details/tourbillon-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "2.0s",
      topSpeed: "445 km/h",
      horsepower: "1800 hp",
      weight: "1995 kg",
    },
    statTargets: {
      zeroToSixty: 2.0,
      topSpeed: 445,
      horsepower: 1800,
      weight: 1995,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
  {
    id: "pagani-utopia",
    name: "Pagani Utopia",
    manufacturer: "Pagani",
    tagline: "Craftsmanship that refuses to be automated.",
    accentColor: "#c9a24b",
    accentColorSecondary: "#7a5c1e",
    heroFrames: {
      path: asset("/assets/frames/pagani-utopia"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/pagani-utopia
    },
    placeholderHeroImage: asset("/assets/placeholders/pagani-utopia-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Every curve here was sculpted, never simulated.",
        image: asset("/assets/details/utopia-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Forged alloys finished by hand, not by robot arm.",
        image: asset("/assets/details/utopia-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Quad titanium exhausts, tuned like an instrument.",
        image: asset("/assets/details/utopia-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "Exposed mechanisms. Nothing hidden, everything earned.",
        image: asset("/assets/details/utopia-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "3.3s",
      topSpeed: "350 km/h",
      horsepower: "864 hp",
      weight: "1280 kg",
    },
    statTargets: {
      zeroToSixty: 3.3,
      topSpeed: 350,
      horsepower: 864,
      weight: 1280,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
  {
    id: "tesla-model-y",
    name: "Tesla Model Y",
    manufacturer: "Tesla",
    tagline: "The electric future, already parked in your driveway.",
    accentColor: "#3ecbff",
    accentColorSecondary: "#0a5c8a",
    heroFrames: {
      path: asset("/assets/frames/tesla-model-y"),
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/tesla-model-y
    },
    placeholderHeroImage: asset("/assets/placeholders/tesla-model-y-hero.webp"),
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Clean lines, because there is no engine left to hide.",
        image: asset("/assets/details/model-y-fascia.webp"),
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Aero wheels shaped by wind tunnels, not trends.",
        image: asset("/assets/details/model-y-brakes.webp"),
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Efficiency written into every millimeter out back.",
        image: asset("/assets/details/model-y-diffuser.webp"),
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A cabin that gets smarter every time it updates.",
        image: asset("/assets/details/model-y-cockpit.webp"),
      },
    ],
    stats: {
      zeroToSixty: "3.5s",
      topSpeed: "250 km/h",
      horsepower: "456 hp",
      weight: "1997 kg",
    },
    statTargets: {
      zeroToSixty: 3.5,
      topSpeed: 250,
      horsepower: 456,
      weight: 1997,
    },
    statUnits: {
      zeroToSixty: "s",
      topSpeed: "km/h",
      horsepower: "hp",
      weight: "kg",
    },
  },
];
