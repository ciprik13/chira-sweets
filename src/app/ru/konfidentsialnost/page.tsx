import { PrivacyPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "privacy",
  getDictionary("ru").pages.privacy,
);

export default function Page() {
  return <PrivacyPage locale="ru" />;
}
