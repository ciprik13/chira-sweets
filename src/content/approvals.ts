import { isDraftVisible } from "./catalog";

/**
 * D-028: text written in a real person's voice is published only after that person
 * approves it. Until then it shows in development and preview builds (so it
 * can be reviewed there) and production shows the neutral version.
 *
 * Set to `true` once Chiriac David has approved the About text and the quote
 * (launch checklist, docs/deploy.md).
 */
export const FOUNDER_TEXT_APPROVED = false;

export function showFounderText(): boolean {
  return FOUNDER_TEXT_APPROVED || isDraftVisible();
}
