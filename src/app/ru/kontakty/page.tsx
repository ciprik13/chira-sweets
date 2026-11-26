import { ContactPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "contact",
  getDictionary("ru").pages.contact,
);

export default function Page() {
  return <ContactPage locale="ru" />;
}
