import { formatFcfa } from "./pricing";
import { whatsappUrl } from "./site";

/** Types de demande préparée sur le site, puis envoyée sur WhatsApp. */
export type RequestType =
  | "cake-design"
  | "gateaux"
  | "mignardises"
  | "buffet"
  | "presentoirs"
  | "ecrin";

export const REQUEST_TYPES: Record<
  RequestType,
  {
    label: string;
    /** Titre du message WhatsApp. */
    subject: string;
    /** Délai minimum en jours (contrôle de la date), si confirmé. */
    leadDays?: number;
    leadLabel?: string;
  }
> = {
  "cake-design": {
    label: "Cake Design",
    subject: "Demande de devis — Cake Design",
    leadDays: 5,
    leadLabel: "5 jours",
  },
  gateaux: {
    label: "Gâteaux gourmands",
    subject: "Demande de commande — Gâteaux gourmands",
    leadDays: 1,
    leadLabel: "24 h",
  },
  mignardises: {
    label: "Mignardises et crêpes",
    subject: "Demande de commande — Mignardises et crêpes",
    leadDays: 1,
    leadLabel: "24 h",
  },
  buffet: {
    label: "Buffet / événement",
    subject: "Demande de devis — Buffet / événement",
  },
  presentoirs: {
    label: "Location de présentoirs",
    subject: "Demande de location — Présentoirs",
  },
  ecrin: {
    label: "L’Écrin gourmand",
    subject: "Demande de composition — L’Écrin gourmand by La Marilyn",
    leadDays: 7,
    leadLabel: "7 jours",
  },
};

export const isRequestType = (value: string | null): value is RequestType =>
  !!value && value in REQUEST_TYPES;

/** Lien vers le formulaire de demande (page À propos), prérempli. */
export const requestHref = (type: RequestType) =>
  type === "ecrin"
    ? "/nos-creations#ecrin"
    : `/a-propos?demande=${type}#demande`;

/* ---- Dates ------------------------------------------------------------ */

/** Date locale au format AAAA-MM-JJ (valeur d'un <input type="date">). */
export function isoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Nombre de jours entre aujourd'hui et la date choisie (AAAA-MM-JJ). */
export function daysUntil(value: string, now = new Date()) {
  const [y, m, d] = value.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Contrôle du délai minimum. Renvoie un message d'erreur si la date est
 * passée, ou trop proche sans que la demande soit marquée urgente.
 */
export function checkDate(
  value: string,
  leadDays: number | undefined,
  leadLabel: string | undefined,
  urgent: boolean,
): string | undefined {
  if (!value) return "Indiquez la date souhaitée.";
  const days = daysUntil(value);
  if (Number.isNaN(days)) return "Indiquez une date valide.";
  if (days < 0) return "Cette date est déjà passée.";
  if (leadDays && days < leadDays && !urgent) {
    return `Le délai minimum est de ${leadLabel}. Pour une date plus proche, cochez « Demande urgente » : La Marilyn vous dira si c’est possible.`;
  }
  return undefined;
}

/* ---- Message ---------------------------------------------------------- */

/** Rappel, à la première personne, ajouté à la fin de chaque demande. */
const NOT_BOOKING_NOTE =
  "J’ai bien noté que cette demande ne vaut pas réservation : la commande sera confirmée après validation du projet, accord sur le prix et réception de l’acompte.";

export type MessageField = [
  label: string,
  value: string | string[] | undefined,
];

/**
 * Message WhatsApp lisible : titre, une ligne par information renseignée
 * (les champs vides sont omis), puis le rappel des conditions.
 */
export function buildRequestMessage(
  subject: string,
  fields: MessageField[],
  closing: string[] = [],
) {
  const lines = [
    "Bonjour La Marilyn 👋",
    "Je viens de votre site.",
    `${subject}`,
    "",
  ];
  for (const [label, value] of fields) {
    if (Array.isArray(value)) {
      const items = value.filter(Boolean);
      if (!items.length) continue;
      lines.push(`• ${label} :`, ...items.map((i) => `   – ${i}`));
    } else if (value && value.trim()) {
      lines.push(`• ${label} : ${value.trim()}`);
    }
  }
  lines.push("", ...closing, NOT_BOOKING_NOTE, "", "Merci !");
  return lines.join("\n");
}

/** « 40000 » → « 40 000 FCFA » ; texte libre conservé tel quel. */
export function budgetText(value: string | undefined) {
  const v = value?.trim();
  if (!v) return undefined;
  const digits = v.replace(/[\s.]/g, "");
  return /^\d+$/.test(digits) ? formatFcfa(Number(digits)) : v;
}

export const requestUrl = (...args: Parameters<typeof buildRequestMessage>) =>
  whatsappUrl(buildRequestMessage(...args));
