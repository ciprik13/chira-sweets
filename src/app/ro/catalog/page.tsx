import { CatalogPage, catalogMetadata } from "@/features/catalog/catalog-page";

export const metadata = catalogMetadata("ro");

export default function Page() {
  return <CatalogPage locale="ro" />;
}
