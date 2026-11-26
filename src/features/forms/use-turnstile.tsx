"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

/** Cloudflare's always-pass test key is used only outside production builds. */
export const TURNSTILE_SITE_KEY =
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

/** Invisible Turnstile challenge: render `script` and attach `widgetRef` to a div. */
export function useTurnstile(locale: Locale) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);

  const render = useCallback(() => {
    if (!window.turnstile || !widgetRef.current || widgetId.current) return;
    if (!TURNSTILE_SITE_KEY) return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      language: locale,
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [locale]);

  useEffect(() => {
    if (ready) render();
  }, [ready, render]);

  const reset = useCallback(() => {
    setToken("");
    window.turnstile?.reset(widgetId.current);
  }, []);

  const script = (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onReady={() => setReady(true)}
    />
  );

  return { widgetRef, token, reset, script };
}
