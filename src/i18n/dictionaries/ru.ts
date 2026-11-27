import json from "../../../content/copy/ru.json";
import type { Dictionary } from "./ro";

/**
 * Russian UI copy, edited in the CMS (content/copy/ru.json).
 * `tsc` rejects a missing key; dictionaries.test.ts also checks both files
 * have exactly the same fields.
 */
export const ru: Dictionary = json;
