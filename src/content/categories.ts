import type { Locale } from "@/i18n/config";

/** Catalog categories (D-012). Slugs are shared by both languages. Owner confirmation pending. */
export type CategoryIcon =
  | "macaron"
  | "cake"
  | "cheesecake"
  | "croissant"
  | "dessert"
  | "strawberry"
  | "gift"
  | "coffee";

export type Category = {
  slug: string;
  icon: CategoryIcon;
  name: Record<Locale, string>;
};

export const categories: readonly Category[] = [
  {
    slug: "macarons",
    icon: "macaron",
    name: { ro: "Macarons", ru: "Макаронс" },
  },
  {
    slug: "torturi",
    icon: "cake",
    name: { ro: "Torturi la comandă", ru: "Торты на заказ" },
  },
  {
    slug: "cheesecake",
    icon: "cheesecake",
    name: { ro: "Cheesecake", ru: "Чизкейк" },
  },
  {
    slug: "croissante",
    icon: "croissant",
    name: { ro: "Croissante & patiserie", ru: "Круассаны и выпечка" },
  },
  {
    slug: "deserturi",
    icon: "dessert",
    name: { ro: "Deserturi", ru: "Десерты" },
  },
  {
    slug: "fructe-in-ciocolata",
    icon: "strawberry",
    name: { ro: "Fructe în ciocolată", ru: "Фрукты в шоколаде" },
  },
  {
    slug: "cutii-cadou",
    icon: "gift",
    name: { ro: "Cutii cadou", ru: "Подарочные наборы" },
  },
  {
    slug: "cafea",
    icon: "coffee",
    name: { ro: "Cafea & băuturi", ru: "Кофе и напитки" },
  },
];
