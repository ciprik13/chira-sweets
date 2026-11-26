import { AboutPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ro",
  "about",
  getDictionary("ro").pages.about,
);

export default function Page() {
  return <AboutPage locale="ro" />;
}
