"use client";

import { useEffect, useState } from "react";

type Item = { label: string; value: string };

const DAY = 86_400_000;

/** Jours restants (heure de Douala, UTC+1) avant une date du calendrier. */
function daysUntil(month: number, day: number, year: number, now: Date) {
  const douala = new Date(now.getTime() + 60 * 60_000);
  const today = Date.UTC(
    douala.getUTCFullYear(),
    douala.getUTCMonth(),
    douala.getUTCDate(),
  );
  return Math.round((Date.UTC(year, month, day) - today) / DAY);
}

function compute(now: Date): Item[] {
  const noel = daysUntil(11, 25, 2026, now);
  const nouvelAn = daysUntil(0, 1, 2027, now);
  const items: Item[] = [];
  if (noel > 0) items.push({ label: "avant Noël", value: plural(noel) });
  else if (noel === 0) items.push({ label: "", value: "Joyeux Noël !" });
  if (nouvelAn > 0)
    items.push({ label: "avant le Nouvel An", value: plural(nouvelAn) });
  else if (nouvelAn > -7)
    items.push({ label: "", value: "Bonne année 2027 !" });
  return items;
}

const plural = (n: number) => `${n} jour${n > 1 ? "s" : ""}`;

/**
 * Compte à rebours festif (Noël, Nouvel An). Calculé côté navigateur
 * après le premier rendu : aucun écart d'hydratation.
 */
export default function Countdown() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const update = () => setItems(compute(new Date()));
    update();
    const id = window.setInterval(update, 60 * 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!items?.length) return <div className="season-countdown" />;
  return (
    <ul className="season-countdown" aria-label="Compte à rebours des fêtes">
      {items.map((it) => (
        <li key={it.value + it.label} className="season-countdown__item">
          <span className="season-countdown__value">{it.value}</span>
          {it.label && (
            <span className="season-countdown__label">{it.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
