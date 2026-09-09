// Configuracion de Jest via next/jest: usa el mismo transform SWC que Next
// (sin ts-jest) y resuelve el alias "@/..." leyendo tsconfig.json. Hoy solo
// se testea logica pura (lib/quiz/scoring.ts); por eso testEnvironment
// "node" y no jsdom. Config en .mjs para no romper el lint del repo
// (@typescript-eslint prohibe require()), igual que eslint.config.mjs /
// postcss.config.mjs.
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
};

export default createJestConfig(config);
