"use client";

import { useEffect, useState } from "react";
import { clampQty } from "@/lib/cart";
import { MinusIcon, PlusIcon } from "../icons";

/**
 * Sélecteur de quantité (− champ +), borné par le minimum et le maximum du
 * produit. La saisie libre est ramenée dans les bornes à la sortie du champ.
 */
export default function QtyStepper({
  value,
  min,
  max,
  onChange,
  label,
  unit,
  size = "md",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (qty: number) => void;
  /** Nom accessible, ex. « Quantité de Nems ». */
  label: string;
  /** Unité affichée à côté, ex. « pièces ». */
  unit?: string;
  size?: "sm" | "md";
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (raw: string) => {
    const next = clampQty(raw === "" ? value : raw, min, max);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const btn = `flex shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-sand disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent ${
    size === "sm" ? "h-9 w-9" : "h-11 w-11"
  }`;

  return (
    <div className="flex items-center gap-2">
      <div
        role="group"
        aria-label={label}
        className="inline-flex items-center rounded-full border border-sand bg-white p-0.5"
      >
        <button
          type="button"
          className={btn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Diminuer la quantité"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={label}
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(e.currentTarget.value);
            }
          }}
          className={`bg-transparent text-center font-sans font-semibold tabular-nums text-ink focus:outline-none focus-visible:rounded-[6px] focus-visible:outline-[1.5px] focus-visible:outline-gold ${
            size === "sm"
              ? "h-9 w-10 text-[0.9375rem]"
              : "h-11 w-12 text-[1rem]"
          }`}
        />
        <button
          type="button"
          className={btn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Augmenter la quantité"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      {unit && <span className="text-[0.8125rem] text-muted">{unit}</span>}
    </div>
  );
}
