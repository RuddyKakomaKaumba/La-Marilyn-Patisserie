"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Id du titre qui nomme la fenêtre (aria-labelledby). */
  labelledBy: string;
  children: React.ReactNode;
};

/**
 * Fenêtre modale légère, basée sur <dialog> (focus piégé, Échap, retour du
 * focus natifs). Feuille ancrée en bas sur mobile, fenêtre centrée dès md.
 * Un clic sur le fond la ferme.
 */
export default function Sheet({ open, onClose, labelledBy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Pas de défilement de la page derrière la fenêtre.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onNativeClose = () => onCloseRef.current();
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="sheet m-0 mt-auto max-h-[90svh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[16px] bg-ivory p-0 text-cocoa backdrop:bg-ink/60 md:m-auto md:max-h-[85vh] md:w-[min(36rem,calc(100vw-4rem))] md:rounded-[14px]"
    >
      {open && children}
    </dialog>
  );
}

/** Bouton de fermeture, placé en haut à droite du contenu. */
export function SheetClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fermer"
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink transition-colors duration-300 hover:bg-sand md:right-4 md:top-4"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
        className="h-4 w-4"
      >
        <path d="m5 5 10 10M15 5 5 15" />
      </svg>
    </button>
  );
}
