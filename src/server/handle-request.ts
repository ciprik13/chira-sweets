import {
  eventRequestSchema,
  type EventRequest,
  type Interest,
} from "../lib/forms/schema";

/*
 * POST /api/request — event requests → owner's Telegram (US-06, D-020).
 * Runs as a Cloudflare Pages Function. Nothing is stored (PRD §7 Privacy).
 */

export type Env = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET?: string;
  /** Comma-separated list of allowed origins; defaults to the request's own origin. */
  ALLOWED_ORIGINS?: string;
  /** Optional Cloudflare rate-limiting binding. A WAF rule on /api/* is the main limit. */
  RATE_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
};

type Fetch = typeof fetch;

const MAX_BODY_BYTES = 10_000;
const TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function allowedOrigins(request: Request, env: Env): string[] {
  const configured = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return configured.length ? configured : [new URL(request.url).origin];
}

export async function handleRequest(
  request: Request,
  env: Env,
  fetchImpl: Fetch = fetch,
  now: Date = new Date(),
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { allow: "POST" } });
  }

  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins(request, env).includes(origin)) {
    return json(403, { error: "origin" });
  }

  if (
    !(request.headers.get("content-type") ?? "").includes("application/json")
  ) {
    return json(415, { error: "content-type" });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (env.RATE_LIMITER) {
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) return json(429, { error: "rate-limited" });
  }

  if (
    !env.TELEGRAM_BOT_TOKEN ||
    !env.TELEGRAM_CHAT_ID ||
    !env.TURNSTILE_SECRET
  ) {
    return json(503, { error: "not-configured" });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too-large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid-json" });
  }

  const parsed = eventRequestSchema(now).safeParse(body);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((i) => String(i.path[0]))),
    ];
    return json(400, { error: "invalid", fields });
  }
  const data = parsed.data;

  // Honeypot filled: pretend success, send nothing.
  if (data.website) return json(200, { ok: true });

  const verified = await verifyTurnstile(
    data.turnstileToken,
    ip,
    env.TURNSTILE_SECRET,
    fetchImpl,
  );
  if (!verified) return json(400, { error: "challenge" });

  const sent = await sendTelegram(
    env.TELEGRAM_BOT_TOKEN,
    env.TELEGRAM_CHAT_ID,
    formatEventMessage(data),
    fetchImpl,
  );
  if (!sent) return json(502, { error: "delivery" });

  return json(200, { ok: true });
}

async function verifyTurnstile(
  token: string,
  ip: string,
  secret: string,
  fetchImpl: Fetch,
): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip !== "unknown") form.append("remoteip", ip);
  try {
    const res = await fetchImpl(TURNSTILE_URL, { method: "POST", body: form });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

async function sendTelegram(
  token: string,
  chatId: string,
  text: string,
  fetchImpl: Fetch,
): Promise<boolean> {
  try {
    const res = await fetchImpl(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const interestLabels: Record<Interest, string> = {
  candyBar: "Candy bar",
  macaronTower: "Turn de macarons",
  giftBoxes: "Cutii cadou",
  other: "Altceva",
};

/** Message for the owner, always in Romanian, with the visitor's language noted. */
export function formatEventMessage(data: EventRequest): string {
  const lines = [
    "🎉 <b>Cerere nouă pentru eveniment</b>",
    "",
    `<b>Nume:</b> ${escapeHtml(data.name)}`,
    `<b>Telefon:</b> ${escapeHtml(data.phone)}`,
    `<b>Data:</b> ${escapeHtml(data.eventDate)}`,
    `<b>Invitați:</b> ${data.guests}`,
    `<b>Interes:</b> ${interestLabels[data.interest]}`,
    `<b>Limba site-ului:</b> ${data.locale.toUpperCase()}`,
  ];
  if (data.message) lines.push("", `<b>Mesaj:</b>`, escapeHtml(data.message));
  return lines.join("\n");
}
