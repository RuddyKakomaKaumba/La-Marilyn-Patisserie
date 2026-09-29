export const SITE_NAME = "La Marilyn";

const WHATSAPP_NUMBER = "23794768972";
const WHATSAPP_MESSAGE =
  "Bonjour La Marilyn, je souhaiterais avoir plus d'informations sur vos créations.";

/** Lien WhatsApp vers La Marilyn, avec un message prérempli. */
export function whatsappUrl(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_URL = whatsappUrl();

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
 * Réseaux sociaux — À CONFIGURER : remplacer "#" par les URL des comptes
 * La Marilyn (ex. "https://www.instagram.com/<compte>").
 */
export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
};
