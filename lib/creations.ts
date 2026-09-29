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
      position: "60% 50%",
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
      position: "60% 50%",
    },
  },
  {
    name: "Moelleux au chocolat",
    description:
      "Cœur fondant et chocolat intense : notre création la plus demandée.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/moelleux-chocolat.webp",
      alt: "Moelleux au chocolat au cœur coulant, décorés de fraises, framboises et pistaches",
      position: "45% 50%",
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
      position: "65% 50%",
    },
  },
  {
    name: "Cake à l’orange",
    description: "Parfumé à l’orange et garni de zestes confits.",
    tone: TONES.cream,
    image: {
      src: "/images/patisseries/cake-orange.webp",
      alt: "Cake à l’orange tranché, nappé de glaçage et de zestes d’orange confits",
      position: "60% 50%",
    },
  },
  {
    name: "Renversé à l’ananas",
    description: "Ananas caramélisé sur un gâteau moelleux et doré.",
    tone: TONES.sand,
    badge: "best-seller",
    image: {
      src: "/images/patisseries/renverse-ananas.webp",
      alt: "Gâteau renversé à l’ananas caramélisé, une part servie sur un présentoir",
      position: "70% 50%",
    },
  },
  {
    name: "Gâteau d’anniversaire",
    description:
      "Des créations personnalisées pour célébrer petits et grands moments.",
    tone: TONES.linen,
    badge: "sur-commande",
    image: {
      src: "/images/patisseries/gateau-anniversaire.webp",
      alt: "Gâteau d’anniversaire à étages décoré de vermicelles colorés et de bougies",
      position: "60% 50%",
    },
  },
  {
    name: "Gâteau de mariage",
    description:
      "Des créations élégantes et sur mesure pour accompagner votre grand jour.",
    tone: TONES.cream,
    badge: "sur-commande",
    image: {
      src: "/images/patisseries/gateau-mariage.webp",
      alt: "Pièce montée de mariage à quatre étages ornée de roses blanches et de feuille d’or",
      position: "50% 25%",
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

/**
 * Buffet gourmand — photos dans /public/images/buffet/. « Pièces cocktail »
 * garde son aplat de couleur en attendant sa photo (ajouter `image`).
 */
export const TRAITEUR: Product[] = [
  {
    name: "Événements professionnels",
    description: "Des créations adaptées à vos événements professionnels.",
    tone: TONES.sand,
    image: {
      src: "/images/buffet/evenements-professionnels.webp",
      alt: "Buffet de verrines, mini-burgers et tartelettes lors d’une réception professionnelle en soirée",
      position: "50% 50%",
    },
  },
  {
    name: "Buffets",
    description: "Des formules gourmandes adaptées à vos événements.",
    tone: TONES.linen,
    image: {
      src: "/images/buffet/buffets.jpg",
      alt: "Buffet de bouchées : brochettes tomate-fromage, mini-burgers, canapés au saumon et tartelettes",
      position: "30% 50%",
    },
  },
  {
    name: "Location de présentoirs",
    description:
      "Des présentoirs élégants pour mettre vos créations en valeur.",
    tone: TONES.cream,
    image: {
      src: "/images/buffet/location-presentoirs.jpg",
      alt: "Présentoirs à gâteaux dorés, argentés et en marbre, cloche en verre et photophores dorés",
      position: "50% 75%",
    },
  },
  {
    name: "Pièces cocktail",
    description: "Des bouchées gourmandes et élégantes pour vos réceptions.",
    tone: TONES.beige,
  },
];
