import type { Product } from "@/components/InfiniteProductCarousel";
import {
  CAKE_DESIGN_TERMS,
  GATEAUX_TERMS,
  MIGNARDISES_TERMS,
  PRESENTOIRS,
} from "./commerce";

/** Nuances des placeholders : crème, beige chaud, brun très clair. */
const TONES = {
  cream: "#efe5d7",
  beige: "#e6d7c2",
  sand: "#ddcab1",
  linen: "#e9ddcb",
};

/** Mentions communes à tous les gâteaux gourmands. */
const GATEAU: Pick<Product, "notes" | "leadTime" | "leadDays" | "request"> = {
  notes: GATEAUX_TERMS.notes,
  leadTime: GATEAUX_TERMS.leadTime,
  leadDays: 1,
  request: "gateaux",
};

const gateau = (
  name: string,
  amount: number | null,
  product: Omit<Product, "name" | "pricing">,
): Product => ({
  name,
  pricing: amount ? { kind: "fixed", amount } : { kind: "confirm" },
  cta: { key: "patisserie", detail: name },
  ...GATEAU,
  ...product,
});

/**
 * Gâteaux gourmands (format rectangulaire) — photos dans
 * /public/images/patisseries/. Sans photo, la carte garde sa teinte
 * `tone` : il suffit d'ajouter `image` quand la photo est disponible.
 * Tarifs confirmés par La Marilyn.
 */
export const PATISSERIES: Product[] = [
  gateau("Moelleux au chocolat", 5_000, {
    description:
      "Cœur fondant et chocolat intense : la gourmandise la plus demandée de la maison.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/moelleux-chocolat.webp",
      alt: "Moelleux au chocolat au cœur coulant, décorés de fraises, framboises et pistaches",
      position: "45% 50%",
    },
  }),
  gateau("Gâteau au yaourt", 4_000, {
    description: "Le moelleux tout simple au yaourt, doux et réconfortant.",
    tone: TONES.linen,
  }),
  gateau("Cake yaourt & citron", 4_500, {
    description: "Moelleux au yaourt, délicatement parfumé au citron.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-yaourt-citron.webp",
      alt: "Cake au yaourt et au citron tranché, nappé de glaçage et de zestes de citron",
      position: "60% 50%",
    },
  }),
  gateau("Cake marbré", 4_500, {
    description: "Le grand classique marbré, à partager au goûter.",
    tone: TONES.beige,
  }),
  gateau("Cake noix de coco", 4_500, {
    description:
      "Un cake moelleux, généreusement recouvert de noix de coco toastée.",
    tone: TONES.beige,
    image: {
      src: "/images/patisseries/cake-noix-de-coco.webp",
      alt: "Cake à la noix de coco toastée tranché sur une planche en bois",
      position: "65% 50%",
    },
  }),
  gateau("Cake banane", 4_500, {
    description: "Un cake moelleux à la banane, tendre et parfumé.",
    tone: TONES.cream,
  }),
  gateau("Cake à l’orange", 4_500, {
    description: "Un cake moelleux, parfumé à l’orange.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-orange.webp",
      alt: "Cake à l’orange tranché, nappé de glaçage et de zestes d’orange confits",
      position: "60% 50%",
    },
  }),
  gateau("Cake praliné chocolat", 7_500, {
    description: "Chocolat et praliné réunis dans un cake gourmand.",
    tone: TONES.sand,
  }),
  gateau("Renversé à l’ananas", 4_500, {
    description: "Ananas caramélisé sur un gâteau moelleux et doré.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/renverse-ananas.webp",
      alt: "Gâteau renversé à l’ananas caramélisé, une part servie sur un présentoir",
      position: "70% 50%",
    },
  }),
  gateau("Cake velvet", 6_000, {
    description: "Un cake velvet à la mie tendre et colorée.",
    tone: TONES.linen,
  }),
  // Absent de la grille tarifaire transmise : prix à confirmer.
  gateau("Cake nature", null, {
    description:
      "Le grand classique, doré et fondant, tout simplement gourmand.",
    tone: TONES.linen,
    image: {
      src: "/images/patisseries/cake-nature.webp",
      alt: "Cake nature doré coupé en tranches sur une planche",
      position: "60% 50%",
    },
  }),
];

/** Mentions communes aux créations Cake Design. */
const CAKE_DESIGN: Pick<
  Product,
  "pricing" | "leadTime" | "leadDays" | "notes" | "request" | "badge"
> = {
  pricing: { kind: "from", amount: 25_000 },
  leadTime: CAKE_DESIGN_TERMS.leadTime,
  leadDays: 5,
  notes: [
    CAKE_DESIGN_TERMS.price,
    CAKE_DESIGN_TERMS.urgent,
    CAKE_DESIGN_TERMS.final,
  ],
  request: "cake-design",
  badge: "sur-commande",
};

/**
 * Cake Design : gâteaux personnalisés, sur commande. Les nouvelles photos
 * de gâteaux d'anniversaire s'ajoutent ici (une entrée par création).
 */
export const CAKE_DESIGNS: Product[] = [
  {
    name: "Gâteau d’anniversaire",
    cta: { key: "surMesure", detail: "Gâteau d’anniversaire" },
    description:
      "Un gâteau imaginé pour la personne fêtée, à partager avec petits et grands.",
    tone: TONES.linen,
    ...CAKE_DESIGN,
    image: {
      src: "/images/creations/gateau-floral-roses-macarons.webp",
      alt: "Gâteau d’anniversaire blanc couronné de roses en sucre violettes, roses et vertes, de macarons et d’un « Happy Birthday » doré",
      position: "50% 45%",
    },
  },
  {
    name: "Gâteau de mariage",
    cta: { key: "surMesure", detail: "Gâteau de mariage" },
    description: "Un gâteau élégant, imaginé avec vous pour votre grand jour.",
    tone: TONES.cream,
    ...CAKE_DESIGN,
    image: {
      src: "/images/galerie/piece-montee-bleu-argent.jpg",
      alt: "Pièce montée de mariage à quatre étages, bleu capitonné et blanc, rubans argentés et topper « Mr & Mrs »",
      position: "50% 40%",
    },
  },
];

const MIGNARDISE: Pick<Product, "request"> & { notes: string[] } = {
  notes: MIGNARDISES_TERMS.notes,
  request: "mignardises",
};

/**
 * Mignardises — pour ajouter la photo d'un produit, renseigner
 * `image: { src: "/images/mignardises/<fichier>.webp", alt: "…" }`.
 */
export const MIGNARDISES: Product[] = [
  {
    name: "Mini burgers",
    cta: { key: "mignardises", detail: "Mini burgers" },
    description:
      "Des bouchées généreuses, pensées pour vos cocktails, anniversaires, veillées et réceptions.",
    tone: TONES.sand,
    pricing: { kind: "fixed", amount: 650, unit: "unité" },
    composition: "Salade, oignons, tomate, viande et sauce mini-burger.",
    minQuantity: "10 pièces",
    leadTime: "48 h",
    leadDays: 2,
    ...MIGNARDISE,
    image: {
      src: "/images/mignardises/mini-burgers.webp",
      alt: "Mini burgers au cheddar, tomate et salade, piqués d’une brochette dorée sur un plateau de marbre",
      position: "50% 60%",
    },
  },
  {
    name: "Nems",
    cta: { key: "mignardises", detail: "Nems" },
    description:
      "Des bouchées croustillantes et gourmandes, parfaites à partager entre invités.",
    tone: TONES.beige,
    pricing: { kind: "fixed", amount: 200, unit: "unité" },
    options: ["Viande", "Poisson"],
    minQuantity: "25 pièces",
    leadTime: "48 h",
    leadDays: 2,
    ...MIGNARDISE,
    image: {
      src: "/images/mignardises/nems.webp",
      alt: "Nems croustillants garnis de légumes, servis avec une sauce pimentée",
      position: "50% 55%",
    },
  },
  {
    name: "Mini-cupcakes",
    cta: { key: "mignardises", detail: "Mini-cupcakes" },
    description: "De mini-cupcakes surmontés d’une jolie crème.",
    tone: TONES.linen,
    pricing: { kind: "from", amount: 10_000, unit: "les 9 pièces" },
    options: ["Crème au beurre", "Chantilly"],
    minQuantity: "9 pièces",
    leadTime: "24 h",
    leadDays: 1,
    ...MIGNARDISE,
    notes: [
      "Le prix varie selon la décoration et la personnalisation.",
      ...MIGNARDISE.notes,
    ],
  },
  {
    name: "Pénés",
    cta: { key: "mignardises", detail: "Pénés" },
    description:
      "De savoureuses portions individuelles de pâtes, faciles à servir sur un buffet.",
    tone: TONES.linen,
    pricing: { kind: "confirm" },
    ...MIGNARDISE,
    image: {
      src: "/images/mignardises/penes.webp",
      alt: "Portions individuelles de penne à la bolognaise et au parmesan en verrines",
      position: "50% 55%",
    },
  },
  {
    name: "Mini moelleux",
    cta: { key: "mignardises", detail: "Mini moelleux" },
    description: "De petites douceurs au chocolat, fondantes et gourmandes.",
    tone: TONES.cream,
    pricing: { kind: "confirm" },
    ...MIGNARDISE,
    image: {
      src: "/images/mignardises/mini-moelleux.webp",
      alt: "Mini moelleux au chocolat au cœur coulant, entourés de moelleux aux pistaches et aux fruits rouges",
      position: "50% 55%",
    },
  },
];

/**
 * Crêpes sucrées et salées. Les « crêpes sucrées » et « crêpes au
 * chocolat » correspondent aux mini-crêpes tarifées ci-dessous.
 */
export const CREPES: Product[] = [
  {
    name: "Mini-crêpes sucrées nature",
    cta: { key: "crepes", detail: "Mini-crêpes sucrées nature" },
    description: "De petites crêpes sucrées, à picorer sans compter.",
    tone: TONES.cream,
    pricing: {
      kind: "variants",
      items: [
        { label: "10 pièces", amount: 2_500 },
        { label: "20 pièces", amount: 5_000 },
      ],
    },
    leadTime: "24 h",
    leadDays: 1,
    ...MIGNARDISE,
  },
  {
    name: "Mini-crêpes au chocolat",
    cta: { key: "crepes", detail: "Mini-crêpes au chocolat" },
    description: "Les mini-crêpes, version chocolat.",
    tone: TONES.sand,
    pricing: {
      kind: "variants",
      items: [
        { label: "10 pièces", amount: 3_000 },
        { label: "20 pièces", amount: 6_000 },
      ],
    },
    leadTime: "24 h",
    leadDays: 1,
    ...MIGNARDISE,
  },
  {
    name: "Crêpes à la viande hachée",
    cta: { key: "crepes", detail: "Crêpes à la viande hachée" },
    description: "Des crêpes salées garnies de viande hachée.",
    tone: TONES.beige,
    pricing: { kind: "fixed", amount: 500, unit: "unité" },
    minQuantity: "10 pièces",
    leadTime: "48 h",
    leadDays: 2,
    ...MIGNARDISE,
  },
  {
    name: "Crêpes jambon-fromage",
    cta: { key: "crepes", detail: "Crêpes jambon-fromage" },
    description: "Le duo jambon et fromage, roulé dans une crêpe.",
    tone: TONES.linen,
    pricing: { kind: "fixed", amount: 1_000, unit: "unité" },
    minQuantity: "10 pièces",
    leadTime: "48 h",
    leadDays: 2,
    ...MIGNARDISE,
  },
  {
    name: "Crêpes au fromage",
    cta: { key: "crepes", detail: "Crêpes au fromage" },
    description: "Des crêpes salées au fromage fondant.",
    tone: TONES.cream,
    pricing: { kind: "confirm" },
    ...MIGNARDISE,
  },
  {
    name: "Crêpes Suzette à l’orange",
    cta: { key: "crepes", detail: "Crêpes Suzette à l’orange" },
    description: "Le classique des crêpes à l’orange.",
    tone: TONES.sand,
    pricing: { kind: "confirm" },
    ...MIGNARDISE,
  },
];

/**
 * Buffet gourmand — photos dans /public/images/buffet/.
 */
export const TRAITEUR: Product[] = [
  {
    name: "Événements professionnels",
    cta: { key: "evenementPro" },
    description:
      "Des gourmandises pour vos réceptions d’entreprise et vos moments entre collègues.",
    tone: TONES.sand,
    pricing: { kind: "quote" },
    request: "buffet",
    image: {
      src: "/images/buffet/evenements-professionnels.webp",
      alt: "Buffet de verrines, mini-burgers et tartelettes lors d’une réception professionnelle en soirée",
      position: "50% 50%",
    },
  },
  {
    name: "Buffets",
    cta: { key: "buffet" },
    description: "De jolies tables gourmandes à partager avec vos invités.",
    tone: TONES.linen,
    pricing: { kind: "quote" },
    request: "buffet",
    image: {
      src: "/images/buffet/buffets.jpg",
      alt: "Buffet de bouchées : brochettes tomate-fromage, mini-burgers, canapés au saumon et tartelettes",
      position: "30% 50%",
    },
  },
  {
    name: "Location de présentoirs",
    cta: { key: "presentoirs" },
    description:
      "Un set de cubes blancs pour mettre vos gourmandises en valeur.",
    tone: TONES.cream,
    pricing: { kind: "fixed", amount: PRESENTOIRS.price, unit: "le set" },
    request: "presentoirs",
    link: { label: "Voir l’offre de location", href: "#presentoirs" },
    image: {
      src: "/images/buffet/location-presentoirs.jpg",
      alt: "Présentoirs à gâteaux dorés, argentés et en marbre, cloche en verre et photophores dorés",
      position: "50% 75%",
    },
  },
  {
    name: "Pièces cocktail",
    cta: { key: "buffet", detail: "Pièces cocktail" },
    description:
      "De petites bouchées élégantes, à picorer entre deux conversations.",
    tone: TONES.beige,
    pricing: { kind: "quote" },
    request: "buffet",
    image: {
      src: "/images/buffet/pieces-cocktail.jpg",
      alt: "Pièces cocktail : bouchées de mousse fromagère et crevette sur base noire, servies sur miroir",
      position: "50% 55%",
    },
  },
];
