import type { Product } from "@/components/InfiniteProductCarousel";

/** Nuances des placeholders : crème, beige chaud, brun très clair. */
const TONES = {
  cream: "#efe5d7",
  beige: "#e6d7c2",
  sand: "#ddcab1",
  linen: "#e9ddcb",
};

export const PATISSERIES: Product[] = [
  {
    name: "Tarte framboise",
    description: "Pâte sablée, crème légère et framboises fraîches.",
    tone: TONES.cream,
  },
  {
    name: "Entremet chocolat",
    description: "Mousse chocolat noir et cœur praliné.",
    tone: TONES.sand,
  },
  {
    name: "Gâteau vanille",
    description: "Une création douce et délicate.",
    tone: TONES.linen,
  },
  {
    name: "Création sur mesure",
    description: "Imaginée spécialement pour votre occasion.",
    tone: TONES.beige,
  },
];

export const MIGNARDISES: Product[] = [
  {
    name: "Assortiment sucré",
    description: "Macarons, tartelettes, choux, entremets…",
    tone: TONES.beige,
  },
  {
    name: "Mignardises chocolat",
    description: "Bouchées raffinées au chocolat.",
    tone: TONES.sand,
  },
  {
    name: "Mini créations",
    description: "Des petites bouchées pour toutes les occasions.",
    tone: TONES.cream,
  },
  {
    name: "Assortiment événement",
    description: "Une sélection adaptée à votre réception.",
    tone: TONES.linen,
  },
];

export const TRAITEUR: Product[] = [
  {
    name: "Buffet salé-sucré",
    description: "Des formules adaptées à vos événements.",
    tone: TONES.linen,
  },
  {
    name: "Pièces cocktail",
    description: "Bouchées gourmandes et élégantes.",
    tone: TONES.beige,
  },
  {
    name: "Réceptions",
    description: "Une sélection pensée pour recevoir.",
    tone: TONES.cream,
  },
  {
    name: "Événements professionnels",
    description: "Des créations adaptées à vos besoins.",
    tone: TONES.sand,
  },
];
