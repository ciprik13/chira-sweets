import { afterEach, describe, expect, it, vi } from "vitest";
import { FOUNDER_TEXT_APPROVED, showFounderText } from "./approvals";

describe("founder text approval gate", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is hidden in production until approved", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SHOW_DRAFTS", "");
    expect(showFounderText()).toBe(FOUNDER_TEXT_APPROVED);
  });

  it("is shown on preview builds for review", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SHOW_DRAFTS", "1");
    expect(showFounderText()).toBe(true);
  });
});
