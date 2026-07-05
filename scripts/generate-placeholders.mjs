import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public", "assets");

const cars = [
  { id: "ferrari-f80", name: "Ferrari F80", accent: "#ff1a1a", secondary: "#8b0000" },
  { id: "lamborghini-revuelto", name: "Lamborghini Revuelto", accent: "#ffb800", secondary: "#ff6a00" },
  { id: "bugatti-tourbillon", name: "Bugatti Tourbillon", accent: "#0a1e4d", secondary: "#050510" },
  { id: "pagani-utopia", name: "Pagani Utopia", accent: "#c9a24b", secondary: "#7a5c1e" },
  { id: "roadster", name: "Tesla Roadster", accent: "#e0e0e0", secondary: "#8a8a8a" },
  { id: "tesla-model-y", name: "Tesla Model Y", accent: "#3ecbff", secondary: "#0a5c8a" },
];

const detailLabels = ["fascia", "brakes", "diffuser", "cockpit"];

function heroSvg(name, accent, secondary) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c0c14"/>
      <stop offset="100%" stop-color="#05050a"/>
    </linearGradient>
    <linearGradient id="car" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${secondary}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <ellipse cx="800" cy="640" rx="620" ry="26" fill="black" opacity="0.5"/>
  <rect x="260" y="430" width="1080" height="180" rx="70" fill="url(#car)"/>
  <rect x="420" y="360" width="620" height="130" rx="60" fill="url(#car)" opacity="0.9"/>
  <circle cx="480" cy="620" r="70" fill="#111"/>
  <circle cx="1120" cy="620" r="70" fill="#111"/>
  <circle cx="480" cy="620" r="34" fill="#333"/>
  <circle cx="1120" cy="620" r="34" fill="#333"/>
  <text x="800" y="820" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#5a5a66" letter-spacing="4">PLACEHOLDER: ${name.toUpperCase()}</text>
</svg>`;
}

function colorSvg(name, accent, secondary) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#05050a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${secondary}"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="900" fill="#05050a"/>
  <rect width="1400" height="900" fill="url(#glow)"/>
  <rect x="260" y="360" width="880" height="220" rx="90" fill="url(#body)"/>
  <text x="700" y="800" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#5a5a66" letter-spacing="3">PLACEHOLDER COLOR REVEAL: ${name.toUpperCase()}</text>
</svg>`;
}

function detailSvg(label, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#0c0c14"/>
  <rect x="0" y="0" width="800" height="600" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="400" cy="280" r="140" fill="${accent}" opacity="0.15"/>
  <circle cx="400" cy="280" r="90" fill="${accent}" opacity="0.3"/>
  <text x="400" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#7a7a86" letter-spacing="2">${label.toUpperCase()}</text>
</svg>`;
}

mkdirSync(path.join(publicDir, "placeholders"), { recursive: true });
mkdirSync(path.join(publicDir, "details"), { recursive: true });

for (const car of cars) {
  writeFileSync(
    path.join(publicDir, "placeholders", `${car.id}-hero.svg`),
    heroSvg(car.name, car.accent, car.secondary),
  );
  writeFileSync(
    path.join(publicDir, "placeholders", `${car.id}-color.svg`),
    colorSvg(car.name, car.accent, car.secondary),
  );

  const detailPrefix = car.id === "lamborghini-revuelto" ? "revuelto"
    : car.id === "bugatti-tourbillon" ? "tourbillon"
    : car.id === "pagani-utopia" ? "utopia"
    : car.id === "tesla-model-y" ? "model-y"
    : car.id;

  for (const label of detailLabels) {
    writeFileSync(
      path.join(publicDir, "details", `${detailPrefix}-${label}.svg`),
      detailSvg(`${car.name} ${label}`, car.accent),
    );
  }
}

console.log("Placeholder assets generated for", cars.length, "cars.");
