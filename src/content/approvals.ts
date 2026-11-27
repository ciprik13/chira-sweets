import { isDraftVisible } from "./catalog";
import { shop } from "./shop";

/**
 * D-028: text written in a real person's voice is published only after that
 * person approves it. Until then it shows in development and preview builds
 * (so it can be reviewed there) and production shows the neutral version.
 *
 * Approval is a checkbox in the CMS: "Date cofetărie" → "Textul lui Chiriac
 * David … aprobat" (content/settings/shop.json → founderTextApproved).
 */
export const FOUNDER_TEXT_APPROVED = shop.founderTextApproved;

export function showFounderText(): boolean {
  return FOUNDER_TEXT_APPROVED || isDraftVisible();
}
