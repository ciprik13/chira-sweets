import { describe, expect, it } from "vitest";
import {
  channelHref,
  instagramDmHref,
  instagramHref,
  phoneHref,
  telegramHref,
  viberHref,
  whatsappHref,
} from "./contact";

describe("contact links", () => {
  it("builds a tel: link", () => {
    expect(phoneHref("+37379349097")).toBe("tel:+37379349097");
  });

  it("builds WhatsApp links with an encoded message", () => {
    expect(whatsappHref("+37379349097")).toBe("https://wa.me/37379349097");
    expect(whatsappHref("+37379349097", "Bună! Macarons & tort")).toBe(
      "https://wa.me/37379349097?text=Bun%C4%83!%20Macarons%20%26%20tort",
    );
  });

  it("builds a Viber chat link", () => {
    expect(viberHref("+37379349097")).toBe(
      "viber://chat?number=%2B37379349097",
    );
  });

  it("builds Telegram links for a phone number or a username", () => {
    expect(telegramHref("+37379349097")).toBe("https://t.me/+37379349097");
    expect(telegramHref("@chira_sweets")).toBe("https://t.me/chira_sweets");
  });

  it("builds an Instagram profile link", () => {
    expect(instagramHref("@chira_sweets")).toBe(
      "https://www.instagram.com/chira_sweets/",
    );
  });

  it("orders through an Instagram direct message", () => {
    expect(instagramDmHref("@chira_sweets")).toBe(
      "https://ig.me/m/chira_sweets",
    );
    expect(channelHref("instagram")).toBe("https://ig.me/m/chira_sweets");
  });
});
