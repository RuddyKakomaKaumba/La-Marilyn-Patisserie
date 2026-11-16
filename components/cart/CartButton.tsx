"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { BagIcon } from "../icons";
import { useDodge } from "../useDodge";
import { useCart } from "./CartProvider";

const label = (count: number) =>
  count
    ? `Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`
    : "Ouvrir le panier, vide";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span
      key={count}
      aria-hidden="true"
      className="cart-badge absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 font-sans text-[0.6875rem] font-semibold leading-none text-ink"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Icône panier de l'en-tête, avec le nombre d'articles. */
export default function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={label(count)}
      data-cart-button
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-ivory/90 transition-colors duration-300 hover:bg-gold/10 hover:text-gold-light"
    >
      <BagIcon className="h-[22px] w-[22px]" />
      <Badge count={count} />
    </button>
  );
}

/**
 * Accès au panier en bas de l'écran (au-dessus du bouton WhatsApp), dès
 * qu'il contient un article : l'en-tête n'est pas fixe.
 */
export function CartFloat() {
  const { count, open, isOpen } = useCart();
  const pathname = usePathname();
  const ref = useRef<HTMLButtonElement>(null);
  const dodge = useDodge(ref);
  if (!count || pathname === "/commande") return null;
  return (
    <div
      data-wa-float
      className={`transition-opacity duration-200 ${
        dodge || isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <button
        ref={ref}
        type="button"
        onClick={open}
        aria-label={label(count)}
        className="cart-float fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-ivory text-ink shadow-[0_6px_20px_rgb(18_12_9/0.2)] transition-colors duration-300 hover:border-gold-deep hover:bg-cream sm:right-6 md:bottom-[calc(5rem+env(safe-area-inset-bottom))] md:h-[3.25rem] md:w-[3.25rem] lg:bottom-[6.25rem] lg:right-8"
      >
        <BagIcon className="h-[22px] w-[22px]" />
        <Badge count={count} />
      </button>
    </div>
  );
}
