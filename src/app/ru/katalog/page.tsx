import { CatalogPage, catalogMetadata } from "@/features/catalog/catalog-page";

export const metadata = catalogMetadata("ru");

export default function Page() {
  return <CatalogPage locale="ru" />;
}
