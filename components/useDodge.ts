"use client";

import { useEffect, useState } from "react";

const INTERACTIVE =
  "a,button,input,select,textarea,label,summary,[role=button],[tabindex]";

/**
 * Bouton flottant : vrai lorsqu'il recouvre un bouton ou un lien de la page,
 * ou pendant la saisie sur mobile (clavier virtuel), pour qu'il s'efface et
 * ne masque jamais une action. Les boutons flottants entre eux
 * ([data-wa-float]) ne comptent pas.
 */
export function useDodge(ref: React.RefObject<HTMLElement | null>) {
  const [dodge, setDodge] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const btn = ref.current;
      if (!btn) return;
      const active = document.activeElement;
      const typing =
        window.innerWidth < 768 &&
        !!active?.matches?.(
          "input:not([type=checkbox]):not([type=radio]),textarea,select",
        );
      let covers = false;
      if (!typing) {
        const r = btn.getBoundingClientRect();
        const inset = 4;
        const points: [number, number][] = [
          [r.left + r.width / 2, r.top + r.height / 2],
          [r.left + inset, r.top + inset],
          [r.right - inset, r.top + inset],
          [r.left + inset, r.bottom - inset],
          [r.right - inset, r.bottom - inset],
        ];
        covers = points.some(([x, y]) =>
          document
            .elementsFromPoint(x, y)
            .some(
              (el) =>
                !btn.contains(el) &&
                !el.closest("[data-wa-float]") &&
                !!el.closest(INTERACTIVE),
            ),
        );
      }
      setDodge(typing || covers);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const events = ["scroll", "resize", "focusin", "focusout"] as const;
    events.forEach((e) =>
      window.addEventListener(e, schedule, { passive: true }),
    );
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      events.forEach((e) => window.removeEventListener(e, schedule));
    };
  }, [ref]);

  return dodge;
}
