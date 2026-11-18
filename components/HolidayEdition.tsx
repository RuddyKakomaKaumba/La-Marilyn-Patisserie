import Link from "next/link";
import { FESTIVE } from "@/lib/seasonal";
import { ArrowRight } from "./icons";
import Countdown from "./seasonal/Countdown";

/**
 * Édition Fêtes 2026 : composant autonome, supprimable sans affecter le design.
 * Rendu uniquement quand le thème des fêtes est actif (lib/seasonal.ts).
 * Aucun produit ou disponibilité saisonnière n'est annoncé sans validation.
 */
export default function HolidayEdition() {
  if (!FESTIVE) return null;
  return (
    <section aria-labelledby="holiday-heading" className="holiday-edition">
      <div aria-hidden="true" className="holiday-edition__bokeh" />
      <div aria-hidden="true" className="holiday-edition__ornament" />
      <div aria-hidden="true" className="holiday-edition__baubles">
        <Bauble color="red" length={70} delay={0} />
        <Bauble color="gold" length={120} delay={0.7} />
        <Bauble color="green" length={46} delay={1.4} />
      </div>

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow text-[#ead7ae]">
            <span aria-hidden="true">✦ </span>
            Édition de saison · Noël &amp; Nouvel An
          </p>
          <h2
            id="holiday-heading"
            data-reveal
            className="display mt-4 text-[2.5rem] text-[#fbf5e9] sm:text-[3.25rem] lg:text-[4rem]"
          >
            <span className="season-hat">Préparons</span> vos fêtes <br />{" "}
            <em className="season-shine font-[330] italic">ensemble.</em>
          </h2>
          <p
            data-reveal
            className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-[#f5ead8]/85 sm:text-base"
          >
            Pour Noël et le Nouvel An, La Marilyn vous accompagne pour vos
            tables de fête et vos cadeaux gourmands&nbsp;: gâteaux sur mesure,
            mignardises, crêpes ou Écrin gourmand.
          </p>
          <div data-reveal className="mt-6">
            <Countdown />
          </div>
        </div>
        <div
          data-reveal
          className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:flex-col lg:flex-row"
        >
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

const BAUBLE = {
  red: ["#d23a44", "#7a1724"],
  gold: ["#f3dfae", "#a87a35"],
  green: ["#2f6b55", "#0f2a22"],
} as const;

function Bauble({
  color,
  length,
  delay,
}: {
  color: keyof typeof BAUBLE;
  length: number;
  delay: number;
}) {
  const [light, dark] = BAUBLE[color];
  const id = `bauble-${color}`;
  return (
    <span
      className="holiday-edition__bauble"
      style={{ "--d": `${delay}s` } as React.CSSProperties}
    >
      <svg width="44" height={length + 52} viewBox={`0 0 44 ${length + 52}`}>
        <defs>
          <radialGradient id={id} cx=".35" cy=".3" r=".75">
            <stop offset="0" stopColor="#fff" stopOpacity=".85" />
            <stop offset=".18" stopColor={light} />
            <stop offset="1" stopColor={dark} />
          </radialGradient>
        </defs>
        <line x1="22" y1="0" x2="22" y2={length} stroke="#caa56c" />
        <rect x="17" y={length} width="10" height="7" rx="1.5" fill="#caa56c" />
        <circle cx="22" cy={length + 26} r="19" fill={`url(#${id})`} />
        <path
          d={`M6 ${length + 24}q16 7 32 0`}
          fill="none"
          stroke="#f3dfae"
          strokeOpacity=".55"
          strokeWidth="1.2"
        />
      </svg>
    </span>
  );
}
