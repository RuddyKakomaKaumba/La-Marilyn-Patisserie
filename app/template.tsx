"use client";

import { useEffect } from "react";

/** Passe à true après le premier affichage : seules les navigations internes s'animent. */
let hasNavigated = false;

/**
 * Remonté à chaque changement de page : fondu très court (280 ms) de la
 * nouvelle page, sans jamais retarder la navigation. Pas d'animation au
 * premier chargement, qui a déjà sa propre séquence d'arrivée.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
