import Link from "next/link";
import { FESTIVE } from "@/lib/seasonal";
import { ArrowRight } from "./icons";

/**
 * Édition Fêtes 2026 : composant autonome, supprimable sans affecter le design.
 * Rendu uniquement quand le thème des fêtes est actif (lib/seasonal.ts).
 * Aucun produit ou disponibilité saisonnière n'est annoncé sans validation.
 */
export default function HolidayEdition() {
  if (!FESTIVE) return null;
  return (
    <section aria-labelledby="holiday-heading" className="holiday-edition">
      <div aria-hidden="true" className="holiday-edition__ornament" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="max-w-2xl">
          <p className="eyebrow text-[#ead7ae]">
            <span aria-hidden="true">✦ </span>
            Édition de saison · Noël &amp; Nouvel An
          </p>
          <h2
            id="holiday-heading"
            className="display mt-4 text-[2.25rem] text-[#fbf5e9] sm:text-[3rem] lg:text-[3.5rem]"
          >
            Les fêtes ont une
            <br />
            <em className="font-[330] italic">saveur particulière.</em>
          </h2>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-[#f5ead8]/85 sm:text-base">
            Gâteaux sur mesure, mignardises et attentions gourmandes à imaginer
            pour vos moments de fête.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
          <Link href="/nos-creations" className="holiday-edition__btn">
            Découvrir nos créations
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/nos-creations#ecrin"
            className="holiday-edition__btn holiday-edition__btn--ghost"
          >
            Composer un Écrin gourmand
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
