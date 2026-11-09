import type { Product } from "@/components/InfiniteProductCarousel";
import {
  CAKE_DESIGN_TERMS,
  DELIVERY_SHORT,
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
const GATEAU: Pick<
  Product,
  "notes" | "leadTime" | "leadDays" | "request" | "delivery"
> = {
  delivery: DELIVERY_SHORT.standard,
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
      "Fondant et bien chocolaté, c’est le gâteau que nos clients commandent le plus.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/moelleux-au-chocolat-la-marilyn.webp",
      alt: "Moelleux au chocolat tranché sur une planche en bambou, mie dense et fondante",
      position: "50% 55%",
    },
  }),
  gateau("Gâteau au yaourt", 4_000, {
    description: "Le moelleux tout simple au yaourt, doux et réconfortant.",
    tone: TONES.linen,
    image: {
      src: "/images/patisseries/gateau-yaourt.webp",
      alt: "Gâteau au yaourt doré saupoudré de sucre glace, une part découpée",
      position: "58% 50%",
    },
  }),
  gateau("Cake yaourt & citron", 4_500, {
    description: "Moelleux au yaourt, délicatement parfumé au citron.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-yaourt-citron-la-marilyn.webp",
      alt: "Cake yaourt-citron doré, coupé en tranches au couteau, à côté d’un demi-citron",
      position: "50% 45%",
    },
  }),
  gateau("Cake marbré", 4_500, {
    description: "Le grand classique marbré, à partager au goûter.",
    tone: TONES.beige,
    image: {
      src: "/images/patisseries/cake-marbre-chocolat-la-marilyn.webp",
      alt: "Tranches de cake marbré vanille-chocolat disposées sur un plat blanc",
      position: "40% 50%",
    },
  }),
  gateau("Cake noix de coco", 4_500, {
    description: "Un cake moelleux, généreusement recouvert de noix de coco.",
    tone: TONES.beige,
    image: {
      src: "/images/patisseries/cake-noix-de-coco-la-marilyn.webp",
      alt: "Cake à la noix de coco entamé, le dessus recouvert de noix de coco râpée",
      position: "50% 60%",
    },
  }),
  gateau("Cake banane", 4_500, {
    description: "Un cake moelleux à la banane, tendre et parfumé.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-a-la-banane-la-marilyn.webp",
      alt: "Cake à la banane entamé, mie moelleuse et croûte dorée",
      position: "50% 50%",
    },
  }),
  gateau("Cake à l’orange", 4_500, {
    description: "Un cake moelleux, parfumé à l’orange.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-a-l-orange-la-marilyn.webp",
      alt: "Cake à l’orange tranché sur un plat blanc, à côté de rondelles d’orange",
      position: "45% 50%",
    },
  }),
  gateau("Cake praliné chocolat", 7_500, {
    description: "Chocolat et praliné réunis dans un cake gourmand.",
    tone: TONES.sand,
    image: {
      src: "/images/patisseries/cake-praline-chocolat-la-marilyn.webp",
      alt: "Cake praliné chocolat nappé de glaçage au chocolat, deux tranches coupées sur une planche en marbre",
      position: "42% 50%",
    },
  }),
  gateau("Renversé à l’ananas", 5_000, {
    description: "Ananas caramélisé sur un gâteau moelleux et doré.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/renverse-ananas-la-marilyn.webp",
      alt: "Gâteau renversé à l’ananas rectangulaire, trois tranches d’ananas caramélisées, vu de dessus sur un plan de marbre",
      position: "50% 50%",
    },
  }),
  gateau("Cake velvet", 6_000, {
    description: "Un cake velvet à la mie tendre et colorée.",
    tone: TONES.linen,
    image: {
      src: "/images/patisseries/velvet-cake-la-marilyn.webp",
      alt: "Velvet cake rouge coupé en tranches sur un plat blanc",
      position: "45% 55%",
    },
  }),
  // Absent de la grille tarifaire transmise : prix à confirmer.
  gateau("Cake nature", 4_000, {
    description:
      "Le cake nature tout simple, doré et moelleux, parfait pour le goûter.",
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
      "Un gâteau pensé pour la personne que vous fêtez, à partager en famille ou entre amis.",
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
export const MIGNARDISES: Product[] = (
  [
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
        src: "/images/mignardises/mini-burgers-la-marilyn.webp",
        alt: "Mini-burgers au sésame garnis de salade, piqués d’un cure-dent, dans une boîte de livraison",
        position: "50% 50%",
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
        src: "/images/mignardises/nems-la-marilyn.webp",
        alt: "Nems dorés et croustillants posés sur du papier absorbant",
        position: "50% 50%",
      },
    },
    {
      name: "Mini-cupcakes",
      cta: { key: "mignardises", detail: "Mini-cupcakes" },
      description: "De mini-cupcakes surmontés d’une jolie crème.",
      tone: TONES.linen,
      image: {
        src: "/images/mignardises/mini-cupcakes-la-marilyn.webp",
        alt: "Mini-cupcakes surmontés d’une rosace de crème rose ou blanche",
        position: "60% 60%",
      },
      pricing: {
        kind: "variants",
        items: [
          { label: "9 pièces, décor simple", amount: 10_000 },
          { label: "9 pièces, décor personnalisé", amount: 15_000 },
        ],
      },
      options: ["Crème au beurre", "Chantilly"],
      minQuantity: "9 pièces",
      leadTime: "24 h",
      leadDays: 1,
      ...MIGNARDISE,
      notes: [
        "Au-delà de 9 pièces, la commande se fait par lots de 9.",
        ...MIGNARDISE.notes,
      ],
    },
    {
      name: "Pilis-pilis",
      cta: { key: "mignardises", detail: "Pilis-pilis" },
      description:
        "Des chaussons dorés et croustillants, faciles à servir à l’apéritif ou sur un buffet.",
      tone: TONES.linen,
      pricing: { kind: "fixed", amount: 500, unit: "unité" },
      minQuantity: "10 pièces",
      leadTime: "48 h",
      leadDays: 2,
      ...MIGNARDISE,
      image: {
        src: "/images/mignardises/pilis-pilis-la-marilyn.webp",
        alt: "Pilis-pilis dorés disposés sur un lit de salade, avec des quartiers de citron",
        position: "50% 50%",
      },
    },
    {
      name: "Mini moelleux",
      cta: { key: "mignardises", detail: "Mini moelleux" },
      description:
        "De petits moelleux au chocolat, à servir en dessert ou sur un buffet.",
      tone: TONES.cream,
      pricing: { kind: "fixed", amount: 400, unit: "unité" },
      minQuantity: "15 pièces",
      leadTime: "24 h",
      leadDays: 1,
      ...MIGNARDISE,
      image: {
        src: "/images/mignardises/mini-moelleux-au-chocolat-la-marilyn.webp",
        alt: "Mini moelleux au chocolat sur une assiette, l’un coupé en deux, d’autres sur une grille",
        position: "50% 60%",
      },
    },
  ] as Product[]
).map((p) => ({ ...p, delivery: DELIVERY_SHORT.standard }));

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
    image: {
      src: "/images/crepes/crepes-nature-la-marilyn.webp",
      alt: "Pile de crêpes nature dorées, pliées en carrés",
      position: "50% 50%",
    },
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
    image: {
      src: "/images/crepes/crepes-au-chocolat-la-marilyn-vue-dessus.webp",
      alt: "Crêpes pliées en éventail sur une assiette, vue de dessus, avec un pot de pâte à tartiner au chocolat",
      position: "50% 50%",
    },
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
    image: {
      src: "/images/crepes/crepes-viande-hachee.webp",
      alt: "Crêpes pliées garnies de viande hachée, servies sur un plat",
      position: "52% 55%",
    },
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
    image: {
      src: "/images/crepes/crepes-jambon-fromage-la-marilyn.webp",
      alt: "Crêpes dorées garnies de dés de jambon et de fromage fondu",
      position: "38% 50%",
    },
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
    image: {
      src: "/images/crepes/crepes-fromage.webp",
      alt: "Crêpes pliées au fromage fondant, une part soulevée en filant",
      position: "58% 55%",
    },
    pricing: { kind: "fixed", amount: 1_000, unit: "les 10 pièces" },
    minQuantity: "10 pièces",
    leadTime: "24 h",
    leadDays: 1,
    ...MIGNARDISE,
  },
  {
    name: "Crêpes Suzette à l’orange",
    cta: { key: "crepes", detail: "Crêpes Suzette à l’orange" },
    description: "Le classique des crêpes à l’orange.",
    tone: TONES.sand,
    image: {
      src: "/images/crepes/crepes-suzette-la-marilyn.webp",
      alt: "Crêpes Suzette nappées de sauce à l’orange, quartiers d’orange, zestes et cheveux de caramel",
      position: "50% 50%",
    },
    pricing: { kind: "fixed", amount: 5_000, unit: "les 10 pièces" },
    minQuantity: "10 pièces",
    leadTime: "24 h",
    leadDays: 1,
    ...MIGNARDISE,
  },
];

/**
 * Buffet gourmand — photos dans /public/images/buffet/.
 */
export const TRAITEUR: Product[] = (
  [
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
        src: "/images/buffet/buffet-gourmand-la-marilyn.webp",
        alt: "Buffet gourmand La Marilyn : mini-burgers au sésame, tranches de cake, feuilletés et chaussons sur une table nappée de blanc et de bleu",
        position: "50% 60%",
      },
    },
    {
      name: "Location de présentoirs",
      cta: { key: "presentoirs" },
      description:
        "Un set de cubes blancs pour mettre vos gourmandises en valeur.",
      tone: TONES.cream,
      pricing: {
        kind: "fixed",
        amount: PRESENTOIRS.price,
        unit: "le set, 24 h",
      },
      request: "presentoirs",
      link: { label: "Voir l’offre de location", href: "#presentoirs" },
      image: {
        src: "/images/presentoirs/cubes-blancs-table-marbre.webp",
        alt: "Cubes présentoirs blancs de différentes tailles posés sur une table en marbre",
        position: "48% 62%",
      },
    },
    {
      name: "Pièces cocktail",
      cta: { key: "buffet", detail: "Pièces cocktail" },
      description: "De petites bouchées faciles à servir pendant un cocktail.",
      tone: TONES.beige,
      pricing: { kind: "quote" },
      request: "buffet",
      image: {
        src: "/images/buffet/pieces-cocktail.jpg",
        alt: "Pièces cocktail : bouchées de mousse fromagère et crevette sur base noire, servies sur miroir",
        position: "50% 55%",
      },
    },
  ] as Product[]
).map((p) => ({
  ...p,
  delivery:
    p.request === "presentoirs"
      ? PRESENTOIRS.transport.replace(/\.$/, "")
      : DELIVERY_SHORT.events,
}));
