import { ContactPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ro",
  "contact",
  getDictionary("ro").pages.contact,
);

export default function Page() {
  return <ContactPage locale="ro" />;
}
