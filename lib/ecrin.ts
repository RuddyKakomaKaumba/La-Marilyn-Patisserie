import type { Product } from "@/components/InfiniteProductCarousel";
import { CREPES, MIGNARDISES, PATISSERIES } from "./creations";

/**
 * Écrins pré-composés. Collection vide tant que La Marilyn n'a pas
 * confirmé de composition : la section affiche alors « Bientôt
 * disponible ». Pour en ajouter un, compléter ce tableau (le prix et la
 * composition doivent être confirmés).
 */
export type PrecomposedEcrin = {
  name: string;
  description: string;
  /** Contenu confirmé de l'écrin. */
  contents: string[];
  /** Prix confirmé (FCFA) ; sans prix confirmé : laisser vide. */
  price?: number;
  image?: { src: string; alt: string; position?: string };
};

export const PRECOMPOSED_ECRINS: PrecomposedEcrin[] = [];

/**
 * Gourmandises proposées dans le configurateur : uniquement les douceurs
 * du catalogue dont le tarif est confirmé. Le choix reste soumis à la
 * validation de La Marilyn.
 */
const SWEET_EXTRAS = [
  "Mini-cupcakes",
  "Mini-crêpes sucrées nature",
  "Mini-crêpes au chocolat",
];

const confirmed = (p: Product) =>
  !!p.pricing && p.pricing.kind !== "confirm" && p.pricing.kind !== "quote";

export const ECRIN_GOURMANDISES: { group: string; items: string[] }[] = [
  {
    group: "Gâteaux gourmands",
    items: PATISSERIES.filter(confirmed).map((p) => p.name),
  },
  {
    group: "Mignardises et crêpes",
    items: [...MIGNARDISES, ...CREPES]
      .filter((p) => confirmed(p) && SWEET_EXTRAS.includes(p.name))
      .map((p) => p.name),
  },
];

export const ECRIN_OCCASIONS = [
  "Anniversaire",
  "Remerciement",
  "Naissance",
  "Mariage",
  "Saint-Valentin",
  "Fête des mères",
  "Fête des pères",
  "Cadeau d’entreprise",
  "Autre",
];
