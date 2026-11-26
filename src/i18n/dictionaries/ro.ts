import { pagesRo } from "./pages.ro";

/**
 * Romanian UI copy. Drafted by the dev team (D-017); the owner verifies facts and tone.
 * Never state prices, lead times or allergens here — those come from owner-verified data.
 */
export const ro = {
  meta: {
    title: "Chira Sweets — cofetărie în Chișinău",
    description:
      "Macarons, torturi la comandă, cheesecake, croissante și cutii cadou. Cofetărie artizanală în Chișinău — comandă telefonic sau pe Telegram, Viber, WhatsApp.",
  },
  skipToContent: "Sari la conținut",
  nav: {
    label: "Navigare principală",
    catalog: "Catalog",
    events: "Evenimente",
    delivery: "Livrare",
    about: "Despre noi",
    faq: "Întrebări",
    contact: "Contact",
    menu: "Meniu",
    close: "Închide",
    language: "Limba",
  },
  order: {
    cta: "Comandă acum",
    title: "Cum vrei să comanzi?",
    description:
      "Scrie-ne sau sună — îți răspundem cu detalii, preț și termen de pregătire.",
    call: "Sună",
    telegram: "Telegram",
    viber: "Viber",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  },
  actionBar: {
    label: "Contactează-ne rapid",
  },
  home: {
    hero: {
      eyebrow: "Cofetărie · Chișinău",
      line1: "Intră pentru o cafea.",
      line2: "Rămâi pentru desert.",
      lead: "Macarons, torturi la comandă, cheesecake și croissante proaspete — făcute cu grijă, din ingrediente de calitate.",
      secondary: "Vezi catalogul",
    },
    features: [
      { icon: "coffee", title: "Cafea premium" },
      { icon: "croissant", title: "Croissante proaspete" },
      { icon: "cake", title: "Deserturi artizanale" },
      { icon: "wheat", title: "Ingrediente de calitate" },
    ],
    categories: {
      eyebrow: "Catalog",
      title: "Ce pregătim pentru tine",
      viewAll: "Tot catalogul",
    },
    cakes: {
      eyebrow: "La comandă",
      title: "Torturi pentru momentele tale",
      body: "Aniversări, botezuri, nunți sau o simplă bucurie. Alegi gustul, mărimea și decorul — noi îl facem să arate și să aibă gust exact cum ți-l imaginezi.",
      price: "Prețul și termenul de pregătire — la cerere",
      cta: "Discută tortul tău",
    },
    events: {
      eyebrow: "Evenimente & corporate",
      title: "Dulciuri pentru evenimente",
      body: "Pregătim candy bar-uri, turnuri de macarons și cutii cadou pentru nunți, petreceri și evenimente de companie.",
      items: [
        "Candy bar",
        "Turnuri de macarons",
        "Cutii cadou",
        "Comenzi corporate",
      ],
      cta: "Cere o ofertă",
    },
    delivery: {
      eyebrow: "Livrare & ridicare",
      title: "Desertul ajunge la tine",
      items: [
        {
          title: "Livrare în Chișinău",
          body: "Condițiile de livrare vor fi publicate în curând.",
        },
        {
          title: "Livrare în Moldova",
          body: "Întreabă-ne despre livrarea în alte localități.",
        },
        {
          title: "Ridicare din cofetărie",
          body: "Comanda te așteaptă gata ambalată.",
        },
      ],
      cta: "Detalii despre livrare",
    },
    about: {
      eyebrow: "Despre noi",
      title: "Atenție la fiecare detaliu",
      body: "Chira Sweets este o cofetărie din Chișinău unde fiecare desert este pregătit cu răbdare, din ingrediente atent alese. Calitate, prospețime și atenție la detalii — în fiecare comandă.",
      cta: "Povestea noastră",
    },
    instagram: {
      eyebrow: "Instagram",
      title: "Urmărește-ne pentru noutăți",
      body: "Deserturile zilei, comenzi speciale și culisele cofetăriei.",
      cta: "Deschide Instagram",
    },
    contact: {
      eyebrow: "Contact",
      title: "Hai să vorbim despre desertul tău",
      phone: "Telefon",
      address: "Adresă",
      hours: "Program",
      comingSoon: "În curând",
    },
  },
  catalog: {
    eyebrow: "Catalog",
    title: "Catalogul nostru",
    lead: "Alege categoria și descoperă deserturile Chira Sweets. Pentru comenzi, scrie-ne sau sună.",
    metaDescription:
      "Catalogul Chira Sweets: macarons, torturi la comandă, cheesecake, croissante, deserturi, fructe în ciocolată, cutii cadou și cafea, cu prețuri.",
    products: {
      one: "produs",
      few: "produse",
      many: "de produse",
      other: "de produse",
    },
    emptyCategory:
      "Produsele din această categorie vor apărea în curând. Între timp, scrie-ne — îți spunem ce putem pregăti.",
    viewProduct: "Detalii",
    backToCatalog: "Înapoi la catalog",
    breadcrumb: "Fir de navigare",
    size: "Mărime / gramaj",
    price: "Preț",
    description: "Descriere",
    allergens: "Alergeni",
    allergensUnverified:
      "Întreabă-ne despre alergeni și ingrediente înainte de a comanda.",
    allergensNone: "Nu conține alergeni majori, conform rețetei.",
    allergensNote:
      "Produsele sunt pregătite într-un atelier unde se folosesc și alți alergeni.",
    orderThis: "Comandă acest produs",
    orderMessage: "Bună! Aș dori să comand: {name}",
    draftBadge: "Exemplu — date în curs de confirmare",
    noPhoto: "Fotografie în curând",
    related: "Din aceeași categorie",
    bestsellers: {
      eyebrow: "Preferatele clienților",
      title: "Cele mai iubite",
    },
    priceOnRequest: "Preț la cerere",
    priceFrom: "de la {amount} lei",
    priceFixed: "{amount} lei",
    units: {
      piece: "buc",
      kg: "kg",
      box: "cutie",
      set: "set",
      portion: "porție",
    },
  },
  allergenNames: {
    gluten: "Gluten",
    crustaceans: "Crustacee",
    eggs: "Ouă",
    fish: "Pește",
    peanuts: "Arahide",
    soy: "Soia",
    milk: "Lapte",
    nuts: "Fructe cu coajă lemnoasă",
    celery: "Țelină",
    mustard: "Muștar",
    sesame: "Susan",
    sulphites: "Sulfiți",
    lupin: "Lupin",
    molluscs: "Moluște",
  },
  footer: {
    tagline: "Calitate · Prospețime · Atenție la detalii",
    pages: "Pagini",
    contact: "Contact",
    follow: "Urmărește-ne",
    privacy: "Politica de confidențialitate",
    rights: "Toate drepturile rezervate.",
  },
  pages: pagesRo,
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

/** Every language must provide exactly these keys; `tsc` fails on a missing one. */
export type Dictionary = Widen<typeof ro>;
