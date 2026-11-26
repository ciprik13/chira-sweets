"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routes";
import { cn } from "@/lib/utils";

const fullNames: Record<Locale, string> = { ro: "Română", ru: "Русский" };

export function LanguageSwitch({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label={label}
      className={cn("flex items-center gap-1 text-xs", className)}
    >
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-gold/50">
              |
            </span>
          )}
          {l === locale ? (
            <span
              aria-current="true"
              className="px-1.5 py-2 font-medium tracking-[0.2em] text-gold-bright"
            >
              {localeLabels[l]}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              lang={l}
              aria-label={fullNames[l]}
              className="px-1.5 py-2 tracking-[0.2em] text-cream/80 hover:text-cream"
            >
              {localeLabels[l]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
