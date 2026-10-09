import type { Pricing } from "@/components/InfiniteProductCarousel";

/** 4500 → « 4 500 FCFA » (espaces insécables). */
export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR").replace(/\s/g, " ")} FCFA`;
}

const withUnit = (text: string, unit?: string) =>
  unit ? `${text} / ${unit}` : text;

/** Résumé court pour la carte produit (une ligne). */
export function priceSummary(pricing?: Pricing): string | null {
  if (!pricing) return null;
  switch (pricing.kind) {
    case "fixed":
      return withUnit(formatFcfa(pricing.amount), pricing.unit);
    case "from":
      return withUnit(
        `À partir de ${formatFcfa(pricing.amount)}`,
        pricing.unit,
      );
    case "variants": {
      const [first] = pricing.items;
      return first ? `${formatFcfa(first.amount)} · ${first.label}` : null;
    }
    case "quote":
      return "Sur devis";
    case "confirm":
      return "Prix à confirmer";
  }
}

/** Lignes de tarif détaillées pour la fiche produit. */
export function priceLines(pricing?: Pricing): string[] {
  if (!pricing) return [];
  if (pricing.kind === "variants") {
    return pricing.items.map((i) => `${i.label} : ${formatFcfa(i.amount)}`);
  }
  if (pricing.kind === "confirm") return ["Tarif à confirmer avec La Marilyn"];
  const summary = priceSummary(pricing);
  return summary ? [summary] : [];
}
