import Link from "next/link";
import { InstagramIcon } from "@/components/brand/icons";
import { Logo } from "@/components/brand/logo";
import { shop } from "@/content/shop";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { instagramHref, phoneHref } from "@/lib/contact";
import { mainNav } from "./nav-items";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = 2026;
  const comingSoon = dict.home.contact.comingSoon;

  return (
    <footer className="bg-wine-deep pb-20 text-cream/85 sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="horizontal-goldfoil" className="w-48" />
          <p className="eyebrow mt-5 text-gold">{dict.footer.tagline}</p>
        </div>

        <div>
          <h2 className="eyebrow text-gold-bright">{dict.footer.pages}</h2>
          <ul className="mt-4 grid gap-0.5 text-sm">
            {mainNav(locale, dict).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1.5 hover:text-gold-bright"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-gold-bright">{dict.footer.contact}</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="sr-only">{dict.home.contact.phone}</dt>
              <dd>
                <a
                  href={phoneHref()}
                  className="inline-block py-1.5 hover:text-gold-bright"
                >
                  {shop.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-cream/60">{dict.home.contact.address}</dt>
              <dd>{shop.address?.[locale] ?? comingSoon}</dd>
            </div>
            <div>
              <dt className="text-cream/60">{dict.home.contact.hours}</dt>
              <dd className="whitespace-pre-line">
                {shop.hours?.[locale] ?? comingSoon}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="eyebrow text-gold-bright">{dict.footer.follow}</h2>
          <a
            href={instagramHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm hover:text-gold-bright"
          >
            <InstagramIcon className="size-5" />@{shop.social.instagram}
          </a>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {shop.legalEntity?.name ?? shop.name}. {dict.footer.rights}
            {shop.legalEntity && ` IDNO ${shop.legalEntity.idno}`}
          </p>
          <Link
            href={href(locale, "privacy")}
            className="inline-block py-2 hover:text-cream"
          >
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
