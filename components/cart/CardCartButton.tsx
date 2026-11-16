"use client";

import { useEffect, useRef, useState } from "react";
import { cartProduct, qtyBounds, saleMode } from "@/lib/cart";
import type { Product } from "../InfiniteProductCarousel";
import { ArrowRight, BagIcon, CheckIcon } from "../icons";
import { useCart } from "./CartProvider";

/** Durée d'affichage de « Ajouté au panier ✓ » sur la carte (ms). */
const CONFIRM_MS = 2200;

const base =
  "relative z-[1] inline-flex w-full items-center justify-center gap-1.5 rounded-full font-sans font-semibold transition-[color,background-color,border-color,transform] duration-300 ease-soft active:scale-[0.98] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold";

/**
 * Bouton d'action d'une carte produit.
 * - Produit commandable : « Ajouter au panier » ajoute directement la
 *   quantité minimale (conditionnement respecté), sans quitter la page ni
 *   ouvrir WhatsApp. Si un format ou une option doit être choisi, la fiche
 *   s'ouvre sur sa configuration.
 * - Prestation sur devis : ouvre la fiche, qui garde son parcours de demande.
 */
export default function CardCartButton({
  product,
  compact,
  tabIndex,
  onConfigure,
  onOpen,
}: {
  product: Product;
  compact: boolean;
  tabIndex?: number;
  /** Ouvre la fiche sur le choix du format / de l'option. */
  onConfigure: () => void;
  /** Ouvre la fiche (prestations hors panier). */
  onOpen: () => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const size = compact
    ? "h-9 px-2 text-[0.75rem] md:h-10 md:text-[0.8125rem]"
    : "h-10 px-3 text-[0.8125rem] md:h-11 md:text-[0.875rem]";
  const entry = cartProduct(product);

  if (!entry) {
    return (
      <button
        type="button"
        onClick={onOpen}
        tabIndex={tabIndex}
        draggable={false}
        aria-haspopup="dialog"
        className={`${base} ${size} group/cta border border-gold/70 text-ink hover:border-gold-deep hover:bg-gold/10`}
      >
        Voir le détail
        <span className="sr-only"> : {product.name}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-soft group-hover/cta:translate-x-0.5" />
      </button>
    );
  }

  const variants =
    product.pricing?.kind === "variants" ? product.pricing.items : [];
  const needsChoice = variants.length > 1 || (product.options?.length ?? 0) > 1;

  const onClick = () => {
    if (needsChoice) {
      onConfigure();
      return;
    }
    const variant = variants[0]?.label;
    const option = product.options?.[0];
    const { min } = qtyBounds(entry.product, saleMode(entry.product, variant));
    add({
      id: entry.id,
      ...(variant ? { variant } : {}),
      ...(option ? { option } : {}),
      qty: min,
    });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), CONFIRM_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        draggable={false}
        aria-haspopup={needsChoice ? "dialog" : undefined}
        aria-label={
          added
            ? `${product.name} ajouté au panier`
            : `Ajouter ${product.name} au panier`
        }
        data-card-cart
        className={`${base} ${size} ${
          added
            ? "bg-ink text-gold-light"
            : "bg-gold text-ink shadow-[0_4px_12px_-6px_rgb(134_100_47/0.6)] hover:bg-gold-light"
        }`}
      >
        {added ? (
          <>
            Ajouté au panier
            <CheckIcon className="h-4 w-4 shrink-0" />
          </>
        ) : (
          <>
            <BagIcon className="h-4 w-4 shrink-0" />
            Ajouter au panier
          </>
        )}
      </button>
      {tabIndex === undefined && (
        <span role="status" className="sr-only">
          {added ? `${product.name} ajouté au panier.` : ""}
        </span>
      )}
    </>
  );
}
