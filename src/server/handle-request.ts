import {
  cakeRequestSchema,
  checkPhoto,
  eventRequestSchema,
  PHOTO_MAX_BYTES,
  type CakeRequest,
  type EventRequest,
  type Interest,
} from "../lib/forms/schema";

/*
 * POST /api/request — event and custom-cake requests → owner's Telegram (US-06, D-020).
 * Events arrive as JSON; cake requests as multipart (optional reference photo).
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

const MAX_JSON_BYTES = 10_000;
const MAX_MULTIPART_BYTES = PHOTO_MAX_BYTES + 64_000;
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

  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const isMultipart = contentType.includes("multipart/form-data");
  if (!isJson && !isMultipart) return json(415, { error: "content-type" });

  const declared = Number(request.headers.get("content-length") ?? 0);
  const limit = isJson ? MAX_JSON_BYTES : MAX_MULTIPART_BYTES;
  if (declared > limit) return json(413, { error: "too-large" });

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

  let body: Record<string, unknown>;
  let photo: File | null = null;
  try {
    if (isJson) {
      const raw = await request.text();
      if (raw.length > MAX_JSON_BYTES) return json(413, { error: "too-large" });
      const value: unknown = JSON.parse(raw);
      if (typeof value !== "object" || value === null || Array.isArray(value))
        return json(400, { error: "invalid-json" });
      body = value as Record<string, unknown>;
    } else {
      const form = await request.formData();
      body = {};
      for (const [key, value] of form.entries()) {
        if (key === "photo") {
          if (typeof value !== "string" && value.size > 0) photo = value;
        } else if (typeof value === "string") {
          body[key] = value;
        }
      }
    }
  } catch {
    return json(400, { error: "invalid-body" });
  }

  const parsed =
    body.type === "cake"
      ? cakeRequestSchema(now).safeParse(body)
      : eventRequestSchema(now).safeParse(body);
  const fields = parsed.success
    ? []
    : [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
  // Photos only travel with cake requests.
  if (photo && (body.type !== "cake" || checkPhoto(photo)))
    fields.push("photo");
  if (!parsed.success || fields.length) {
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

  const text =
    data.type === "cake" ? formatCakeMessage(data) : formatEventMessage(data);
  const sent = await sendTelegram(
    env.TELEGRAM_BOT_TOKEN,
    env.TELEGRAM_CHAT_ID,
    text,
    fetchImpl,
  );
  if (!sent) return json(502, { error: "delivery" });

  if (photo && data.type === "cake") {
    // The request text already arrived; a failed photo is reported but not fatal.
    const photoSent = await sendTelegramFile(
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHAT_ID,
      photo,
      `Foto de referință — ${data.name}, ${data.phone}`,
      fetchImpl,
    );
    if (!photoSent) return json(200, { ok: true, photo: "failed" });
  }

  return json(200, { ok: true });
}

/** jpg/png/webp as a photo; HEIC (iPhone) as a document, which Telegram accepts. */
async function sendTelegramFile(
  token: string,
  chatId: string,
  file: File,
  caption: string,
  fetchImpl: Fetch,
): Promise<boolean> {
  const asPhoto = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("caption", caption.slice(0, 1000));
  form.append(asPhoto ? "photo" : "document", file, file.name || "referinta");
  try {
    const res = await fetchImpl(
      `https://api.telegram.org/bot${token}/${asPhoto ? "sendPhoto" : "sendDocument"}`,
      { method: "POST", body: form },
    );
    return res.ok;
  } catch {
    return false;
  }
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

/** Custom-cake request for the owner, in Romanian. */
export function formatCakeMessage(data: CakeRequest): string {
  const lines = [
    "🎂 <b>Cerere nouă: tort la comandă</b>",
    "",
    `<b>Nume:</b> ${escapeHtml(data.name)}`,
    `<b>Telefon:</b> ${escapeHtml(data.phone)}`,
    `<b>Data:</b> ${escapeHtml(data.date)}`,
    `<b>Porții:</b> ${data.servings}`,
    `<b>Limba site-ului:</b> ${data.locale.toUpperCase()}`,
  ];
  if (data.flavour) lines.push(`<b>Gust:</b> ${escapeHtml(data.flavour)}`);
  if (data.decoration)
    lines.push("", "<b>Decor / detalii:</b>", escapeHtml(data.decoration));
  return lines.join("\n");
}
