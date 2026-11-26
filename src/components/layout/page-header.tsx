import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { label: string; href?: string };

/** Wine page header used by inner pages, with an optional breadcrumb. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  crumbsLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  crumbsLabel?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-wine text-cream">
      <div
        aria-hidden
        className="glow pointer-events-none absolute -top-48 -right-32 size-[520px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label={crumbsLabel} className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-xs tracking-[0.14em] text-cream/70 uppercase">
              {crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="size-3.5 text-gold" aria-hidden />
                  )}
                  {c.href ? (
                    <Link href={c.href} className="py-1 hover:text-gold-bright">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="py-1 text-cream">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-gold-bright">{eyebrow}</p>}
        <h1 className="mt-3 text-3xl font-normal tracking-[0.1em] uppercase sm:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-2xl leading-relaxed text-cream/85">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
