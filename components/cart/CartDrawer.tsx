"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { priceText, unitWord, type CartLine } from "@/lib/cart";
import { formatFcfa } from "@/lib/pricing";
import { btnArrow, btnGold, btnOutlineDark } from "../buttons";
import { ArrowRight, BagIcon } from "../icons";
import Sheet, { SheetClose } from "../ui/Sheet";
import { useCart } from "./CartProvider";
import QtyStepper from "./QtyStepper";

const TITLE_ID = "panier-titre";

/** Panier : liste des articles, quantités, total et accès à la commande. */
export default function CartDrawer() {
  const { summary, isOpen, close, clear, setQty, remove } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const empty = summary.lines.length === 0;

  const onClose = () => {
    setConfirmClear(false);
    close();
  };

  return (
    <Sheet open={isOpen} onClose={onClose} labelledBy={TITLE_ID}>
      <SheetClose onClose={onClose} />
      <div className="px-5 pb-6 pt-6 md:px-7 md:pb-8 md:pt-7">
        <p className="eyebrow text-gold-deep">La Marilyn</p>
        <h2
          id={TITLE_ID}
          className="display mt-2 text-[1.75rem] text-ink md:text-[2.125rem]"
        >
          Votre panier
        </h2>

        {empty ? (
          <div className="mt-8 flex flex-col items-center rounded-[14px] border border-sand bg-cream px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
              <BagIcon className="h-7 w-7" />
            </span>
            <p className="display mt-4 text-[1.375rem] text-ink">
              Votre panier est vide
            </p>
            <p className="mt-2 max-w-[22rem] text-[0.9375rem] leading-relaxed text-muted">
              Gâteaux gourmands, mignardises et crêpes : composez votre
              commande, puis envoyez-la en un seul message sur WhatsApp.
            </p>
            <Link
              href="/nos-creations"
              onClick={onClose}
              className={`${btnGold} mt-6`}
            >
              Découvrir nos créations
              <ArrowRight className={btnArrow} />
            </Link>
          </div>
        ) : (
          <>
            {summary.unavailable.length > 0 && (
              <p
                role="status"
                className="mt-4 rounded-[8px] bg-[#fff3cd] px-3.5 py-2.5 text-[0.8125rem] text-[#5c4300]"
              >
                Certains articles ne sont plus proposés : retirez-les pour
                finaliser votre commande.
              </p>
            )}
            <ul className="mt-5 divide-y divide-sand border-y border-sand">
              {summary.lines.map((line) => (
                <CartRow
                  key={line.key}
                  line={line}
                  onQty={(q) => setQty(line.key, q)}
                  onRemove={() => remove(line.key)}
                />
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between gap-4">
              <p className="font-sans text-[0.9375rem] font-semibold text-ink">
                {summary.unpriced.length
                  ? "Sous-total provisoire"
                  : "Total des produits"}
              </p>
              <p className="font-sans text-[1.25rem] font-semibold tabular-nums text-ink">
                {formatFcfa(summary.total)}
              </p>
            </div>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-muted">
              {summary.unpriced.length
                ? "Certains tarifs restent à confirmer par La Marilyn. "
                : ""}
              Montant indicatif, hors frais de livraison (à la charge du
              client).
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
              {summary.valid.length > 0 && summary.unavailable.length === 0 ? (
                <Link
                  href="/commande"
                  onClick={onClose}
                  className={`${btnGold} sm:flex-1`}
                >
                  Finaliser ma commande
                  <ArrowRight className={btnArrow} />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={`${btnGold} pointer-events-none opacity-50 sm:flex-1`}
                >
                  Finaliser ma commande
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`${btnOutlineDark} sm:flex-1`}
              >
                Continuer mes achats
              </button>
            </div>

            <div className="mt-5 text-center">
              {confirmClear ? (
                <div
                  role="alertdialog"
                  aria-label="Vider le panier"
                  className="rounded-[10px] border border-sand bg-cream px-4 py-3 text-[0.8125rem] text-ink"
                >
                  <p>Retirer tous les articles du panier ?</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      autoFocus
                      onClick={() => setConfirmClear(false)}
                      className="h-9 rounded-full border border-sand px-4 hover:bg-sand"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clear();
                        setConfirmClear(false);
                      }}
                      className="h-9 rounded-full bg-ink px-4 text-ivory hover:bg-cocoa"
                    >
                      Oui, vider
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-[0.8125rem] text-muted underline decoration-sand underline-offset-4 hover:text-ink"
                >
                  Vider le panier
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

function CartRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const product = line.entry?.product;
  const name = product?.name ?? "Produit retiré";
  const choice = [line.variant, line.option].filter(Boolean).join(" · ");

  return (
    <li className="flex gap-3.5 py-4">
      <div
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] md:h-[4.5rem] md:w-[4.5rem]"
        style={{ backgroundColor: product?.tone ?? "#eadfcf" }}
      >
        {product?.image && (
          <Image
            src={product.image.src}
            alt=""
            fill
            sizes="72px"
            className="object-cover"
            style={{ objectPosition: product.image.position ?? "50% 50%" }}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-sans text-[0.9375rem] font-semibold leading-snug text-ink">
              {name}
            </p>
            {choice && <p className="text-[0.8125rem] text-muted">{choice}</p>}
            <p className="mt-0.5 text-[0.8125rem] text-gold-deep">
              {line.available && product
                ? priceText(product, line.variant)
                : "Ce produit n’est plus proposé"}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Retirer ${name} du panier`}
            className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            >
              <path d="M4 6h12M8 6V4.5h4V6M6 6l.7 9.5a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9L14 6" />
            </svg>
          </button>
        </div>
        {line.available && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <QtyStepper
              size="sm"
              value={line.qty}
              min={line.min}
              max={line.max}
              onChange={onQty}
              label={`Quantité de ${name}`}
              unit={unitWord(line.mode, line.qty)}
            />
            <p className="font-sans text-[0.9375rem] font-semibold tabular-nums text-ink">
              {line.subtotal === null
                ? "Tarif à confirmer"
                : formatFcfa(line.subtotal)}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}
