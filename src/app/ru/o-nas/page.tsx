import { AboutPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "about",
  getDictionary("ru").pages.about,
);

export default function Page() {
  return <AboutPage locale="ru" />;
}
