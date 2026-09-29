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

/**
 * Mignardises — pour ajouter la photo d'un produit, renseigner
 * `image: { src: "/images/mignardises/<fichier>.webp", alt: "…" }`.
 */
export const MIGNARDISES: Product[] = [
  {
    name: "Mini burgers",
    description:
      "Des bouchées généreuses, pensées pour vos cocktails, anniversaires, veillées et réceptions.",
    tone: TONES.sand,
    image: {
      src: "/images/mignardises/mini-burgers.webp",
      alt: "Mini burgers au cheddar, tomate et salade, piqués d’une brochette dorée sur un plateau de marbre",
      position: "50% 60%",
    },
  },
  {
    name: "Nems",
    description:
      "Des bouchées croustillantes et gourmandes, idéales pour accompagner vos événements.",
    tone: TONES.beige,
    image: {
      src: "/images/mignardises/nems.webp",
      alt: "Nems croustillants garnis de légumes, servis avec une sauce pimentée",
      position: "50% 55%",
    },
  },
  {
    name: "Pénés",
    description:
      "De savoureuses portions individuelles de pâtes, pensées pour les buffets et réceptions.",
    tone: TONES.linen,
    image: {
      src: "/images/mignardises/penes.webp",
      alt: "Portions individuelles de penne à la bolognaise et au parmesan en verrines",
      position: "50% 55%",
    },
  },
  {
    name: "Mini moelleux",
    description: "De petites douceurs au chocolat, fondantes et gourmandes.",
    tone: TONES.cream,
    image: {
      src: "/images/mignardises/mini-moelleux.webp",
      alt: "Mini moelleux au chocolat au cœur coulant, entourés de moelleux aux pistaches et aux fruits rouges",
      position: "50% 55%",
    },
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
