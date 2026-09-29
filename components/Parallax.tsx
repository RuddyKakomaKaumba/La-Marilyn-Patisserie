"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Déplacement total (px) sur toute la traversée de l'écran. */
  amplitude?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Profondeur très légère pour les grandes photographies : l'image défile un
 * peu plus lentement que la page. Desktop uniquement (≥ 1024 px, souris),
 * inactif hors écran et désactivé si l'utilisateur réduit les animations.
 * Le calque déborde de amplitude/2 en haut et en bas : aucun bord visible.
 */
export default function Parallax({
  amplitude = 32,
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const query = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const host = el.parentElement;
      if (!host || !query.matches) {
        el.style.transform = "";
        return;
      }
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand la section entre par le bas, 1 quand elle sort par le haut.
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const y = (0.5 - progress) * amplitude;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el.parentElement ?? el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    query.addEventListener("change", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      query.removeEventListener("change", update);
    };
  }, [amplitude]);

  return (
    <div
      ref={ref}
      className={`absolute inset-x-0 will-change-transform ${className}`}
      style={{ top: -amplitude / 2, bottom: -amplitude / 2 }}
    >
      {children}
    </div>
  );
}
