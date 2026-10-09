"use client";

import { useEffect, useId, useRef, useState } from "react";
import { priceSummary } from "@/lib/pricing";
import type { Product } from "../InfiniteProductCarousel";
import { ArrowRight } from "../icons";
import Sheet, { SheetClose } from "../ui/Sheet";
import ProductDetails from "./ProductDetails";

/**
 * « Voir tout » : liste complète de la rangée (nom, tarif, description),
 * chaque ligne ouvrant la fiche détaillée dans la même fenêtre.
 */
export default function SeeAll({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const titleId = useId();

  // Passage liste ↔ fiche : retour en haut et focus sur le nouveau titre.
  const switched = useRef(false);
  useEffect(() => {
    if (!switched.current) return;
    switched.current = false;
    const heading = document.getElementById(titleId);
    const dialog = heading?.closest("dialog");
    if (dialog) dialog.scrollTop = 0;
    heading?.focus({ preventScroll: true });
  }, [selected, titleId]);
  const show = (p: Product | null) => {
    switched.current = true;
    setSelected(p);
  };
  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group inline-flex shrink-0 items-center gap-1.5 py-2 text-[0.75rem] text-gold-deep transition-colors duration-300 hover:text-ink md:text-[0.8125rem]"
      >
        Voir tout
        <span className="sr-only"> — {title}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
      </button>

      <Sheet open={open} onClose={close} labelledBy={titleId}>
        <SheetClose onClose={close} />
        {selected ? (
          <div>
            <ProductDetails
              product={selected}
              titleId={titleId}
              onNavigate={close}
            />
            <div className="px-5 pb-6 md:px-7">
              <button
                type="button"
                onClick={() => show(null)}
                className="inline-flex items-center gap-1.5 py-2 text-[0.8125rem] text-gold-deep hover:text-ink"
              >
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                Retour à la liste
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-6 pt-6 md:px-7 md:pb-8 md:pt-7">
            <h2
              id={titleId}
              tabIndex={-1}
              className="display pr-12 outline-none text-[1.75rem] text-ink md:text-[2.125rem]"
            >
              {title}
            </h2>
            <ul className="mt-4 divide-y divide-sand border-y border-sand">
              {products.map((p) => {
                const price = priceSummary(p.pricing);
                return (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => show(p)}
                      className="group flex w-full items-start justify-between gap-4 py-3.5 text-left"
                    >
                      <span>
                        <span className="block font-sans text-[0.9375rem] font-semibold text-ink">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-muted">
                          {p.description}
                        </span>
                        {price && (
                          <span className="mt-1 block text-[0.8125rem] font-semibold text-gold-deep">
                            {price}
                          </span>
                        )}
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gold-deep transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Sheet>
    </>
  );
}
