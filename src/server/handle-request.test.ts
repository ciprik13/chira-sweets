import { describe, expect, it, vi } from "vitest";
import { formatEventMessage, handleRequest, type Env } from "./handle-request";

const NOW = new Date("2026-11-26T12:00:00Z");
const ORIGIN = "https://chirasweets.md";

const env: Env = {
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_CHAT_ID: "123",
  TURNSTILE_SECRET: "test-secret",
};

const valid = {
  type: "event",
  locale: "ro",
  name: "Ana Popescu",
  phone: "079 123 456",
  eventDate: "2026-12-20",
  guests: 40,
  interest: "candyBar",
  message: "Nuntă, tonuri <pastel> & aurii",
  website: "",
  turnstileToken: "token",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}/api/request`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, ...headers },
    body: JSON.stringify(body),
  });
}

function mockFetch({ turnstile = true, telegram = true } = {}) {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u.includes("turnstile")) return Response.json({ success: turnstile });
    if (u.includes("api.telegram.org"))
      return new Response("{}", { status: telegram ? 200 : 500 });
    throw new Error(`unexpected fetch ${u}`);
  });
}

describe("handleRequest", () => {
  it("forwards a valid request to Telegram", async () => {
    const f = mockFetch();
    const res = await handleRequest(post(valid), env, f as typeof fetch, NOW);
    expect(res.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(2);
    const [url, init] = f.mock.calls[1] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const sent = JSON.parse(String(init.body)) as {
      chat_id: string;
      text: string;
    };
    expect(sent.chat_id).toBe("123");
    expect(sent.text).toContain("Ana Popescu");
    expect(sent.text).toContain("&lt;pastel&gt; &amp; aurii");
  });

  it("rejects other origins and methods", async () => {
    const f = mockFetch();
    expect(
      (
        await handleRequest(
          post(valid, { origin: "https://evil.test" }),
          env,
          f as typeof fetch,
          NOW,
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await handleRequest(
          new Request(`${ORIGIN}/api/request`),
          env,
          f as typeof fetch,
          NOW,
        )
      ).status,
    ).toBe(405);
    expect(f).not.toHaveBeenCalled();
  });

  it("reports invalid fields without calling Telegram", async () => {
    const f = mockFetch();
    const res = await handleRequest(
      post({ ...valid, phone: "abc", eventDate: "2026-01-01", guests: 0 }),
      env,
      f as typeof fetch,
      NOW,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { fields: string[] };
    expect(body.fields.sort()).toEqual(["eventDate", "guests", "phone"]);
    expect(f).not.toHaveBeenCalled();
  });

  it("fails when the anti-spam challenge fails", async () => {
    const f = mockFetch({ turnstile: false });
    const res = await handleRequest(post(valid), env, f as typeof fetch, NOW);
    expect(res.status).toBe(400);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("silently drops honeypot submissions", async () => {
    const f = mockFetch();
    const res = await handleRequest(
      post({ ...valid, website: "spam.example" }),
      env,
      f as typeof fetch,
      NOW,
    );
    expect(res.status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it("returns 503 when secrets are missing and 502 when Telegram fails", async () => {
    expect(
      (await handleRequest(post(valid), {}, mockFetch() as typeof fetch, NOW))
        .status,
    ).toBe(503);
    expect(
      (
        await handleRequest(
          post(valid),
          env,
          mockFetch({ telegram: false }) as typeof fetch,
          NOW,
        )
      ).status,
    ).toBe(502);
  });

  it("applies the optional rate limiter", async () => {
    const limited: Env = {
      ...env,
      RATE_LIMITER: { limit: async () => ({ success: false }) },
    };
    expect(
      (
        await handleRequest(
          post(valid),
          limited,
          mockFetch() as typeof fetch,
          NOW,
        )
      ).status,
    ).toBe(429);
  });
});

describe("formatEventMessage", () => {
  it("omits an empty message", () => {
    const text = formatEventMessage({ ...valid, message: "" } as never);
    expect(text).not.toContain("Mesaj");
    expect(text).toContain("Candy bar");
  });
});
