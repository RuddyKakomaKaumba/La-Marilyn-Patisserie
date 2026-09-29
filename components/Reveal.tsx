"use client";

import { useEffect } from "react";

/**
 * Active les apparitions discrètes des éléments marqués `data-reveal`.
 * Sans JavaScript, le contenu reste simplement visible.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    // Les éléments déjà à l'écran restent visibles sans animation.
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
    root.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, []);

  return null;
}
