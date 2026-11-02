import Link from "next/link";

/**
 * Édition Fêtes 2026 : composant autonome, supprimable sans affecter le design.
 * Aucun produit ou disponibilité saisonnière n'est annoncé sans validation.
 */
export default function HolidayEdition() {
  return (
    <section aria-labelledby="holiday-heading" className="relative overflow-hidden border-y border-[#bda375]/35 bg-[#18352e] px-5 py-12 text-[#fbf5e9] sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#d7b982]/20 sm:h-80 sm:w-80" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-12 h-52 w-52 rounded-full border border-[#d7b982]/20" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8cc97]">Édition de saison · Noël & Nouvel An</p>
          <h2 id="holiday-heading" className="display text-4xl leading-tight sm:text-5xl">Les fêtes ont une saveur particulière.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#f5ead8] sm:text-base">Gâteaux sur mesure, mignardises et attentions gourmandes à imaginer pour vos moments de fête.</p>
        </div>
        <Link href="/nos-creations" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[#e3c692] bg-[#f6efe5] px-6 py-3 text-sm font-semibold text-[#173129] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3c692]">
          Découvrir nos créations <span aria-hidden="true" className="ml-3">→</span>
        </Link>
      </div>
    </section>
  );
}
