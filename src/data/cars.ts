import type { CarData } from "../types/car";

// Real asset paths, matching the files under /public/assets exactly as they
// exist on disk. See README for the exact folder structure.
//
// NOTE on naming: the `details/` folder uses a shorter brand-shorthand
// prefix for four cars (revuelto, tourbillon, utopia, model-y) instead of
// the full car id, while `placeholders/` and `videos/` use the full id.

export const cars: CarData[] = [
  {
    id: "roadster",
    name: "Tesla Roadster",
    manufacturer: "Tesla",
    tagline: "The fastest production car ever conceived. Still coming.",
    accentColor: "#e0e0e0",
    accentColorSecondary: "#8a8a8a",
    heroFrames: {
      path: "/assets/frames/roadster",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/roadster
    },
    placeholderHeroImage: "/assets/placeholders/roadster-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "No grille needed. Nothing here to cool the old way.",
        image: "/assets/details/roadster-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Regenerative braking that thinks faster than you do.",
        image: "/assets/details/roadster-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Silent thrust. The only sound left is the wind.",
        image: "/assets/details/roadster-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A cabin built around a screen instead of a tachometer.",
        image: "/assets/details/roadster-cockpit.webp",
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
      path: "/assets/frames/ferrari-f80",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/ferrari-f80
    },
    placeholderHeroImage: "/assets/placeholders/ferrari-f80-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Air does the talking before the engine ever does.",
        image: "/assets/details/ferrari-f80-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Carbon ceramic discs built to erase speed on command.",
        image: "/assets/details/ferrari-f80-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Every channel here earns its keep at 300 km/h.",
        image: "/assets/details/ferrari-f80-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A seat fused to the chassis. Nothing sits between you and it.",
        image: "/assets/details/ferrari-f80-cockpit.webp",
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
      path: "/assets/frames/lamborghini-revuelto",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/lamborghini-revuelto
    },
    placeholderHeroImage: "/assets/placeholders/lamborghini-revuelto-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "A face built to intimidate before it ever moves.",
        image: "/assets/details/revuelto-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Three motors, one V12, zero hesitation.",
        image: "/assets/details/revuelto-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "The exhaust note starts here and never apologizes.",
        image: "/assets/details/revuelto-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "Fighter jet ergonomics for a car that flies low.",
        image: "/assets/details/revuelto-cockpit.webp",
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
      path: "/assets/frames/bugatti-tourbillon",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/bugatti-tourbillon
    },
    placeholderHeroImage: "/assets/placeholders/bugatti-tourbillon-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "The horseshoe grille. Unmistakable from any distance.",
        image: "/assets/details/tourbillon-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Titanium construction, machined like a fine watch movement.",
        image: "/assets/details/tourbillon-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "A hybrid V16 exhales through here at full throttle.",
        image: "/assets/details/tourbillon-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "An analog instrument cluster in a digital era. On purpose.",
        image: "/assets/details/tourbillon-cockpit.webp",
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
      path: "/assets/frames/pagani-utopia",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/pagani-utopia
    },
    placeholderHeroImage: "/assets/placeholders/pagani-utopia-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Every curve here was sculpted, never simulated.",
        image: "/assets/details/utopia-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Forged alloys finished by hand, not by robot arm.",
        image: "/assets/details/utopia-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Quad titanium exhausts, tuned like an instrument.",
        image: "/assets/details/utopia-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "Exposed mechanisms. Nothing hidden, everything earned.",
        image: "/assets/details/utopia-cockpit.webp",
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
      path: "/assets/frames/tesla-model-y",
      frameCount: 180, // TODO: verify against actual file count in public/assets/frames/tesla-model-y
    },
    placeholderHeroImage: "/assets/placeholders/tesla-model-y-hero.webp",
    details: [
      {
        id: "front-fascia",
        label: "Front Fascia",
        caption: "Clean lines, because there is no engine left to hide.",
        image: "/assets/details/model-y-fascia.webp",
      },
      {
        id: "wheels-brakes",
        label: "Wheels & Brakes",
        caption: "Aero wheels shaped by wind tunnels, not trends.",
        image: "/assets/details/model-y-brakes.webp",
      },
      {
        id: "rear-diffuser",
        label: "Rear Diffuser",
        caption: "Efficiency written into every millimeter out back.",
        image: "/assets/details/model-y-diffuser.webp",
      },
      {
        id: "cockpit",
        label: "Cockpit",
        caption: "A cabin that gets smarter every time it updates.",
        image: "/assets/details/model-y-cockpit.webp",
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
