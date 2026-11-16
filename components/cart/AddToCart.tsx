"use client";

import { useEffect, useRef, useState } from "react";
import {
  qtyBounds,
  qtyLabel,
  saleMode,
  unitPrice,
  unitWord,
  type CartProduct,
} from "@/lib/cart";
import { formatFcfa } from "@/lib/pricing";
import { btnGold, btnOutlineDark } from "../buttons";
import { BagIcon, CheckIcon } from "../icons";
import { useCart } from "./CartProvider";
import QtyStepper from "./QtyStepper";

const chip =
  "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 text-[0.8125rem] text-ink transition-colors has-[:checked]:border-gold-deep has-[:checked]:bg-gold/15 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-gold";

/**
 * Ajout au panier depuis une fiche produit : déclinaison, option et
 * quantité (minimum et lots respectés), puis confirmation discrète sans
 * quitter la page.
 */
export default function AddToCart({
  entry,
  onContinue,
  autoFocus,
}: {
  entry: CartProduct;
  /** Ferme la fiche produit (pour continuer ses achats ou voir le panier). */
  onContinue?: () => void;
  /** Fait défiler la fiche jusqu'au choix et y place le focus. */
  autoFocus?: boolean;
}) {
  const { add, open } = useCart();
  const { product } = entry;
  const variants =
    product.pricing?.kind === "variants" ? product.pricing.items : [];
  const options = product.options ?? [];

  const [variant, setVariant] = useState(variants[0]?.label);
  const [option, setOption] = useState(options[0]);
  const mode = saleMode(product, variant);
  const { min, max } = qtyBounds(product, mode);
  const [qty, setQty] = useState(min);
  const [added, setAdded] = useState<string | null>(null);

  const amount = unitPrice(product, variant);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    // Après l'ouverture de la fenêtre (qui remet son défilement à zéro).
    const t = window.setTimeout(() => {
      const section = ref.current;
      if (!section) return;
      section.scrollIntoView({ block: "start", behavior: "smooth" });
      section
        .querySelector<HTMLInputElement>("input:checked, input, button")
        ?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(t);
  }, [autoFocus]);
  const uid = `atc-${entry.id}`;

  const changeVariant = (label: string) => {
    setVariant(label);
    const next = qtyBounds(product, saleMode(product, label));
    setQty((q) => Math.min(next.max, Math.max(next.min, q)));
    setAdded(null);
  };

  const onAdd = () => {
    add({
      id: entry.id,
      ...(variant ? { variant } : {}),
      ...(option ? { option } : {}),
      qty,
    });
    setAdded([qtyLabel(mode, qty), variant, option].filter(Boolean).join(", "));
  };

  return (
    <section
      ref={ref}
      aria-labelledby={`${uid}-title`}
      className="mt-6 rounded-[14px] border border-sand bg-cream p-4 md:p-5"
    >
      <h3
        id={`${uid}-title`}
        className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
      >
        Ajouter à ma commande
      </h3>

      {variants.length > 1 && (
        <fieldset className="mt-3">
          <legend className="text-[0.8125rem] text-muted">Format</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {variants.map((v) => (
              <label key={v.label} className={chip}>
                <input
                  type="radio"
                  name={`${uid}-variant`}
                  value={v.label}
                  checked={variant === v.label}
                  onChange={() => changeVariant(v.label)}
                  className="sr-only"
                />
                {v.label}
                <span className="text-muted">· {formatFcfa(v.amount)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {options.length > 1 && (
        <fieldset className="mt-3">
          <legend className="text-[0.8125rem] text-muted">Au choix</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {options.map((o) => (
              <label key={o} className={chip}>
                <input
                  type="radio"
                  name={`${uid}-option`}
                  value={o}
                  checked={option === o}
                  onChange={() => {
                    setOption(o);
                    setAdded(null);
                  }}
                  className="sr-only"
                />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-[0.8125rem] text-muted">
            {mode.kind === "lot"
              ? `Nombre de lots de ${mode.size} pièces`
              : mode.kind === "piece"
                ? "Nombre de pièces"
                : "Nombre de gâteaux"}
          </p>
          <div className="mt-1.5">
            <QtyStepper
              value={qty}
              min={min}
              max={max}
              onChange={(q) => {
                setQty(q);
                setAdded(null);
              }}
              label={`Quantité de ${product.name}`}
              unit={unitWord(mode, qty)}
            />
          </div>
          {min > 1 && (
            <p className="mt-1 text-[0.75rem] text-muted">
              Minimum : {qtyLabel(mode, min)}
            </p>
          )}
        </div>
        <p className="flex w-full items-baseline justify-between gap-3 border-t border-sand pt-2.5">
          <span className="text-[0.8125rem] text-muted">Sous-total</span>
          <span className="font-sans text-[1.125rem] font-semibold tabular-nums text-ink">
            {amount === null ? "Tarif à confirmer" : formatFcfa(amount * qty)}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className={`${btnGold} mt-4 w-full`}
      >
        <BagIcon className="h-[18px] w-[18px]" />
        Ajouter au panier
      </button>

      <div aria-live="polite">
        {added && (
          <div className="cart-added mt-3 rounded-[10px] bg-ivory px-3.5 py-3">
            <p className="flex items-start gap-2 text-[0.875rem] text-ink">
              <CheckIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-deep" />
              <span>
                <strong className="font-semibold">Ajouté au panier</strong>
                <span className="block text-[0.8125rem] text-muted">
                  {product.name} : {added}
                </span>
              </span>
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  onContinue?.();
                  // Laisse la fiche se fermer avant d'ouvrir le panier.
                  window.setTimeout(open, 60);
                }}
                className={`${btnOutlineDark} !h-10 sm:flex-1`}
              >
                Consulter mon panier
              </button>
              <button
                type="button"
                onClick={() => onContinue?.()}
                className={`${btnOutlineDark} !h-10 border-transparent sm:flex-1`}
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
