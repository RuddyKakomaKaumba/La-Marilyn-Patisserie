import Link from "next/link";
import CurveDivider from "../CurveDivider";

/** Accès rapide aux univers de la page. */
const SECTIONS = [
  { href: "#patisseries", label: "Gâteaux gourmands" },
  { href: "#cake-design", label: "Cake Design" },
  { href: "#mignardises", label: "Mignardises" },
  { href: "#crepes", label: "Crêpes" },
  { href: "#ecrin", label: "L’Écrin gourmand" },
  { href: "#traiteur", label: "Buffets" },
  { href: "#presentoirs", label: "Présentoirs" },
];

export default function CreationsIntro() {
  return (
    <section
      aria-labelledby="creations-title"
      className="relative isolate overflow-hidden bg-ink px-6 pb-12 pt-[5.25rem] text-ivory sm:px-10 md:pb-20 md:pt-[9rem] lg:px-12 lg:pb-24 lg:pt-[10.5rem]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[21rem] sm:max-w-[30rem] lg:max-w-[40rem]">
          <p data-reveal className="eyebrow text-gold-light/90">
            Nos créations
          </p>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-3 block h-px w-8 bg-gold md:mt-5"
          />
          <h1
            id="creations-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-4 text-[2.5rem] leading-[0.98] text-ivory sm:text-[3.5rem] md:mt-5 md:leading-[1.02] lg:text-[4.5rem]"
          >
            Des créations
            <br />
            <em className="font-[330] italic">pour chaque envie.</em>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-3 max-w-[20rem] text-[0.9375rem] leading-[1.5] text-ivory/75 sm:max-w-[26rem] md:mt-5 md:leading-relaxed lg:mt-6 lg:text-base"
          >
            Des pâtisseries, des mignardises et de jolies tables à partager.
            Bienvenue dans l’univers gourmand de La Marilyn.
          </p>
        </div>
        <nav
          aria-label="Sections de la page"
          data-reveal
          style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          className="mt-6 md:mt-9"
        >
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="inline-flex h-9 items-center rounded-full border border-ivory/20 px-3.5 text-[0.75rem] text-ivory/85 transition-colors duration-300 hover:border-gold-light hover:text-ivory md:text-[0.8125rem]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/a-propos#demande"
              className="inline-block py-1 text-[0.8125rem] text-gold-light underline decoration-gold/50 underline-offset-4 hover:text-ivory"
            >
              Préparer ma demande
            </Link>
            <Link
              href="/a-propos#conditions"
              className="inline-block py-1 text-[0.8125rem] text-gold-light underline decoration-gold/50 underline-offset-4 hover:text-ivory"
            >
              Comment commander, délais et conditions
            </Link>
          </p>
        </nav>
      </div>
      <CurveDivider />
    </section>
  );
}
