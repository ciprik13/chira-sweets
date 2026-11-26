import { z } from "zod";

/*
 * Shared by the browser form and the Cloudflare Pages Function
 * (functions/api/request.ts). Keep imports relative-free of "@/" so the
 * function bundler can resolve this file.
 */

export const interests = [
  "candyBar",
  "macaronTower",
  "giftBoxes",
  "other",
] as const;
export type Interest = (typeof interests)[number];

/** Moldovan and international numbers: digits, spaces, (), -, optional leading +. */
const phonePattern = /^\+?[0-9][0-9\s()-]{6,18}$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

/** ISO date (YYYY-MM-DD) of `now` minus `days`, in UTC. */
export function isoDay(now: Date, days = 0): string {
  const d = new Date(now.getTime() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export function eventRequestSchema(now: Date = new Date()) {
  // One day of tolerance so a visitor late in the evening (UTC+2/+3) is not rejected.
  const earliest = isoDay(now, 1);
  return z.object({
    type: z.literal("event"),
    locale: z.enum(["ro", "ru"]),
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(phonePattern),
    eventDate: z
      .string()
      .regex(isoDate)
      .refine((v) => v >= earliest, { message: "past" }),
    guests: z.coerce.number().int().min(1).max(2000),
    interest: z.enum(interests),
    message: z.string().trim().max(1000).default(""),
    /** Honeypot: hidden from people, bots tend to fill it. */
    website: z.string().max(200).default(""),
    turnstileToken: z.string().min(1).max(2048),
  });
}

export type EventRequest = z.infer<ReturnType<typeof eventRequestSchema>>;

/** Fields shown in the form, in display order (used to map errors to inputs). */
export const eventFormFields = [
  "name",
  "phone",
  "eventDate",
  "guests",
  "interest",
  "message",
] as const;
export type EventFormField = (typeof eventFormFields)[number];

/* ---------- Custom cake request (Phase D) ---------- */

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
/** What the server accepts (checked by magic bytes, see image.ts). */
export const photoTypes = ["image/jpeg", "image/png", "image/webp"] as const;
/** What the file picker offers: iPhone HEIC is converted to JPEG in the browser. */
export const photoPickerTypes = [...photoTypes, "image/heic", "image/heif"];

export function cakeRequestSchema(now: Date = new Date()) {
  const earliest = isoDay(now, 1);
  return z.object({
    type: z.literal("cake"),
    locale: z.enum(["ro", "ru"]),
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(phonePattern),
    date: z
      .string()
      .regex(isoDate)
      .refine((v) => v >= earliest, { message: "past" }),
    servings: z.coerce.number().int().min(1).max(300),
    flavour: z.string().trim().max(200).default(""),
    decoration: z.string().trim().max(1000).default(""),
    website: z.string().max(200).default(""),
    turnstileToken: z.string().min(1).max(2048),
  });
}

export type CakeRequest = z.infer<ReturnType<typeof cakeRequestSchema>>;

export const cakeFormFields = [
  "name",
  "phone",
  "date",
  "servings",
  "flavour",
  "decoration",
  "photo",
] as const;
export type CakeFormField = (typeof cakeFormFields)[number];

/** Returns an error code for an unacceptable reference photo, or null. */
export function checkPhoto(
  file: { size: number; type: string } | null | undefined,
): "type" | "size" | null {
  if (!file || file.size === 0) return null;
  if (!(photoTypes as readonly string[]).includes(file.type)) return "type";
  if (file.size > PHOTO_MAX_BYTES) return "size";
  return null;
}
