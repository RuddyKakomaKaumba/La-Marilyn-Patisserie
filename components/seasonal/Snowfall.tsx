"use client";

import { useEffect, useRef } from "react";

/** Préférence du visiteur (bouton « Neige » du bandeau). */
export const SNOW_KEY = "lm-neige";
export const SNOW_EVENT = "lm-neige-change";

type Flake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  a: number;
};

/**
 * Neige qui tombe en fond (thème des fêtes) : un seul canvas fixe,
 * transparent aux clics. Densité adaptée à l'écran, rendu limité à
 * 1,5× la densité de pixels, pause quand l'onglet est masqué.
 * Jamais lancée si prefers-reduced-motion est actif ou si le visiteur a
 * coupé la neige.
 */
export default function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let flakes: Flake[] = [];
    let raf = 0;
    let last = 0;
    let w = 0;
    let h = 0;

    const make = (y?: number): Flake => {
      const r = 0.7 + Math.random() ** 2 * 2.6;
      return {
        x: Math.random() * w,
        y: y ?? Math.random() * h,
        r,
        vy: 0.35 + r * 0.32 + Math.random() * 0.25,
        sway: 0.25 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.5,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const sameWidth = w === window.innerWidth;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#ffffff";
      // Barre d'adresse mobile qui se replie : on garde les flocons.
      if (sameWidth && flakes.length) return;
      const count = Math.round(Math.min(110, Math.max(28, (w * h) / 14000)));
      flakes = Array.from({ length: count }, () => make());
    };

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.7, 3) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.x += Math.sin(f.phase + t * 0.0007) * f.sway * 0.5 * dt;
        if (f.y - f.r > h) Object.assign(f, make(-6));
        if (f.x < -6) f.x = w + 6;
        else if (f.x > w + 6) f.x = -6;
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      ctx.fillStyle = "#ffffff";
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, w, h);
    };

    const enabled = () => {
      let pref: string | null = null;
      try {
        pref = localStorage.getItem(SNOW_KEY);
      } catch {}
      return pref !== "off" && !reduce.matches && !document.hidden;
    };
    const sync = () => (enabled() ? start() : stop());

    resize();
    sync();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener(SNOW_EVENT, sync);
    reduce.addEventListener("change", sync);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener(SNOW_EVENT, sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="season-snow" />;
}
