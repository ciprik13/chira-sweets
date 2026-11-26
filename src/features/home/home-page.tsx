import { ArrowRight, Clock, MapPin, Phone, Store, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandIcon, InstagramIcon } from "@/components/brand/icons";
import { Logo } from "@/components/brand/logo";
import { OrderSheet } from "@/components/contact/order-sheet";
import { buttonVariants } from "@/components/ui/button";
import { categories, getBestsellers } from "@/content/catalog";
import { shop } from "@/content/shop";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { instagramHref, phoneHref } from "@/lib/contact";
import { bakeryJsonLd, jsonLdHtml } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/features/catalog/product-card";

/*
 * Homepage (sitemap.md, "Homepage sections").
 * Bestsellers (section 3) render only when the product data marks some;
 * draft samples never reach the production build.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.home;
  const bestsellers = getBestsellers().slice(0, 4);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-wine text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(138_42_51/0.9),transparent_60%),radial-gradient(ellipse_at_10%_100%,rgb(47_0_8/0.7),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-8 pb-14 sm:px-6 sm:pt-12 lg:grid-cols-[1.15fr_1fr] lg:pt-20 lg:pb-20">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="eyebrow text-gold-bright">{t.hero.eyebrow}</p>
            <h1 className="mt-5 text-[2rem] leading-tight font-normal tracking-[0.08em] uppercase sm:text-5xl lg:text-[3.4rem]">
              <span className="block">{t.hero.line1}</span>
              <span className="block text-gold-bright">{t.hero.line2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg lg:mx-0">
              {t.hero.lead}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <OrderSheet dict={dict} className="w-full sm:w-auto" />
              <Link
                href={href(locale, "catalog")}
                className={cn(
                  buttonVariants({ variant: "outlineLight", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                {t.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-32 sm:w-52 lg:order-2 lg:w-[360px]">
            <div aria-hidden className="glow absolute -inset-[45%]" />
            <Logo
              variant="round-goldfoil"
              className="relative w-full drop-shadow-[0_0_24px_rgb(246_215_122/0.25)]"
              alt=""
              priority
            />
          </div>
        </div>

        {/* Features strip, from the shop banner */}
        <div className="relative border-t border-gold/20">
          <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
            {t.features.map((f, i) => (
              <li
                key={f.title}
                className={cn(
                  "flex flex-col items-center gap-3 px-2 py-7 text-center",
                  i % 2 === 1 && "border-l border-gold/20",
                  i >= 2 && "border-t border-gold/20 md:border-t-0",
                  i === 2 && "md:border-l",
                )}
              >
                <BrandIcon name={f.icon} className="size-8 text-gold-bright" />
                <span className="eyebrow max-w-[12ch] leading-relaxed text-cream">
                  {f.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Categories */}
      <section
        className="fluted py-16 sm:py-24"
        aria-labelledby="home-categories"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="home-categories"
            eyebrow={t.categories.eyebrow}
            title={t.categories.title}
          />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={href(locale, "catalog", c.slug)}
                  className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-oak/30 bg-white/80 px-3 py-8 text-center shadow-[0_1px_0_rgb(90_42_30/0.04)] transition hover:-translate-y-0.5 hover:border-oak hover:shadow-lg hover:shadow-wine/5"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-wine text-gold-bright ring-1 ring-gold/40 ring-offset-4 ring-offset-white transition group-hover:bg-wine-soft">
                    <BrandIcon name={c.icon} className="size-7" />
                  </span>
                  <span className="text-[0.8rem] font-medium tracking-[0.16em] text-wine uppercase">
                    {c.name[locale]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              href={href(locale, "catalog")}
              className={buttonVariants({ variant: "outlineDark" })}
            >
              {t.categories.viewAll} <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Bestsellers */}
      {bestsellers.length > 0 && (
        <section
          className="bg-ivory pt-16 sm:pt-24"
          aria-labelledby="home-bestsellers"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              id="home-bestsellers"
              eyebrow={dict.catalog.bestsellers.eyebrow}
              title={dict.catalog.bestsellers.title}
            />
            <div className="mt-12">
              <ProductGrid products={bestsellers} locale={locale} dict={dict} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Custom cakes */}
      <section className="bg-ivory py-16 sm:py-24" aria-labelledby="home-cakes">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="home-cakes"
              eyebrow={t.cakes.eyebrow}
              title={t.cakes.title}
              align="left"
            />
            <p className="mt-6 max-w-xl leading-relaxed text-brown">
              {t.cakes.body}
            </p>
            <p className="mt-4 font-serif text-xl text-gold-ink">
              {t.cakes.price}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrderSheet dict={dict} variant="wine" size="lg">
                {t.cakes.cta}
              </OrderSheet>
              <Link
                href={`${href(locale, "catalog", "torturi")}#cake-request`}
                className={cn(
                  buttonVariants({ variant: "outlineDark", size: "lg" }),
                )}
              >
                {dict.pages.cakeForm.cta}
              </Link>
            </div>
          </div>
          <Podium />
        </div>
      </section>

      {/* 5. Events */}
      <section
        className="relative overflow-hidden bg-wine py-16 text-cream sm:py-24"
        aria-labelledby="home-events"
      >
        <div
          aria-hidden
          className="glow absolute -top-40 -right-40 size-[520px]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold-bright">{t.events.eyebrow}</p>
            <h2
              id="home-events"
              className="mt-4 text-3xl font-normal tracking-[0.1em] uppercase sm:text-4xl"
            >
              {t.events.title}
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-cream/85">
              {t.events.body}
            </p>
            <Link
              href={href(locale, "events")}
              className={cn(
                buttonVariants({ variant: "gold", size: "lg" }),
                "mt-8",
              )}
            >
              {t.events.cta} <ArrowRight aria-hidden />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {t.events.items.map((item) => (
              <li
                key={item}
                className="flex min-h-28 items-end rounded-2xl border border-gold/30 bg-white/[0.04] p-5 text-sm tracking-[0.14em] uppercase"
              >
                <span>
                  <span
                    aria-hidden
                    className="mb-3 block h-px w-8 bg-gold-bright"
                  />
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Delivery */}
      <section
        className="fluted py-16 sm:py-24"
        aria-labelledby="home-delivery"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="home-delivery"
            eyebrow={t.delivery.eyebrow}
            title={t.delivery.title}
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {t.delivery.items.map((item, i) => {
              const Icon = [Truck, MapPin, Store][i] ?? Truck;
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-oak/30 bg-white/80 p-7"
                >
                  <Icon
                    className="size-7 text-wine"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <h3 className="mt-5 text-sm font-medium tracking-[0.14em] text-wine uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brown">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 text-center">
            <Link
              href={href(locale, "delivery")}
              className={buttonVariants({ variant: "outlineDark" })}
            >
              {t.delivery.cta} <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. About */}
      <section className="bg-ivory py-16 sm:py-24" aria-labelledby="home-about">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Logo variant="round-wine" className="mx-auto w-16" alt="" />
          <SectionHeading
            id="home-about"
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            className="mt-8"
          />
          <p className="mt-6 leading-relaxed text-brown">{t.about.body}</p>
          <p className="mt-6 font-serif text-xl text-gold-ink">
            {dict.footer.tagline}
          </p>
          <Link
            href={href(locale, "about")}
            className={cn(buttonVariants({ variant: "link" }), "mt-6")}
          >
            {t.about.cta} <ArrowRight aria-hidden />
          </Link>
        </div>
      </section>

      {/* 8. Instagram (static, no third-party embed) */}
      <section
        className="border-y border-oak/30 bg-cream py-12"
        aria-labelledby="home-instagram"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <p className="eyebrow text-gold-ink">{t.instagram.eyebrow}</p>
            <h2
              id="home-instagram"
              className="mt-2 text-xl tracking-[0.1em] text-wine uppercase"
            >
              {t.instagram.title}
            </h2>
            <p className="mt-2 text-sm text-brown">{t.instagram.body}</p>
          </div>
          <a
            href={instagramHref()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "wine" })}
          >
            <InstagramIcon className="size-4" /> @{shop.social.instagram}
          </a>
        </div>
      </section>

      {/* 9. Contact */}
      <section
        className="bg-wine py-16 text-cream sm:py-24"
        aria-labelledby="home-contact"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="eyebrow text-gold-bright">{t.contact.eyebrow}</p>
            <h2
              id="home-contact"
              className="mt-4 text-3xl font-normal tracking-[0.1em] uppercase sm:text-4xl"
            >
              {t.contact.title}
            </h2>
          </div>
          <dl className="mt-12 grid gap-4 md:grid-cols-3">
            <ContactItem icon={<Phone aria-hidden />} label={t.contact.phone}>
              <a
                href={phoneHref()}
                className="text-2xl tracking-[0.08em] text-gold-bright hover:underline"
              >
                {shop.phone.display}
              </a>
            </ContactItem>
            <ContactItem
              icon={<MapPin aria-hidden />}
              label={t.contact.address}
            >
              {shop.address?.[locale] ?? t.contact.comingSoon}
            </ContactItem>
            <ContactItem icon={<Clock aria-hidden />} label={t.contact.hours}>
              {shop.hours?.[locale] ?? t.contact.comingSoon}
            </ContactItem>
          </dl>
          <div className="mt-10 text-center">
            <OrderSheet dict={dict} />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(bakeryJsonLd(locale))}
      />
    </>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  align = "center",
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <p className="eyebrow text-gold-ink">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 text-3xl font-normal tracking-[0.1em] text-wine uppercase sm:text-4xl"
      >
        {title}
      </h2>
      <div
        className={cn("foil-rule mt-6 w-24", align === "center" && "mx-auto")}
      />
    </div>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/25 bg-white/[0.04] p-7 text-center [&>svg]:size-6 [&>svg]:text-gold-bright">
      {icon}
      <dt className="eyebrow text-cream/70">{label}</dt>
      <dd className="text-lg">{children}</dd>
    </div>
  );
}

/** Decorative podiums, echoing the product stands on the shop banners. Replaced by a real photo when C-04 arrives. */
function Podium() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl bg-wine"
    >
      <div className="glow absolute inset-x-0 -top-1/3 h-full" />
      <div className="absolute inset-x-[12%] bottom-[14%] h-[22%] rounded-[50%] bg-[#a8454d] shadow-[inset_0_-10px_20px_rgb(47_0_8/0.35)]" />
      <div className="absolute inset-x-[12%] bottom-[24%] h-[16%] rounded-[50%] bg-[#c0646b]" />
      <div className="absolute bottom-[34%] left-1/2 flex -translate-x-1/2 flex-col items-center">
        <BrandIcon
          name="cake"
          className="size-28 text-gold-bright sm:size-36"
        />
      </div>
      <div className="absolute top-6 left-6">
        <Logo
          variant="horizontal-goldfoil"
          className="w-32 opacity-90"
          alt=""
        />
      </div>
    </div>
  );
}
