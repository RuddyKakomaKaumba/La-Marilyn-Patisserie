export const SITE_NAME = "La Marilyn";

const WHATSAPP_NUMBER = "23794768972";
const WHATSAPP_MESSAGE =
  "Bonjour La Marilyn, je souhaiterais avoir plus d'informations sur vos créations.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const LOGO = {
  src: "/images/logo-la-marilyn.png",
  width: 508,
  height: 492,
};
