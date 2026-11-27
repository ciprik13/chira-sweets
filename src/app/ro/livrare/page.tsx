import { DeliveryPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ro",
  "delivery",
  getDictionary("ro").pages.delivery,
);

export default function Page() {
  return <DeliveryPage locale="ro" />;
}
