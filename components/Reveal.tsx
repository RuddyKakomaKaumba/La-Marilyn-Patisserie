"use client";

import { useEffect } from "react";

/**
 * Active les apparitions au scroll sans mesurer la position de chaque élément.
 * Sans JavaScript ou avec les animations réduites, le contenu reste visible.
 */
export default function Reveal() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
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

    // IntersectionObserver signale aussi les éléments visibles dès le premier
    // calcul du navigateur, sans lecture synchrone de leur géométrie.
    elements.forEach((element) => observer.observe(element));
    root.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
