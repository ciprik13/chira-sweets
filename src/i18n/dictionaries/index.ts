import type { Locale } from "../config";
import { ro, type Dictionary } from "./ro";
import { ru } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { ro, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
