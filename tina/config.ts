import { defineConfig, type TinaField } from "tinacms";
import catalog from "../content/catalog/catalog.json";
import roCopy from "../content/copy/ro.json";
import { fieldsFromSample } from "./copy-fields";

/*
 * TinaCMS (Tina Cloud) — editor for all site content. See docs/cms.md.
 *
 * Content stays in the repo as JSON and is validated by the site build
 * (src/content/*.ts, Zod): an invalid edit fails the build and never reaches
 * the live site. Photos are committed to public/uploads.
 */

const allergens = [
  { value: "gluten", label: "Gluten" },
  { value: "crustaceans", label: "Crustacee" },
  { value: "eggs", label: "Ouă" },
  { value: "fish", label: "Pește" },
  { value: "peanuts", label: "Arahide" },
  { value: "soy", label: "Soia" },
  { value: "milk", label: "Lapte" },
  { value: "nuts", label: "Fructe cu coajă lemnoasă (nuci)" },
  { value: "celery", label: "Țelină" },
  { value: "mustard", label: "Muștar" },
  { value: "sesame", label: "Susan" },
  { value: "sulphites", label: "Sulfiți" },
  { value: "lupin", label: "Lupin" },
  { value: "molluscs", label: "Moluște" },
];

const units = [
  { value: "piece", label: "bucată (buc)" },
  { value: "kg", label: "kilogram (kg)" },
  { value: "box", label: "cutie" },
  { value: "set", label: "set" },
  { value: "portion", label: "porție" },
];

const icons = [
  { value: "macaron", label: "Macaron" },
  { value: "cake", label: "Tort" },
  { value: "cheesecake", label: "Felie de tort" },
  { value: "croissant", label: "Croissant" },
  { value: "dessert", label: "Desert" },
  { value: "strawberry", label: "Fructe" },
  { value: "gift", label: "Cadou" },
  { value: "coffee", label: "Cafea" },
];

/** RO + RU text pair. */
const text = (
  name: string,
  label: string,
  opts: { required?: boolean; long?: boolean } = {},
): TinaField => ({
  type: "object",
  name,
  label,
  fields: (["ro", "ru"] as const).map((lang) => ({
    type: "string" as const,
    name: lang,
    label: lang === "ro" ? "Română" : "Русский",
    required: opts.required ?? false,
    ...(opts.long ? { ui: { component: "textarea" } } : {}),
  })),
});

const slugField = (description: string): TinaField => ({
  type: "string",
  name: "slug",
  label: "Adresă în link (slug)",
  description,
  ui: {
    validate: (value?: string) =>
      value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
        ? "Doar litere mici, cifre și cratime, ex.: tort-cu-fistic"
        : undefined,
  },
});

const categoryOptions = catalog.categories.map((c) => ({
  value: c.slug,
  label: c.name.ro,
}));

const productFields: TinaField[] = [
  text("name", "Denumire", { required: true }),
  {
    type: "string",
    name: "category",
    label: "Categorie",
    required: true,
    options: categoryOptions,
  },
  {
    type: "object",
    name: "price",
    label: "Preț",
    fields: [
      {
        type: "string",
        name: "kind",
        label: "Tip preț",
        required: true,
        options: [
          { value: "fixed", label: "Preț fix (ex.: 45 lei / buc)" },
          { value: "from", label: "De la (ex.: de la 450 lei / kg)" },
          { value: "onRequest", label: "La cerere" },
        ],
      },
      {
        type: "number",
        name: "amount",
        label: "Sumă (lei)",
        description: "Necesar pentru „Preț fix” și „De la”.",
        ui: {
          validate: (value?: number) =>
            value !== undefined && value !== null && value <= 0
              ? "Suma trebuie să fie mai mare decât 0"
              : undefined,
        },
      },
      { type: "string", name: "unit", label: "Unitate", options: units },
    ],
  },
  {
    type: "object",
    name: "images",
    label: "Fotografii",
    description:
      "Prima fotografie apare în catalog. JPG, PNG sau WEBP; pozele de pe iPhone (HEIC) — exportă-le ca JPG.",
    list: true,
    ui: {
      itemProps: (item: { src?: string }) => ({
        label: item?.src?.split("/").pop() ?? "Fotografie",
      }),
    },
    fields: [
      { type: "image", name: "src", label: "Fotografie", required: true },
      text("alt", "Descriere pentru cititoare de ecran (opțional)"),
    ],
  },
  text("size", "Mărime / gramaj (ex.: 12 buc · 150 g)"),
  text("description", "Descriere", { long: true }),
  {
    type: "object",
    name: "allergens",
    label: "Alergeni",
    fields: [
      {
        type: "boolean",
        name: "verified",
        label: "Alergeni confirmați de cofetărie",
        description:
          "Până nu e bifat, site-ul afișează „Întreabă-ne despre alergeni”.",
      },
      {
        type: "string",
        name: "contains",
        label: "Conține",
        list: true,
        options: allergens,
        ui: { component: "checkbox-group" },
      },
    ],
  },
  {
    type: "boolean",
    name: "bestseller",
    label: "Afișează la „Cele mai iubite” pe pagina principală",
  },
  {
    type: "boolean",
    name: "draft",
    label: "Ciornă (nu apare pe site-ul public)",
  },
  slugField("Se completează automat din denumire dacă e gol."),
];

export default defineConfig({
  // Saves are commits to the unprotected `content` branch (P-031). A workflow
  // opens/updates the PR content → dev, CI validates it and a maintainer
  // approves; the content branch has its own preview. Same branch for the
  // admin served from production, so edits never skip review.
  branch: process.env.TINA_BRANCH || "content",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,

  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },
  // The site reads the JSON files directly; no generated query client needed.
  client: { skip: true },

  schema: {
    collections: [
      {
        name: "catalog",
        label: "Catalog — produse, prețuri, poze",
        path: "content/catalog",
        format: "json",
        match: { include: "catalog" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "products",
            label: "Produse",
            list: true,
            ui: {
              itemProps: (item: {
                name?: { ro?: string };
                price?: { kind?: string; amount?: number };
                draft?: boolean;
              }) => ({
                label: `${item?.draft ? "✎ " : ""}${item?.name?.ro || "Produs nou"}${
                  item?.price?.kind === "onRequest" || !item?.price?.amount
                    ? ""
                    : ` — ${item.price.amount} lei`
                }`,
              }),
              defaultItem: () => ({
                name: { ro: "", ru: "" },
                price: { kind: "onRequest" },
                allergens: { verified: false, contains: [] },
                images: [],
                bestseller: false,
                draft: true,
              }),
            },
            fields: productFields,
          },
          {
            type: "object",
            name: "categories",
            label: "Categorii",
            list: true,
            ui: {
              itemProps: (item: { name?: { ro?: string } }) => ({
                label: item?.name?.ro || "Categorie nouă",
              }),
            },
            fields: [
              text("name", "Denumire", { required: true }),
              {
                type: "string",
                name: "icon",
                label: "Pictogramă",
                options: icons,
                required: true,
              },
              { type: "number", name: "order", label: "Ordine (1 = prima)" },
              slugField(
                "Apare în link: /ro/catalog/<slug>/. Nu-l schimba după lansare (linkurile vechi nu vor mai merge).",
              ),
            ],
          },
        ],
      },
      {
        name: "settings",
        label: "Date cofetărie — contacte, adresă, program",
        path: "content/settings",
        format: "json",
        match: { include: "shop" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "name", label: "Nume", required: true },
          {
            type: "object",
            name: "phone",
            label: "Telefon",
            fields: [
              {
                type: "string",
                name: "e164",
                label: "Număr internațional",
                description: "Ex.: +37379349097",
                required: true,
              },
              {
                type: "string",
                name: "display",
                label: "Cum se afișează",
                description: "Ex.: 079 349 097",
                required: true,
              },
            ],
          },
          {
            type: "string",
            name: "telegram",
            label: "Telegram",
            description: "Număr (+373…) sau nume de utilizator",
            required: true,
          },
          {
            type: "string",
            name: "viber",
            label: "Viber",
            description: "Număr internațional, ex.: +37379349097",
            required: true,
          },
          {
            type: "string",
            name: "whatsapp",
            label: "WhatsApp",
            description: "Număr internațional, ex.: +37379349097",
            required: true,
          },
          {
            type: "string",
            name: "instagram",
            label: "Instagram",
            description: "Doar numele, ex.: chira_sweets",
            required: true,
          },
          {
            type: "string",
            name: "tiktok",
            label: "TikTok (opțional)",
            description: "Doar numele",
          },
          {
            type: "string",
            name: "email",
            label: "E-mail public (opțional)",
            description:
              "Lasă gol până când adresa primește efectiv e-mailuri (Cloudflare Email Routing). Gol = nu apare pe site.",
          },
          text("address", "Adresă (afișată)"),
          {
            type: "object",
            name: "postalAddress",
            label: "Adresă pentru Google",
            fields: [
              {
                type: "string",
                name: "streetAddress",
                label: "Stradă și număr",
              },
              { type: "string", name: "addressLocality", label: "Localitate" },
              {
                type: "string",
                name: "addressRegion",
                label: "Municipiu / raion",
              },
              {
                type: "string",
                name: "addressCountry",
                label: "Țară (cod)",
                description: "MD",
              },
            ],
          },
          text("hours", "Program (afișat)", { long: true }),
          {
            type: "object",
            name: "openingHours",
            label: "Program pentru Google",
            list: true,
            ui: {
              itemProps: (item: {
                days?: string[];
                opens?: string;
                closes?: string;
              }) => ({
                label: `${(item?.days ?? []).join(", ")} ${item?.opens ?? ""}–${item?.closes ?? ""}`,
              }),
            },
            fields: [
              {
                type: "string",
                name: "days",
                label: "Zile",
                list: true,
                ui: { component: "checkbox-group" },
                options: [
                  { value: "Monday", label: "Luni" },
                  { value: "Tuesday", label: "Marți" },
                  { value: "Wednesday", label: "Miercuri" },
                  { value: "Thursday", label: "Joi" },
                  { value: "Friday", label: "Vineri" },
                  { value: "Saturday", label: "Sâmbătă" },
                  { value: "Sunday", label: "Duminică" },
                ],
              },
              { type: "string", name: "opens", label: "Deschide (HH:MM)" },
              { type: "string", name: "closes", label: "Închide (HH:MM)" },
            ],
          },
          {
            type: "boolean",
            name: "founderTextApproved",
            label:
              "Textul lui Chiriac David (Despre noi + citatul) a fost aprobat de el",
            description:
              "Până nu e bifat, site-ul public afișează textul neutru; textul fondatorului apare doar pe site-ul de test.",
          },
          {
            type: "object",
            name: "legalEntity",
            label: "Date juridice (subsol)",
            fields: [
              { type: "string", name: "name", label: "Denumire firmă" },
              { type: "string", name: "idno", label: "IDNO" },
            ],
          },
        ],
      },
      {
        name: "copy",
        label: "Texte site (RO / RU)",
        path: "content/copy",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: fieldsFromSample(roCopy),
      },
    ],
  },
});
