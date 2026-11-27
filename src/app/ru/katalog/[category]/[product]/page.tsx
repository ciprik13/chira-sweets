import {
  ProductPage,
  productMetadata,
  productStaticParams,
  type ProductParams,
} from "@/features/catalog/product-page";

type Props = { params: Promise<ProductParams> };

export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

export async function generateMetadata({ params }: Props) {
  return productMetadata("ru", await params);
}

export default async function Page({ params }: Props) {
  return <ProductPage locale="ru" params={await params} />;
}
