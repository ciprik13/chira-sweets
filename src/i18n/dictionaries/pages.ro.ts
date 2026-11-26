/**
 * Romanian copy for info pages (C-06, C-07, C-09..C-11, C-13).
 * Facts the owner has not confirmed yet are worded as "ask us" / "în curând" —
 * never invented (content-plan rules). Owner and legal review pending.
 */
export const pagesRo = {
  common: {
    comingSoon: "În curând",
    askUs: "Întreabă-ne",
    openMap: "Deschide pe hartă",
    pendingNote:
      "Detaliile exacte vor fi publicate în curând. Până atunci, scrie-ne și îți răspundem rapid.",
  },
  events: {
    metaTitle: "Evenimente și comenzi corporate",
    metaDescription:
      "Candy bar, turnuri de macarons și cutii cadou pentru nunți, botezuri, aniversări și evenimente de companie în Chișinău. Cere o ofertă.",
    eyebrow: "Evenimente & corporate",
    title: "Dulciuri pentru evenimentul tău",
    lead: "Pregătim deserturi pentru nunți, botezuri, aniversări și evenimente de companie — de la un candy bar complet la cutii cadou pentru parteneri și colegi.",
    formatsTitle: "Ce putem pregăti",
    formats: [
      {
        title: "Candy bar",
        body: "O masă de deserturi asortate, gândită în culorile și stilul evenimentului.",
      },
      {
        title: "Turnuri de macarons",
        body: "Un decor dulce care se mănâncă — în culorile alese de tine.",
      },
      {
        title: "Cutii cadou",
        body: "Cutii cu macarons și deserturi pentru invitați, clienți sau colegi.",
      },
      {
        title: "Comenzi corporate",
        body: "Deserturi pentru ședințe, lansări și sărbători de companie.",
      },
    ],
    stepsTitle: "Cum lucrăm",
    steps: [
      {
        title: "Trimite cererea",
        body: "Completează formularul de mai jos — durează un minut.",
      },
      {
        title: "Primești oferta",
        body: "Te contactăm cu propuneri, prețuri și termen de pregătire.",
      },
      {
        title: "Confirmăm și pregătim",
        body: "După confirmare, pregătim totul pentru ziua evenimentului.",
      },
    ],
    pricingNote:
      "Prețul, comanda minimă și termenul de pregătire depind de format și de numărul de invitați — le primești în ofertă.",
  },
  form: {
    title: "Cere o ofertă",
    lead: "Lasă-ne câteva detalii și te contactăm cu o propunere.",
    name: "Nume",
    phone: "Telefon",
    phoneHint: "De exemplu: 079 123 456",
    eventDate: "Data evenimentului",
    guests: "Număr de invitați",
    interest: "Ce te interesează",
    interests: {
      candyBar: "Candy bar",
      macaronTower: "Turn de macarons",
      giftBoxes: "Cutii cadou",
      other: "Altceva",
    },
    message: "Mesaj",
    messageHint: "Tema, culorile, preferințele de gust sau alte detalii.",
    optional: "opțional",
    submit: "Trimite cererea",
    submitting: "Se trimite…",
    privacy: "Datele tale sunt folosite doar pentru a-ți răspunde. Detalii în",
    privacyLink: "politica de confidențialitate",
    successTitle: "Mulțumim! Cererea a fost trimisă.",
    successBody: "Te contactăm în curând la numărul de telefon indicat.",
    sendAnother: "Trimite o altă cerere",
    errorTitle: "Cererea nu a putut fi trimisă.",
    errorBody: "Te rugăm să încerci din nou sau să ne scrii direct:",
    errorRateLimited:
      "Ai trimis mai multe cereri într-un timp scurt. Încearcă din nou peste câteva minute.",
    errors: {
      required: "Câmp obligatoriu",
      name: "Scrie numele tău (2–80 de caractere)",
      phone: "Scrie un număr de telefon valid",
      eventDate: "Alege o dată de azi încolo",
      guests: "Scrie un număr între 1 și 2000",
      interest: "Alege o opțiune",
      message: "Mesajul poate avea cel mult 1000 de caractere",
      challenge: "Verificarea anti-spam nu s-a încheiat. Încearcă din nou.",
    },
  },
  cakeForm: {
    eyebrow: "Tort la comandă",
    title: "Descrie tortul tău",
    lead: "Spune-ne data, numărul de porții și ideea ta. Poți atașa o fotografie de inspirație — îți răspundem cu propunere, preț și termen.",
    date: "Data la care ai nevoie de tort",
    servings: "Număr de porții",
    servingsHint: "Aproximativ — te ajutăm să alegi mărimea.",
    flavour: "Gust preferat",
    flavourHint: "De exemplu: ciocolată, fistic, fructe de pădure",
    decoration: "Decor și detalii",
    decorationHint: "Culori, inscripție, temă, alergii de care să ținem cont.",
    photo: "Fotografie de inspirație",
    photoHint:
      "JPG, PNG, WEBP sau HEIC. Datele de localizare din fotografie sunt eliminate, iar fotografia nu este păstrată pe site.",
    photoRemove: "Elimină fotografia",
    errors: {
      date: "Alege o dată de azi încolo",
      servings: "Scrie un număr între 1 și 300",
      flavour: "Cel mult 200 de caractere",
      decoration: "Cel mult 1000 de caractere",
      photoType: "Alege o imagine JPG, PNG, WEBP sau HEIC",
      photoSize: "Fotografia trebuie să aibă cel mult 5 MB",
    },
    photoFailed:
      "Cererea a ajuns, dar fotografia nu. Trimite-ne-o pe Telegram, Viber, WhatsApp sau Instagram.",
    cta: "Formular pentru tort",
  },
  delivery: {
    metaTitle: "Livrare și ridicare",
    metaDescription:
      "Livrare de deserturi în Chișinău și în Moldova, ridicare din cofetărie, termen de pregătire pentru torturi. Chira Sweets.",
    eyebrow: "Livrare & ridicare",
    title: "Cum ajunge desertul la tine",
    lead: "Poți ridica comanda din cofetărie sau o putem livra. Condițiile exacte le confirmăm la comandă.",
    sections: [
      { id: "chisinau", title: "Livrare în Chișinău" },
      { id: "moldova", title: "Livrare în Moldova" },
      { id: "pickup", title: "Ridicare din cofetărie" },
      { id: "leadTime", title: "Termen pentru torturi" },
    ],
  },
  about: {
    metaTitle: "Despre noi",
    metaDescription:
      "Chira Sweets — cofetăria lui Chiriac David, patiser și fondator. Deserturi făcute cu grijă, în Durlești, Chișinău.",
    eyebrow: "Despre noi",
    title: "Chira Sweets",
    lead: "În cuvintele patiserului și fondatorului Chira Sweets.",
    // DRAFT in the founder's voice — to be read and approved by Chiriac David (D-017).
    story: [
      "Mă numesc Chiriac David și sunt patiserul din spatele Chira Sweets. Am deschis cofetăria ca să fac deserturi pe care le-aș pune cu drag pe masa celor dragi: frumoase, dar mai ales gustoase.",
      "Lucrez în loturi mici și aleg ingredientele cu grijă, pentru că un desert bun începe cu ingrediente bune. Fiecare macaron, tort sau croissant e pregătit cu aceeași atenție la detalii.",
      "Pentru mine, un desert reușit e cel care face un moment obișnuit puțin mai special. Te aștept în cofetărie, la o cafea și ceva dulce.",
    ],
    quote:
      "Un desert bun începe cu ingrediente bune și se termină cu un zâmbet.",
    founder: {
      name: "Chiriac David",
      role: "Patiser și fondator Chira Sweets",
    },
    valuesTitle: "Ce ne definește",
    values: [
      {
        title: "Calitate",
        body: "Ingrediente alese cu grijă și rețete pe care le perfecționăm continuu.",
      },
      {
        title: "Prospețime",
        body: "Pregătim deserturile cât mai aproape de momentul în care ajung la tine.",
      },
      {
        title: "Atenție la detalii",
        body: "De la gust la decor și ambalaj — fiecare detaliu contează.",
      },
    ],
    visitTitle: "Intră pentru o cafea. Rămâi pentru desert.",
    visitBody: "Te așteptăm în cofetărie pentru o cafea și ceva dulce.",
  },
  faq: {
    metaTitle: "Întrebări frecvente",
    metaDescription:
      "Cum comanzi, livrare, plată, alergeni și păstrarea deserturilor — răspunsuri la întrebările frecvente despre Chira Sweets.",
    eyebrow: "Întrebări frecvente",
    title: "Întrebări și răspunsuri",
    lead: "N-ai găsit răspunsul? Scrie-ne sau sună — te ajutăm cu plăcere.",
    items: [
      {
        q: "Cum pot face o comandă?",
        a: "Sună-ne sau scrie-ne pe Telegram, Viber, WhatsApp ori Instagram. Pentru evenimente și comenzi mari, completează formularul de pe pagina Evenimente.",
      },
      {
        q: "Cu cât timp înainte trebuie comandat un tort?",
        a: "Termenul depinde de mărimea și complexitatea tortului. Scrie-ne cât mai devreme și îți confirmăm termenul exact.",
      },
      {
        q: "Livrați la domiciliu?",
        a: "Da, putem livra comanda sau o poți ridica din cofetărie. Condițiile sunt descrise pe pagina Livrare.",
      },
      {
        q: "Cum pot achita comanda?",
        a: "Metodele de plată ți le comunicăm la confirmarea comenzii.",
      },
      {
        q: "Unde găsesc informații despre alergeni?",
        a: "Pe pagina fiecărui produs. Dacă alergenii nu sunt încă indicați, întreabă-ne înainte de a comanda. În atelier lucrăm și cu alergeni precum gluten, ouă, lapte și nuci.",
      },
      {
        q: "Cum se păstrează deserturile?",
        a: "Deserturile cu cremă se păstrează la frigider și se consumă cât mai proaspete. Termenul exact pentru fiecare produs ți-l spunem la comandă.",
      },
      {
        q: "Pot comanda un tort după fotografia mea?",
        a: "Da. Trimite-ne fotografia în mesaj și îți spunem ce putem realiza.",
      },
    ],
  },
  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Contactează Chira Sweets: telefon, Telegram, Viber, WhatsApp, Instagram. Cofetărie în Chișinău.",
    eyebrow: "Contact",
    title: "Scrie-ne sau sună",
    lead: "Alege canalul preferat — răspundem rapid.",
    channelsTitle: "Canale de contact",
    email: "E-mail",
    eventsTitle: "Organizezi un eveniment?",
    eventsBody: "Trimite-ne o cerere și primești o ofertă.",
    eventsCta: "Cere o ofertă",
  },
  privacy: {
    metaTitle: "Politica de confidențialitate",
    metaDescription:
      "Cum folosește Chira Sweets datele personale trimise prin site.",
    eyebrow: "Legal",
    title: "Politica de confidențialitate",
    updated: "Ultima actualizare: 26 noiembrie 2026",
    sections: [
      {
        title: "Cine suntem",
        body: [
          "Site-ul chirasweets.md aparține cofetăriei Chira Sweets din Chișinău. Datele de identificare ale operatorului (denumire și IDNO) sunt indicate în subsolul site-ului.",
        ],
      },
      {
        title: "Ce date colectăm",
        body: [
          "Când trimiți formularul de pe pagina Evenimente: numele, numărul de telefon, data evenimentului, numărul de invitați, opțiunea aleasă și mesajul tău. Când trimiți formularul pentru tort: numele, telefonul, data, numărul de porții, preferințele și, dacă o atașezi, fotografia de inspirație.",
          "Site-ul nu folosește cookie-uri de marketing și nu are conturi de utilizator.",
        ],
      },
      {
        title: "Cum folosim datele",
        body: [
          "Datele din formular sunt transmise direct cofetăriei printr-un mesaj Telegram, doar pentru a-ți răspunde la cerere. Ele nu sunt stocate pe site.",
          "Pentru protecția împotriva spamului folosim Cloudflare Turnstile.",
        ],
      },
      {
        title: "Statistici",
        body: [
          "Folosim Cloudflare Web Analytics pentru a număra vizitele. Serviciul nu folosește cookie-uri și nu te identifică personal.",
        ],
      },
      {
        title: "Mesagerie și rețele sociale",
        body: [
          "Când ne contactezi prin telefon, Telegram, Viber, WhatsApp sau Instagram, se aplică și politicile de confidențialitate ale acestor servicii.",
        ],
      },
      {
        title: "Drepturile tale",
        body: [
          "Ai dreptul să afli ce date avem despre tine, să ceri corectarea sau ștergerea lor, conform legislației Republicii Moldova privind protecția datelor cu caracter personal. Scrie-ne la adresa de e-mail de mai jos.",
        ],
      },
    ],
    contactLabel: "Contact pentru protecția datelor:",
  },
  notFound: {
    title: "Pagina nu a fost găsită",
    body: "Se pare că desertul acesta nu mai e pe tavă. Încearcă una dintre paginile de mai jos.",
    home: "Pagina principală",
    catalog: "Catalog",
  },
} as const;
