import { DeliveryPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "delivery",
  getDictionary("ru").pages.delivery,
);

export default function Page() {
  return <DeliveryPage locale="ru" />;
}
