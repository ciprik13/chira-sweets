import {
  CategoryPage,
  categoryMetadata,
  categoryStaticParams,
  type CategoryParams,
} from "@/features/catalog/category-page";

type Props = { params: Promise<CategoryParams> };

export const dynamicParams = false;
export const generateStaticParams = categoryStaticParams;

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("ro", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryPage locale="ro" slug={(await params).category} />;
}
