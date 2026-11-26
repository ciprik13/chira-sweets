"use client";

import { CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { shop } from "@/content/shop";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { phoneHref } from "@/lib/contact";
import {
  cakeFormFields,
  cakeRequestSchema,
  checkPhoto,
  isoDay,
  photoPickerTypes,
  type CakeFormField,
} from "@/lib/forms/schema";
import { cn } from "@/lib/utils";
import { useTurnstile } from "./use-turnstile";

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";

/** Custom-cake request (Phase D) → owner's Telegram, with an optional reference photo. */
export function CakeForm({
  locale,
  dict,
  privacyHref,
}: {
  locale: Locale;
  dict: Dictionary;
  privacyHref: string;
}) {
  const t = dict.pages.cakeForm;
  const f = dict.pages.form;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { widgetRef, token, reset, script } = useTurnstile(locale);
  const [status, setStatus] = useState<Status>("idle");
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<CakeFormField | "challenge", string>>
  >({});

  const messages: Record<Exclude<CakeFormField, "photo">, string> = {
    name: f.errors.name,
    phone: f.errors.phone,
    date: t.errors.date,
    servings: t.errors.servings,
    flavour: t.errors.flavour,
    decoration: t.errors.decoration,
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "cake");
    fd.set("locale", locale);
    fd.set("turnstileToken", token || "pending");
    const photo = fd.get("photo");
    const picked = photo instanceof File && photo.size > 0 ? photo : null;
    // Re-encode in the browser: drops EXIF/GPS, applies rotation, converts
    // iPhone HEIC (where the browser can decode it) and shrinks large photos.
    const file = picked ? await reencodeAsJpeg(picked) : null;
    if (file) fd.set("photo", file, "referinta.jpg");
    else fd.delete("photo");

    const fields = Object.fromEntries(
      [...fd.entries()].filter(([k]) => k !== "photo"),
    );
    const parsed = cakeRequestSchema().safeParse(fields);
    const next: typeof errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Exclude<CakeFormField, "photo">;
        if (key in messages && !next[key]) next[key] = messages[key];
      }
    }
    const photoError = picked && !file ? "type" : checkPhoto(file);
    if (photoError)
      next.photo =
        photoError === "type" ? t.errors.photoType : t.errors.photoSize;
    if (!token) next.challenge = f.errors.challenge;
    setErrors(next);

    const first = cakeFormFields.find((k) => next[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (next.challenge) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/request", { method: "POST", body: fd });
      if (res.ok) {
        const body = (await res.json().catch(() => ({}))) as { photo?: string };
        setPhotoFailed(body.photo === "failed");
        setStatus("success");
        formRef.current?.reset();
        setPhotoName("");
      } else {
        setStatus(res.status === 429 ? "rate-limited" : "error");
      }
    } catch {
      setStatus("error");
    } finally {
      reset();
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
          {f.successTitle}
        </h3>
        <p className="mt-2 text-brown">{f.successBody}</p>
        {photoFailed && (
          <p className="mt-3 text-sm text-wine">{t.photoFailed}</p>
        )}
        <Button
          variant="outlineDark"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {f.sendAnother}
        </Button>
      </div>
    );
  }

  const field = (name: CakeFormField) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name]
      ? `${id}-${name}-error`
      : `${id}-${name}-hint`,
  });

  return (
    <>
      {script}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        encType="multipart/form-data"
        className="grid gap-5 rounded-3xl border border-oak/40 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id} name="name" label={f.name} error={errors.name}>
            <input
              {...field("name")}
              type="text"
              autoComplete="name"
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field
            id={id}
            name="phone"
            label={f.phone}
            hint={f.phoneHint}
            error={errors.phone}
          >
            <input
              {...field("phone")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
              className={inputClass}
            />
          </Field>
          <Field id={id} name="date" label={t.date} error={errors.date}>
            <input
              {...field("date")}
              type="date"
              min={isoDay(new Date())}
              className={inputClass}
            />
          </Field>
          <Field
            id={id}
            name="servings"
            label={t.servings}
            hint={t.servingsHint}
            error={errors.servings}
          >
            <input
              {...field("servings")}
              type="number"
              min={1}
              max={300}
              inputMode="numeric"
              className={inputClass}
            />
          </Field>
        </div>
        <Field
          id={id}
          name="flavour"
          label={t.flavour}
          optional={f.optional}
          hint={t.flavourHint}
          error={errors.flavour}
        >
          <input
            {...field("flavour")}
            type="text"
            maxLength={200}
            className={inputClass}
          />
        </Field>
        <Field
          id={id}
          name="decoration"
          label={t.decoration}
          optional={f.optional}
          hint={t.decorationHint}
          error={errors.decoration}
        >
          <textarea
            {...field("decoration")}
            rows={4}
            maxLength={1000}
            className={cn(inputClass, "h-auto py-3")}
          />
        </Field>

        <Field
          id={id}
          name="photo"
          label={t.photo}
          optional={f.optional}
          hint={t.photoHint}
          error={errors.photo}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-wine/40 px-4 text-sm text-wine hover:bg-wine/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-bright">
              <ImagePlus className="size-5" aria-hidden />
              <span>{photoName || t.photo}</span>
              <input
                ref={fileRef}
                {...field("photo")}
                type="file"
                accept={photoPickerTypes.join(",")}
                className="sr-only"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
            {photoName && (
              <button
                type="button"
                onClick={() => {
                  if (fileRef.current) fileRef.current.value = "";
                  setPhotoName("");
                }}
                className="inline-flex items-center gap-1 text-sm text-brown hover:text-wine"
              >
                <X className="size-4" aria-hidden /> {t.photoRemove}
              </button>
            )}
          </div>
        </Field>

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
          <p className="text-sm text-wine">{errors.challenge}</p>
        )}

        {(status === "error" || status === "rate-limited") && (
          <div
            role="alert"
            className="rounded-xl border border-wine/30 bg-wine/5 p-4 text-sm text-wine"
          >
            <p className="font-medium">{f.errorTitle}</p>
            <p className="mt-1">
              {status === "rate-limited" ? f.errorRateLimited : f.errorBody}{" "}
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
            {f.privacy}{" "}
            <Link href={privacyHref} className="underline hover:text-wine">
              {f.privacyLink}
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
                <Loader2 className="animate-spin" aria-hidden /> {f.submitting}
              </>
            ) : (
              f.submit
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

const MAX_EDGE = 2560;

/** Decodes an image and returns a metadata-free JPEG, or null if it can't be decoded. */
async function reencodeAsJpeg(file: File): Promise<File | null> {
  let source: ImageBitmap | HTMLImageElement | null = null;
  try {
    source = await createImageBitmap(file); // honours EXIF orientation
  } catch {
    // Safari decodes HEIC in <img> but not always in createImageBitmap.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      source = img;
    } catch {
      source = null;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  if (!source) return null;
  const w = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h = "naturalHeight" in source ? source.naturalHeight : source.height;
  if (!w || !h) return null;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.88),
  );
  return blob
    ? new File([blob], "referinta.jpg", { type: "image/jpeg" })
    : null;
}

const inputClass =
  "h-12 w-full rounded-xl border border-wine/20 bg-ivory px-4 text-ink placeholder:text-brown/50 aria-[invalid=true]:border-wine aria-[invalid=true]:bg-wine/5 focus-visible:border-wine";

function Field({
  id,
  name,
  label,
  hint,
  optional,
  error,
  children,
}: {
  id: string;
  name: CakeFormField;
  label: string;
  hint?: string;
  optional?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={`${id}-${name}`} className="text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="font-normal text-brown"> ({optional})</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-${name}-error`} className="text-sm text-wine">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-${name}-hint`} className="text-xs text-brown">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
