import type { Product } from "@/components/InfiniteProductCarousel";
import { DELIVERY } from "./commerce";
import { CREPES, MIGNARDISES, PATISSERIES } from "./creations";
import { formatFcfa } from "./pricing";
import { formatDate, NOT_BOOKING_NOTE } from "./requests";

/*
 * Panier multi-produits : logique pure (aucun accès au navigateur).
 *
 * Le panier ne stocke que des références (produit, déclinaison, option,
 * quantité). Les prix sont toujours recalculés depuis le catalogue
 * officiel (lib/creations.ts) : un prix enregistré dans le navigateur
 * n'est jamais pris en compte.
 *
 * Produits concernés : gâteaux gourmands, mignardises et crêpes. Le Cake
 * Design, L'Écrin gourmand, les buffets et la location de présentoirs
 * gardent leur propre parcours de demande (informations spécifiques).
 */

export type CartCategory = "gateaux" | "mignardises" | "crepes";

/** Ligne telle qu'enregistrée dans le navigateur (aucune donnée perso). */
export type CartItem = {
  id: string;
  /** Déclinaison choisie (ex. « 20 pièces »), pour les tarifs à variantes. */
  variant?: string;
  /** Option choisie (ex. « Viande »), si le produit en propose. */
  option?: string;
  /** Gâteaux, pièces ou lots, selon le mode de vente du produit. */
  qty: number;
};

/** Mode de vente déduit du tarif officiel du produit. */
export type SaleMode =
  /** Prix par gâteau (gâteaux gourmands). */
  | { kind: "item" }
  /** Prix à la pièce, avec un minimum en pièces. */
  | { kind: "piece" }
  /** Prix par lot de `size` pièces. */
  | { kind: "lot"; size: number };

export type CartProduct = {
  id: string;
  category: CartCategory;
  product: Product;
};

const slug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const productId = (p: Product) => slug(p.name);

/** Catalogue commandable via le panier, indexé par identifiant. */
export const CART_CATALOG: ReadonlyMap<string, CartProduct> = new Map(
  (
    [
      ["gateaux", PATISSERIES],
      ["mignardises", MIGNARDISES],
      ["crepes", CREPES],
    ] as const
  ).flatMap(([category, list]) =>
    list.map((product) => {
      const id = productId(product);
      return [id, { id, category, product }] as const;
    }),
  ),
);

/**
 * Entrée du catalogue correspondant à une fiche (les produits arrivent
 * copiés depuis le serveur : on les retrouve par leur nom).
 */
export const cartProduct = (product: Product) => {
  const entry = CART_CATALOG.get(productId(product));
  return entry && entry.product.name === product.name ? entry : undefined;
};

/* ---- Modes de vente et quantités ------------------------------------- */

const piecesIn = (text?: string) => {
  const m = text?.match(/(\d+)\s*pi[eè]ces?/i);
  return m ? Number(m[1]) : undefined;
};

/** Mode de vente d'un produit, pour une déclinaison donnée. */
export function saleMode(product: Product, variant?: string): SaleMode {
  const p = product.pricing;
  if (p?.kind === "variants") {
    const size = piecesIn(variant ?? p.items[0]?.label);
    return size ? { kind: "lot", size } : { kind: "item" };
  }
  if (p && (p.kind === "fixed" || p.kind === "from")) {
    const lot = p.unit?.match(/^les\s+(\d+)\s+pi[eè]ces?$/i);
    if (lot) return { kind: "lot", size: Number(lot[1]) };
    if (p.unit === "unité") return { kind: "piece" };
  }
  // Sans unité : prix par gâteau ; produit non tarifé : à la pièce s'il a
  // un minimum en pièces, sinon à l'article.
  if (!p || p.kind === "quote" || p.kind === "confirm") {
    return piecesIn(product.minQuantity) ? { kind: "piece" } : { kind: "item" };
  }
  return { kind: "item" };
}

const MAX = { item: 20, piece: 1000, lot: 100 } as const;

/** Quantité minimale et maximale, dans l'unité du mode de vente. */
export function qtyBounds(product: Product, mode: SaleMode) {
  const minPieces = piecesIn(product.minQuantity) ?? 1;
  const min =
    mode.kind === "piece"
      ? minPieces
      : mode.kind === "lot"
        ? Math.max(1, Math.ceil(minPieces / mode.size))
        : 1;
  return { min, max: Math.max(min, MAX[mode.kind]) };
}

/** Ramène une saisie à un entier valide (jamais négatif ni sous le minimum). */
export function clampQty(value: unknown, min: number, max: number) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** « 25 pièces », « 2 lots de 10 pièces (20 pièces) », « 1 gâteau ». */
export function qtyLabel(mode: SaleMode, qty: number) {
  const s = (n: number) => (n > 1 ? "s" : "");
  if (mode.kind === "piece") return `${qty} pièce${s(qty)}`;
  if (mode.kind === "lot")
    return qty === 1
      ? `1 lot de ${mode.size} pièces`
      : `${qty} lots de ${mode.size} pièces (${qty * mode.size} pièces)`;
  return `${qty} gâteau${qty > 1 ? "x" : ""}`;
}

export function unitWord(mode: SaleMode, qty: number) {
  const s = qty > 1 ? "s" : "";
  if (mode.kind === "piece") return `pièce${s}`;
  if (mode.kind === "lot") return `lot${s} de ${mode.size}`;
  return `gâteau${qty > 1 ? "x" : ""}`;
}

/** Prix officiel de l'unité vendue (pièce, lot ou gâteau), si confirmé. */
export function unitPrice(product: Product, variant?: string) {
  const p = product.pricing;
  if (!p) return null;
  if (p.kind === "fixed") return p.amount;
  if (p.kind === "variants")
    return p.items.find((i) => i.label === variant)?.amount ?? null;
  // « À partir de », devis et tarif à confirmer : pas de prix ferme.
  return null;
}

export function priceText(product: Product, variant?: string) {
  const amount = unitPrice(product, variant);
  if (amount === null) return "Tarif à confirmer";
  const mode = saleMode(product, variant);
  if (mode.kind === "piece") return `${formatFcfa(amount)} la pièce`;
  if (mode.kind === "lot")
    return `${formatFcfa(amount)} le lot de ${mode.size} pièces`;
  return `${formatFcfa(amount)} le gâteau`;
}

/* ---- Lecture et validation du panier --------------------------------- */

export const lineKey = (i: Pick<CartItem, "id" | "variant" | "option">) =>
  [i.id, i.variant ?? "", i.option ?? ""].join("|");

/** Déclinaison et option valides pour ce produit (sinon `undefined`). */
export function validChoice(
  product: Product,
  variant?: string,
  option?: string,
) {
  const p = product.pricing;
  const variants = p?.kind === "variants" ? p.items.map((i) => i.label) : [];
  const options = product.options ?? [];
  const okVariant = variants.length
    ? variant !== undefined && variants.includes(variant)
    : variant === undefined;
  const okOption = options.length
    ? option !== undefined && options.includes(option)
    : option === undefined;
  return okVariant && okOption;
}

/**
 * Relit le contenu enregistré : ignore tout ce qui est mal formé, regroupe
 * les doublons et ramène les quantités dans les bornes du produit.
 * Les produits retirés du catalogue sont conservés pour être signalés.
 */
export function parseCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, CartItem>();
  // Quantités brutes cumulées : les doublons s'additionnent avant le bornage.
  const sums = new Map<string, number>();
  for (const entry of raw.slice(0, 100)) {
    if (!entry || typeof entry !== "object") continue;
    const { id, variant, option, qty } = entry as Record<string, unknown>;
    if (typeof id !== "string" || id.length > 80) continue;
    if (variant !== undefined && typeof variant !== "string") continue;
    if (option !== undefined && typeof option !== "string") continue;
    const item: CartItem = {
      id,
      ...(variant ? { variant } : {}),
      ...(option ? { option } : {}),
      qty: 0,
    };
    const entryProduct = CART_CATALOG.get(id)?.product;
    const bounds = entryProduct
      ? qtyBounds(entryProduct, saleMode(entryProduct, item.variant))
      : { min: 1, max: 1000 };
    const key = lineKey(item);
    const n = Number(qty);
    const sum = (sums.get(key) ?? 0) + (Number.isFinite(n) && n > 0 ? n : 0);
    sums.set(key, sum);
    item.qty = clampQty(sum, bounds.min, bounds.max);
    merged.set(key, item);
  }
  return [...merged.values()];
}

export type CartLine = CartItem & {
  key: string;
  /** Absent si le produit n'existe plus dans le catalogue. */
  entry?: CartProduct;
  /** Faux si le produit, la déclinaison ou l'option n'est plus proposé. */
  available: boolean;
  mode: SaleMode;
  min: number;
  max: number;
  unitAmount: number | null;
  subtotal: number | null;
};

export type CartSummary = {
  lines: CartLine[];
  /** Lignes valides (commandables). */
  valid: CartLine[];
  /** Somme des lignes dont le tarif est confirmé (FCFA). */
  total: number;
  /** Lignes valides sans tarif ferme : le total reste provisoire. */
  unpriced: CartLine[];
  /** Lignes à retirer (produit ou déclinaison plus proposé). */
  unavailable: CartLine[];
  /** Délai de préparation le plus long, en jours. */
  leadDays: number;
  /** Le panier contient un gâteau gourmand (heure limite de 18 h). */
  hasGateau: boolean;
};

export function summarize(items: CartItem[]): CartSummary {
  const lines: CartLine[] = items.map((item) => {
    const entry = CART_CATALOG.get(item.id);
    const product = entry?.product;
    const available =
      !!product && validChoice(product, item.variant, item.option);
    const mode = product
      ? saleMode(product, item.variant)
      : ({ kind: "item" } as const);
    const { min, max } = product
      ? qtyBounds(product, mode)
      : { min: 1, max: 1 };
    const qty = clampQty(item.qty, min, max);
    const unitAmount =
      product && available ? unitPrice(product, item.variant) : null;
    return {
      ...item,
      qty,
      key: lineKey(item),
      entry,
      available,
      mode,
      min,
      max,
      unitAmount,
      subtotal: unitAmount === null ? null : unitAmount * qty,
    };
  });
  const valid = lines.filter((l) => l.available);
  return {
    lines,
    valid,
    total: valid.reduce((sum, l) => sum + (l.subtotal ?? 0), 0),
    unpriced: valid.filter((l) => l.subtotal === null),
    unavailable: lines.filter((l) => !l.available),
    leadDays: Math.max(0, ...valid.map((l) => l.entry?.product.leadDays ?? 1)),
    hasGateau: valid.some((l) => l.entry?.category === "gateaux"),
  };
}

/** « 24 h », « 48 h », « 5 jours ». */
export const leadLabel = (days: number) =>
  days <= 3 ? `${days * 24} h` : `${days} jours`;

/* ---- Message WhatsApp ------------------------------------------------- */

export type OrderDetails = {
  name: string;
  phone?: string;
  date: string;
  urgent: boolean;
  mode: "livraison" | "retrait";
  place?: string;
  details?: string;
};

const lineName = (l: CartLine) =>
  [l.entry?.product.name ?? l.id, l.variant].filter(Boolean).join(", ");

/** Récapitulatif complet de la commande, en un seul message. */
export function buildOrderMessage(summary: CartSummary, d: OrderDetails) {
  const out: string[] = [
    "Bonjour La Marilyn,",
    "",
    "Je souhaite passer la commande suivante :",
    "",
  ];
  summary.valid.forEach((l, i) => {
    const product = l.entry!.product;
    out.push(`ARTICLE ${i + 1}`, `Produit : ${lineName(l)}`);
    if (l.option) out.push(`Option : ${l.option}`);
    out.push(
      `Quantité : ${qtyLabel(l.mode, l.qty)}`,
      `Tarif : ${l.unitAmount === null ? "à confirmer (sur devis)" : priceText(product, l.variant)}`,
      `Sous-total : ${l.subtotal === null ? "à confirmer" : formatFcfa(l.subtotal)}`,
      "",
    );
  });
  out.push(
    summary.unpriced.length
      ? `SOUS-TOTAL PROVISOIRE DES PRODUITS TARIFÉS : ${formatFcfa(summary.total)}`
      : `TOTAL DES PRODUITS TARIFÉS : ${formatFcfa(summary.total)}`,
  );
  if (summary.unpriced.length) {
    out.push(
      `Produits sur devis : ${summary.unpriced.map(lineName).join(", ")}`,
    );
  }
  out.push(
    "Montant indicatif, hors frais de livraison (à la charge du client).",
    "",
    "INFORMATIONS CLIENT",
    `Nom : ${d.name.trim()}`,
  );
  if (d.phone?.trim()) out.push(`Téléphone : ${d.phone.trim()}`);
  out.push(`Date souhaitée : ${formatDate(d.date)}`);
  if (d.urgent) out.push("Demande urgente : oui");
  out.push(
    d.mode === "retrait"
      ? "Mode de récupération : retrait sur place (sous réserve d’accord)"
      : `Mode de récupération : livraison${d.place?.trim() ? `, ${d.place.trim()}` : ""}`,
  );
  if (d.details?.trim())
    out.push(`Informations complémentaires : ${d.details.trim()}`);
  out.push(
    "",
    NOT_BOOKING_NOTE,
    "",
    "Merci de me confirmer la disponibilité et le montant définitif de ma commande.",
  );
  return out.join("\n");
}

/** Rappel des frais de livraison (conditions validées). */
export const DELIVERY_NOTE = DELIVERY.final;
