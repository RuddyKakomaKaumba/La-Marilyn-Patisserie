import { SITE_NAME, SOCIAL_LINKS, WHATSAPP_DISPLAY } from "./site";

/**
 * URL publique du site (NEXT_PUBLIC_SITE_URL). Obligatoire en production :
 * canonical, Open Graph, sitemap et données structurées en dépendent.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

/** Image de partage par défaut (réutilisée par chaque page). */
export const OG_IMAGE = {
  url: "/images/hero-entremets-chocolat.webp",
  width: 941,
  height: 1672,
  alt: "Entremets au chocolat La Marilyn orné du médaillon signature",
};

/**
 * Données structurées schema.org (Bakery). Uniquement des informations
 * confirmées : pas d'adresse précise, d'horaires, de prix ni d'avis.
 */
export function bakeryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: SITE_NAME,
    alternateName: "La Marilyn – L’art du gâteau",
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    logo: `${SITE_URL}/images/logo-la-marilyn.png`,
    telephone: WHATSAPP_DISPLAY.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Douala",
      addressCountry: "CM",
    },
    areaServed: { "@type": "City", name: "Douala" },
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
  };
}
