/**
 * Calendrier indicatif des demandes : dates fermées à la main.
 *
 * Pour fermer une date aux nouvelles demandes, ajoutez une ligne ci-dessous
 * (format AAAA-MM-JJ), puis redéployez le site :
 *
 *   "2026-12-25",                                  // un seul jour
 *   { from: "2026-12-31", to: "2027-01-02" },      // une période, incluse
 *
 * Aucune réservation n'est enregistrée : ces dates servent seulement à
 * guider le visiteur. Toute demande reste validée par La Marilyn sur
 * WhatsApp avant le paiement de l'acompte.
 */
export type ClosedEntry = string | { from: string; to: string };

export const CLOSED_REQUEST_DATES: ClosedEntry[] = [
  // "2026-12-25",
  // { from: "2026-12-31", to: "2027-01-02" },
];

/** Mention affichée sous la date, dans chaque formulaire. */
export const AVAILABILITY_NOTICE =
  "Calendrier indicatif : une date possible ici ne garantit pas la disponibilité de La Marilyn. Elle vous est confirmée sur WhatsApp, avec le prix, avant le paiement de l’acompte.";

/* ---- Lecture de la configuration ------------------------------------- */

const ISO = /^\d{4}-\d{2}-\d{2}$/;

const isValidIso = (value: string) => {
  if (!ISO.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
};

type Range = { from: string; to: string };

/** Périodes valides (une date seule devient une période d'un jour). */
export const CLOSED_RANGES: Range[] = CLOSED_REQUEST_DATES.flatMap((entry) => {
  const range = typeof entry === "string" ? { from: entry, to: entry } : entry;
  const ok =
    isValidIso(range.from) && isValidIso(range.to) && range.from <= range.to;
  if (!ok && process.env.NODE_ENV !== "production") {
    console.warn("lib/availability.ts : date fermée ignorée", entry);
  }
  return ok ? [range] : [];
}).sort((a, b) => a.from.localeCompare(b.from));

/** La date (AAAA-MM-JJ) est-elle fermée aux nouvelles demandes ? */
export const isClosedDate = (value: string) =>
  CLOSED_RANGES.some((r) => value >= r.from && value <= r.to);

/** Périodes fermées qui ne sont pas encore passées. */
export const upcomingClosedRanges = (todayIso: string) =>
  CLOSED_RANGES.filter((r) => r.to >= todayIso);
