import type { Metadata } from "next";
import { NotFoundPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";

/** Static 404 for Cloudflare Pages (copied to /ro/404.html after build). */
export const metadata: Metadata = {
  title: getDictionary("ro").pages.notFound.title,
  robots: { index: false },
};

export default function Page() {
  return <NotFoundPage locale="ro" />;
}
