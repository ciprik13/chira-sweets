import type { ProductInput } from "./schema";

/**
 * Product list (C-01..C-04). Edited via PR.
 *
 * Everything below is a DRAFT sample so the catalog can be designed and reviewed
 * before the owner's list arrives. Drafts never reach the production build.
 * Rules (content-plan): no invented prices or allergens — drafts use
 * `price: onRequest` and `allergens: unverified` until the owner confirms them.
 */
export const productInputs: ProductInput[] = [
  {
    slug: "macarons-asortate",
    category: "macarons",
    name: { ro: "Macarons asortate", ru: "Ассорти макаронс" },
    description: {
      ro: "Macarons cu cremă fină, în culori și gusturi diferite.",
      ru: "Макаронс с нежным кремом, разных цветов и вкусов.",
    },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    bestseller: true,
    draft: true,
  },
  {
    slug: "turn-de-macarons",
    category: "macarons",
    name: { ro: "Turn de macarons", ru: "Башня из макаронс" },
    description: {
      ro: "Pentru evenimente: un turn de macarons în culorile alese de tine.",
      ru: "Для мероприятий: башня из макаронс в выбранных вами цветах.",
    },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    draft: true,
  },
  {
    slug: "tort-ciocolata-capsuni",
    category: "torturi",
    name: {
      ro: "Tort cu ciocolată și căpșuni",
      ru: "Шоколадный торт с клубникой",
    },
    description: {
      ro: "Tort la comandă cu glazură de ciocolată și căpșuni proaspete.",
      ru: "Торт на заказ с шоколадной глазурью и свежей клубникой.",
    },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    bestseller: true,
    draft: true,
  },
  {
    slug: "tort-fistic-zmeura",
    category: "torturi",
    name: { ro: "Tort cu fistic și zmeură", ru: "Торт с фисташкой и малиной" },
    description: {
      ro: "Blat de fistic, cremă ușoară și strat de zmeură.",
      ru: "Фисташковый бисквит, лёгкий крем и малиновая прослойка.",
    },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    draft: true,
  },
  {
    slug: "cheesecake-clasic",
    category: "cheesecake",
    name: { ro: "Cheesecake clasic", ru: "Классический чизкейк" },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    bestseller: true,
    draft: true,
  },
  {
    slug: "croissant-cu-unt",
    category: "croissante",
    name: { ro: "Croissant cu unt", ru: "Сливочный круассан" },
    description: {
      ro: "Croissant proaspăt, foietat, copt în fiecare dimineață.",
      ru: "Свежий слоёный круассан, выпекаем каждое утро.",
    },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    bestseller: true,
    draft: true,
  },
  {
    slug: "capsuni-in-ciocolata",
    category: "fructe-in-ciocolata",
    name: { ro: "Căpșuni în ciocolată", ru: "Клубника в шоколаде" },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    draft: true,
  },
  {
    slug: "cutie-cadou-macarons",
    category: "cutii-cadou",
    name: { ro: "Cutie cadou cu macarons", ru: "Подарочная коробка макаронс" },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
    draft: true,
  },
];
