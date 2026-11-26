import { EventsPage } from "@/features/pages/info-pages";
import { getDictionary } from "@/i18n/dictionaries";
import { staticPageMetadata } from "@/lib/page-metadata";

export const metadata = staticPageMetadata(
  "ru",
  "events",
  getDictionary("ru").pages.events,
);

export default function Page() {
  return <EventsPage locale="ru" />;
}
