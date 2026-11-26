import { Cormorant_Garamond, Jost } from "next/font/google";

/** Jost: geometric, Futura-like — closest free match to the wordmark (Q-09 pending). */
export const jost = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

/** Cormorant Garamond italic: small accent lines only. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
