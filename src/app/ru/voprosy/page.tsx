import { FaqPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "faq",
  getDictionary("ru").pages.faq,
);

export default function Page() {
  return <FaqPage locale="ru" />;
}
