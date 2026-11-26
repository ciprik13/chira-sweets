import { ArrowRight, Clock, MapPin, Store, Timer, Truck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ContactChannels } from "@/components/contact/contact-channels";
import { OrderSheet } from "@/components/contact/order-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { shop } from "@/content/shop";
import { EventForm } from "@/features/events/event-form";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { bakeryJsonLd, faqJsonLd, jsonLdHtml } from "@/lib/seo";
import { cn } from "@/lib/utils";

function crumbs(locale: Locale, label: string) {
  return [{ label: "Chira Sweets", href: href(locale, "home") }, { label }];
}

function mapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Chișinău`)}`;
}

/* ---------- Events (US-06) ---------- */
export function EventsPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.events;
  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbs={crumbs(locale, dict.nav.events)}
        crumbsLabel={dict.catalog.breadcrumb}
      >
        <a
          href="#request"
          className={cn(
            buttonVariants({ variant: "gold", size: "lg" }),
            "mt-8",
          )}
        >
          {dict.pages.form.title} <ArrowRight aria-hidden />
        </a>
      </PageHeader>

      <section className="fluted py-14 sm:py-20" aria-labelledby="formats">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2
            id="formats"
            className="text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl"
          >
            {t.formatsTitle}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.formats.map((f) => (
              <li
                key={f.title}
                className="rounded-2xl border border-oak/40 bg-white/90 p-6"
              >
                <span aria-hidden className="block h-px w-10 bg-gold" />
                <h3 className="mt-4 text-sm font-medium tracking-[0.14em] text-wine uppercase">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brown">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl">
            {t.stepsTitle}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-4 rounded-2xl bg-white/70 p-6"
              >
                <span className="font-serif text-4xl text-gold-ink" aria-hidden>
                  {i + 1}
                </span>
                <span>
                  <span className="block font-medium text-wine">{s.title}</span>
                  <span className="mt-1 block text-sm text-brown">
                    {s.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-serif text-lg text-gold-ink">
            {t.pricingNote}
          </p>
        </div>
      </section>

      <section
        id="request"
        className="scroll-mt-24 bg-ivory py-14 sm:py-20"
        aria-labelledby="request-title"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2
            id="request-title"
            className="text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl"
          >
            {dict.pages.form.title}
          </h2>
          <p className="mt-3 mb-8 text-brown">{dict.pages.form.lead}</p>
          <EventForm
            locale={locale}
            t={dict.pages.form}
            privacyHref={href(locale, "privacy")}
          />
        </div>
      </section>
    </>
  );
}

/* ---------- Delivery (US-05) ---------- */
export function DeliveryPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.delivery;
  const c = dict.pages.common;
  const icons = {
    chisinau: Truck,
    moldova: MapPin,
    pickup: Store,
    leadTime: Timer,
  } as const;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbs={crumbs(locale, dict.nav.delivery)}
        crumbsLabel={dict.catalog.breadcrumb}
      />
      <section className="fluted py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2">
          {t.sections.map((s) => {
            const Icon = icons[s.id as keyof typeof icons] ?? Truck;
            return (
              <article
                key={s.id}
                id={s.id}
                className="rounded-2xl border border-oak/40 bg-white/90 p-7"
              >
                <Icon
                  className="size-7 text-wine"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <h2 className="mt-4 text-sm font-medium tracking-[0.14em] text-wine uppercase">
                  {s.title}
                </h2>
                {s.id === "pickup" ? (
                  <dl className="mt-3 grid gap-2 text-sm text-brown">
                    <div className="flex gap-2">
                      <dt className="sr-only">{dict.home.contact.address}</dt>
                      <MapPin
                        className="size-4 shrink-0 text-gold-ink"
                        aria-hidden
                      />
                      <dd>
                        {shop.address ? (
                          <a
                            href={mapsHref(shop.address[locale])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {shop.address[locale]} — {c.openMap}
                          </a>
                        ) : (
                          `${dict.home.contact.address}: ${c.comingSoon}`
                        )}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="sr-only">{dict.home.contact.hours}</dt>
                      <Clock
                        className="size-4 shrink-0 text-gold-ink"
                        aria-hidden
                      />
                      <dd>
                        {shop.hours?.[locale] ??
                          `${dict.home.contact.hours}: ${c.comingSoon}`}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-brown">
                    {c.pendingNote}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <OrderSheet dict={dict} variant="wine">
            {c.askUs}
          </OrderSheet>
        </div>
      </section>
    </>
  );
}

/* ---------- About (US-07) ---------- */
export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.about;
  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbs={crumbs(locale, dict.nav.about)}
        crumbsLabel={dict.catalog.breadcrumb}
      />
      <section className="bg-ivory py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5 text-lg leading-relaxed text-brown">
            {t.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="fluted relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl border border-oak/40">
            <div aria-hidden className="glow absolute inset-0" />
            <Logo variant="round-wine" className="relative w-1/2" alt="" />
          </div>
        </div>
      </section>
      <section className="fluted py-14 sm:py-20" aria-labelledby="values">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2
            id="values"
            className="text-center text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl"
          >
            {t.valuesTitle}
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {t.values.map((v) => (
              <li
                key={v.title}
                className="rounded-2xl border border-oak/40 bg-white/90 p-7 text-center"
              >
                <h3 className="font-serif text-2xl text-gold-ink">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brown">
                  {v.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-wine py-14 text-center text-cream sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl tracking-[0.1em] uppercase sm:text-3xl">
            {t.visitTitle}
          </h2>
          <p className="mt-4 text-cream/85">{t.visitBody}</p>
          <Link
            href={href(locale, "contact")}
            className={cn(
              buttonVariants({ variant: "gold", size: "lg" }),
              "mt-8",
            )}
          >
            {dict.nav.contact} <ArrowRight aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ---------- FAQ (US-08) ---------- */
export function FaqPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.faq;
  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbs={crumbs(locale, dict.nav.faq)}
        crumbsLabel={dict.catalog.breadcrumb}
      />
      <section className="fluted py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid gap-3">
            {t.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-oak/40 bg-white/90 open:border-wine/30"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-wine [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-xl text-gold-ink transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-brown">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <OrderSheet dict={dict} variant="wine">
              {dict.pages.common.askUs}
            </OrderSheet>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd(t.items))}
      />
    </>
  );
}

/* ---------- Contact ---------- */
export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.contact;
  const c = dict.pages.common;
  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbs={crumbs(locale, dict.nav.contact)}
        crumbsLabel={dict.catalog.breadcrumb}
      />
      <section className="fluted py-14 sm:py-20" aria-labelledby="channels">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="channels" className="sr-only">
            {t.channelsTitle}
          </h2>
          <ContactChannels dict={dict} />
          <dl className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-oak/40 bg-white/90 p-6">
              <dt className="eyebrow text-gold-ink">
                {dict.home.contact.address}
              </dt>
              <dd className="mt-2 text-ink">
                {shop.address ? (
                  <a
                    href={mapsHref(shop.address[locale])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {shop.address[locale]} — {c.openMap}
                  </a>
                ) : (
                  c.comingSoon
                )}
              </dd>
            </div>
            <div className="rounded-2xl border border-oak/40 bg-white/90 p-6">
              <dt className="eyebrow text-gold-ink">
                {dict.home.contact.hours}
              </dt>
              <dd className="mt-2 text-ink">
                {shop.hours?.[locale] ?? c.comingSoon}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="bg-wine py-14 text-center text-cream sm:py-16">
        <h2 className="text-2xl tracking-[0.1em] uppercase">{t.eventsTitle}</h2>
        <p className="mt-3 text-cream/85">{t.eventsBody}</p>
        <Link
          href={`${href(locale, "events")}#request`}
          className={cn(
            buttonVariants({ variant: "gold", size: "lg" }),
            "mt-6",
          )}
        >
          {t.eventsCta} <ArrowRight aria-hidden />
        </Link>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(bakeryJsonLd(locale))}
      />
    </>
  );
}

/* ---------- Privacy (C-13) ---------- */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.privacy;
  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.updated}
        crumbs={crumbs(locale, t.title)}
        crumbsLabel={dict.catalog.breadcrumb}
      />
      <section className="bg-ivory py-14 sm:py-20">
        <div className="mx-auto grid max-w-3xl gap-10 px-4 sm:px-6">
          {t.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg tracking-[0.08em] text-wine uppercase">
                {s.title}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-brown">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="text-brown">
            {t.contactLabel}{" "}
            <a href={`mailto:${shop.email}`} className="text-wine underline">
              {shop.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

/* ---------- 404 ---------- */
export function NotFoundPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.pages.notFound;
  return (
    <section className="fluted py-20 sm:py-28">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="font-serif text-7xl text-gold-ink">404</p>
        <h1 className="mt-4 text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-4 text-brown">{t.body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={href(locale, "home")}
            className={buttonVariants({ variant: "wine" })}
          >
            {t.home}
          </Link>
          <Link
            href={href(locale, "catalog")}
            className={buttonVariants({ variant: "outlineDark" })}
          >
            {t.catalog}
          </Link>
        </div>
      </div>
    </section>
  );
}
