import type { Product } from "@/components/InfiniteProductCarousel";

/** Nuances des placeholders : crème, beige chaud, brun très clair. */
const TONES = {
  cream: "#efe5d7",
  beige: "#e6d7c2",
  sand: "#ddcab1",
  linen: "#e9ddcb",
};

/**
 * Pâtisseries — photos dans /public/images/patisseries/. Pour en changer,
 * remplacer le fichier ou `image.src` ; `tone` reste le fond de chargement.
 */
export const PATISSERIES: Product[] = [
  {
    name: "Cake yaourt & citron",
    description:
      "Moelleux au yaourt, parfumé au citron et nappé d’un glaçage léger.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-yaourt-citron.webp",
      alt: "Cake au yaourt et au citron tranché, nappé de glaçage et de zestes de citron",
      position: "58% 50%",
    },
  },
  {
    name: "Cake nature",
    description:
      "Le grand classique, doré et fondant, tout simplement gourmand.",
    tone: TONES.linen,
    image: {
      src: "/images/patisseries/cake-nature.webp",
      alt: "Cake nature doré coupé en tranches sur une planche",
      position: "55% 50%",
    },
  },
  {
    name: "Moelleux au chocolat",
    description:
      "Cœur fondant et chocolat intense : notre création la plus demandée.",
    tone: TONES.sand,
    badge: "Best-seller",
    image: {
      src: "/images/patisseries/moelleux-chocolat.webp",
      alt: "Moelleux au chocolat au cœur coulant, décorés de fraises, framboises et pistaches",
      position: "50% 50%",
    },
  },
  {
    name: "Cake noix de coco",
    description:
      "Un cake moelleux, généreusement recouvert de noix de coco toastée.",
    tone: TONES.beige,
    image: {
      src: "/images/patisseries/cake-noix-de-coco.webp",
      alt: "Cake à la noix de coco toastée tranché sur une planche en bois",
      position: "55% 50%",
    },
  },
  {
    name: "Cake à l’orange",
    description: "Parfumé à l’orange et garni de zestes confits.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-orange.webp",
      alt: "Cake à l’orange tranché, nappé de glaçage et de zestes d’orange confits",
      position: "58% 50%",
    },
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
