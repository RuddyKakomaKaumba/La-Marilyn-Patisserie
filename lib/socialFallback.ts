import { SOCIAL_LINKS } from "./site";

/**
 * Galerie de secours de « Quelques créations signées La Marilyn », affichée
 * tant qu'Instagram n'est pas configuré, si l'API Meta est indisponible, ou
 * pour compléter la mosaïque s'il y a moins de 6 publications.
 *
 * Pour remplacer un aplat par une photo locale : déposer le fichier dans
 * /public/images/galerie/ et renseigner `image`.
 */
export type SocialFallbackItem = {
  /** Teinte affichée (aussi utilisée comme fond pendant le chargement). */
  tone: string;
  image?: { src: string; alt: string };
  href: string;
};

/** Nuances : caramel, chocolat noir, beige, chocolat clair, crème, sable. */
export const SOCIAL_FALLBACK: SocialFallbackItem[] = [
  { tone: "#c99a67", href: SOCIAL_LINKS.instagram },
  { tone: "#3d2a1f", href: SOCIAL_LINKS.instagram },
  { tone: "#e6d7c2", href: SOCIAL_LINKS.instagram },
  { tone: "#8a5f43", href: SOCIAL_LINKS.instagram },
  { tone: "#efe5d7", href: SOCIAL_LINKS.instagram },
  { tone: "#dcc6a8", href: SOCIAL_LINKS.instagram },
];
