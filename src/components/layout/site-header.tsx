import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { OrderSheet } from "@/components/contact/order-sheet";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { LanguageSwitch } from "./language-switch";
import { MobileNav } from "./mobile-nav";
import { mainNav } from "./nav-items";

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const items = mainNav(locale, dict);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-wine/95 text-cream backdrop-blur supports-[backdrop-filter]:bg-wine/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20">
        <Link
          href={href(locale, "home")}
          className="shrink-0"
          aria-label="Chira Sweets"
        >
          <Logo
            variant="horizontal-goldfoil"
            className="w-36 sm:w-44"
            alt=""
            priority
          />
        </Link>

        <nav aria-label={dict.nav.label} className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.8rem] tracking-[0.2em] whitespace-nowrap text-cream/90 uppercase transition-colors hover:text-gold-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-6">
          <LanguageSwitch locale={locale} label={dict.nav.language} />
          <OrderSheet dict={dict} size="sm" className="hidden sm:inline-flex" />
          <MobileNav
            items={items}
            labels={{ menu: dict.nav.menu, close: dict.nav.close }}
          />
        </div>
      </div>
    </header>
  );
}
