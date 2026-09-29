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
