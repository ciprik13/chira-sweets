"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { shop } from "@/content/shop";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  eventFormFields,
  eventRequestSchema,
  interests,
  isoDay,
  type EventFormField,
} from "@/lib/forms/schema";
import { phoneHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type FormDict = Dictionary["pages"]["form"];
type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";

/** Cloudflare's always-pass test key is used only outside production builds. */
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
  (process.env.NODE_ENV === "production" ? "" : "1x00000000000000000000AA");

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function EventForm({
  locale,
  t,
  privacyHref,
}: {
  locale: Locale;
  t: FormDict;
  privacyHref: string;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<
    Partial<Record<EventFormField | "challenge", string>>
  >({});
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (
      !window.turnstile ||
      !widgetRef.current ||
      widgetId.current ||
      !SITE_KEY
    )
      return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      language: locale,
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [locale]);

  useEffect(() => {
    if (scriptReady) renderWidget();
  }, [scriptReady, renderWidget]);

  const errorText = (field: EventFormField): string =>
    field === "eventDate" ? t.errors.eventDate : t.errors[field];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "event" as const,
      locale,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      eventDate: String(fd.get("eventDate") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      turnstileToken: token || "pending",
    };

    const parsed = eventRequestSchema().safeParse(payload);
    const next: typeof errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as EventFormField;
        if (eventFormFields.includes(field) && !next[field])
          next[field] = errorText(field);
      }
    }
    if (!token) next.challenge = t.errors.challenge;
    setErrors(next);

    const firstInvalid = eventFormFields.find((f) => next[f]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }
    if (next.challenge) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus(res.status === 429 ? "rate-limited" : "error");
      }
    } catch {
      setStatus("error");
    } finally {
      setToken("");
      window.turnstile?.reset(widgetId.current);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-oak/40 bg-white p-8 text-center"
      >
        <CheckCircle2
          className="mx-auto size-10 text-wine"
          strokeWidth={1.25}
          aria-hidden
        />
        <h3 className="mt-4 text-lg tracking-[0.08em] text-wine uppercase">
          {t.successTitle}
        </h3>
        <p className="mt-2 text-brown">{t.successBody}</p>
        <Button
          variant="outlineDark"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  const field = (name: EventFormField) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className="grid gap-5 rounded-3xl border border-oak/40 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t.name}
            htmlFor={`${id}-name`}
            error={errors.name}
            errorId={`${id}-name-error`}
          >
            <input
              {...field("name")}
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field
            label={t.phone}
            hint={t.phoneHint}
            htmlFor={`${id}-phone`}
            error={errors.phone}
            errorId={`${id}-phone-error`}
          >
            <input
              {...field("phone")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={20}
              className={inputClass}
            />
          </Field>
          <Field
            label={t.eventDate}
            htmlFor={`${id}-eventDate`}
            error={errors.eventDate}
            errorId={`${id}-eventDate-error`}
          >
            <input
              {...field("eventDate")}
              type="date"
              min={isoDay(new Date())}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label={t.guests}
            htmlFor={`${id}-guests`}
            error={errors.guests}
            errorId={`${id}-guests-error`}
          >
            <input
              {...field("guests")}
              type="number"
              min={1}
              max={2000}
              inputMode="numeric"
              required
              className={inputClass}
            />
          </Field>
        </div>

        <fieldset
          aria-describedby={
            errors.interest ? `${id}-interest-error` : undefined
          }
        >
          <legend className="mb-2 text-sm font-medium text-ink">
            {t.interest}
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {interests.map((value) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-wine/20 px-3 text-sm has-[:checked]:border-wine has-[:checked]:bg-wine/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-bright"
              >
                <input
                  type="radio"
                  name="interest"
                  value={value}
                  required
                  className="accent-[#6b151e]"
                />
                {t.interests[value]}
              </label>
            ))}
          </div>
          {errors.interest && (
            <ErrorText id={`${id}-interest-error`}>{errors.interest}</ErrorText>
          )}
        </fieldset>

        <Field
          label={t.message}
          optional={t.optional}
          hint={t.messageHint}
          htmlFor={`${id}-message`}
          error={errors.message}
          errorId={`${id}-message-error`}
        >
          <textarea
            {...field("message")}
            rows={4}
            maxLength={1000}
            className={cn(inputClass, "h-auto py-3")}
          />
        </Field>

        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <div
          aria-hidden
          className="absolute -left-[9999px] h-0 overflow-hidden"
        >
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <div ref={widgetRef} />
        {errors.challenge && (
          <ErrorText id={`${id}-challenge-error`}>{errors.challenge}</ErrorText>
        )}

        {(status === "error" || status === "rate-limited") && (
          <div
            role="alert"
            className="rounded-xl border border-wine/30 bg-wine/5 p-4 text-sm text-wine"
          >
            <p className="font-medium">{t.errorTitle}</p>
            <p className="mt-1">
              {status === "rate-limited" ? t.errorRateLimited : t.errorBody}{" "}
              {status === "error" && (
                <a href={phoneHref()} className="font-medium underline">
                  {shop.phone.display}
                </a>
              )}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brown">
            {t.privacy}{" "}
            <Link href={privacyHref} className="underline hover:text-wine">
              {t.privacyLink}
            </Link>
            .
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="shrink-0"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden /> {t.submitting}
              </>
            ) : (
              t.submit
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-wine/20 bg-ivory px-4 text-ink placeholder:text-brown/50 aria-[invalid=true]:border-wine aria-[invalid=true]:bg-wine/5 focus-visible:border-wine";

function Field({
  label,
  hint,
  optional,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  optional?: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="font-normal text-brown"> ({optional})</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-brown">{hint}</p>}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="text-sm text-wine">
      {children}
    </p>
  );
}
