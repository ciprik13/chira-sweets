import { Forum, Gilda_Display, Jost } from "next/font/google";

/** Jost: geometric, Futura-like — closest free match to the wordmark (Q-09 pending). */
export const jost = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

/**
 * Gilda Display: display serif from the design canvas, for accent lines only.
 * It has no Cyrillic and no italic: Russian text falls back per glyph to
 * Forum (below), and it is always set upright.
 */
export const gilda = Gilda_Display({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-gilda",
  display: "swap",
});

/**
 * Forum: Cyrillic fallback for Gilda Display (D-027). Listed right after Gilda
 * in --font-serif, so Russian accent text uses it instead of a system serif
 * (Georgia is missing on Android). Romanian stays in Gilda.
 */
export const forum = Forum({
  subsets: ["cyrillic"],
  weight: "400",
  variable: "--font-forum",
  display: "swap",
});
