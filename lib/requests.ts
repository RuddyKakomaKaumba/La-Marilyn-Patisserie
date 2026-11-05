import { isClosedDate } from "./availability";
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
    subject: "J’aimerais un devis pour un gâteau Cake Design.",
    leadDays: 5,
    leadLabel: "5 jours",
  },
  gateaux: {
    label: "Gâteaux gourmands",
    subject: "J’aimerais commander des gâteaux gourmands.",
    leadDays: 1,
    leadLabel: "24 h",
  },
  mignardises: {
    label: "Mignardises et crêpes",
    subject: "J’aimerais commander des mignardises ou des crêpes.",
    leadDays: 1,
    leadLabel: "24 h",
  },
  buffet: {
    label: "Buffet / événement",
    subject: "J’aimerais un devis pour un buffet ou un événement.",
  },
  presentoirs: {
    label: "Location de présentoirs",
    subject: "J’aimerais louer vos présentoirs.",
  },
  ecrin: {
    label: "L’Écrin gourmand",
    subject: "J’aimerais composer un Écrin gourmand.",
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

/** Fuseau de La Marilyn : délais et heure limite suivent l'heure de Douala. */
const TIME_ZONE = "Africa/Douala";

/** Date (AAAA-MM-JJ) et heure du moment à Douala, quel que soit le visiteur. */
export function nowInDouala(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    today: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}

/** Ajoute des jours à une date AAAA-MM-JJ. */
export function addDays(value: string, days: number) {
  const [y, m, d] = value.split("-").map(Number);
  return isoDate(new Date(y, m - 1, d + days));
}

/**
 * Première date proposée sans urgence : aujourd'hui (heure de Douala) plus
 * le délai minimum confirmé. Sans délai connu : aujourd'hui.
 */
export function firstRequestDate(
  leadDays: number | undefined,
  now = new Date(),
) {
  return addDays(nowInDouala(now).today, leadDays ?? 0);
}

/** Nombre de jours entre aujourd'hui (Douala) et la date choisie (AAAA-MM-JJ). */
export function daysUntil(value: string, now = new Date()) {
  const [y, m, d] = value.split("-").map(Number);
  const [ty, tm, td] = nowInDouala(now).today.split("-").map(Number);
  return Math.round(
    (Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000,
  );
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

/** « 24 décembre » ou « du 31 décembre au 2 janvier » (dates fermées). */
export function formatRange(from: string, to: string) {
  const short = (v: string) => {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
  };
  return from === to ? short(from) : `du ${short(from)} au ${short(to)}`;
}

/**
 * Contrôle de la date : passée, fermée aux demandes, ou trop proche sans
 * que la demande soit marquée urgente. L'urgence ne rouvre pas une date
 * fermée et reste soumise à la validation de La Marilyn.
 */
export function checkDate(
  value: string,
  leadDays: number | undefined,
  leadLabel: string | undefined,
  urgent: boolean,
  now = new Date(),
): string | undefined {
  if (!value) return "Indiquez la date souhaitée.";
  const days = daysUntil(value, now);
  if (Number.isNaN(days)) return "Indiquez une date valide.";
  if (days < 0) return "Cette date est déjà passée.";
  if (isClosedDate(value)) {
    return "La Marilyn ne prend pas de nouvelles demandes pour cette date. Choisissez-en une autre, ou écrivez-lui sur WhatsApp pour en parler.";
  }
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
    "Je vous écris depuis votre site.",
    `${subject}`,
    "",
  ];
  for (const [label, value] of fields) {
    if (Array.isArray(value)) {
      const items = value.filter(Boolean);
      if (!items.length) continue;
      lines.push(`• ${label} :`, ...items.map((i) => `   ◦ ${i}`));
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
