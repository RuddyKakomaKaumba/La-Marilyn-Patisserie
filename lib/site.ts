export const SITE_NAME = "La Marilyn";

const WHATSAPP_NUMBER = "23794768972";
/** Lien WhatsApp (wa.me) vers La Marilyn, avec un message prérempli. */
export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * CTA commerciaux : le site est une vitrine, chaque demande part sur
 * WhatsApp avec un intitulé et un message propres à la section d'origine.
 */
export type WhatsAppCta =
  | "general"
  | "patisserie"
  | "mignardises"
  | "buffet"
  | "evenementPro"
  | "presentoirs"
  | "surMesure"
  | "evenement";

export const WHATSAPP_CTAS: Record<
  WhatsAppCta,
  { label: string; intent: string }
> = {
  general: {
    label: "Écrire à La Marilyn",
    intent: "j’aimerais en savoir plus sur vos gourmandises",
  },
  patisserie: {
    label: "Commander une pâtisserie",
    intent: "j’aimerais commander une pâtisserie",
  },
  mignardises: {
    label: "Commander des mignardises",
    intent: "j’aimerais commander des mignardises",
  },
  buffet: {
    label: "Préparer mon buffet",
    intent: "j’aimerais préparer un buffet gourmand pour recevoir mes invités",
  },
  evenementPro: {
    label: "Préparer mon événement",
    intent:
      "j’aimerais préparer des gourmandises pour un événement professionnel",
  },
  presentoirs: {
    label: "Demander les disponibilités",
    intent:
      "j’aimerais connaître les disponibilités pour la location de présentoirs",
  },
  surMesure: {
    label: "Imaginer mon gâteau",
    intent: "j’aimerais imaginer avec vous un gâteau sur mesure",
  },
  evenement: {
    label: "Préparer mon événement",
    intent: "j’aimerais préparer quelque chose de gourmand pour mon événement",
  },
};

/**
 * Lien WhatsApp d'un CTA. `detail` précise le produit concerné, ex. :
 * « … j’aimerais commander une pâtisserie : Cake nature. »
 */
export function ctaUrl(cta: WhatsAppCta, detail?: string) {
  const { intent } = WHATSAPP_CTAS[cta];
  return whatsappUrl(
    `Bonjour La Marilyn 👋 Je viens de votre site et ${intent}${
      detail ? ` : ${detail}` : ""
    }.`,
  );
}

/** Contact général (bouton flottant, header, fin de page). */
export const WHATSAPP_URL = ctaUrl("general");

export const LOGO = {
  src: "/images/logo-la-marilyn.png",
  width: 508,
  height: 492,
};

/** Navigation principale, partagée par le header et le pied de page. */
export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/nos-creations", label: "Nos créations" },
  { href: "/a-propos", label: "À propos / Contact" },
];

/**
 * Comptes officiels La Marilyn. Pour ajouter un réseau (ou un flux Facebook
 * plus tard), compléter cet objet : header, footer et galerie s'y réfèrent.
 */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/lamarilyn2",
  facebook: "https://www.facebook.com/lamarilyn2",
} as const;
