import Image from "next/image";
import Link from "next/link";
import { PRESENTOIRS } from "@/lib/commerce";
import { formatFcfa } from "@/lib/pricing";
import { requestHref } from "@/lib/requests";
import { ctaUrl, WHATSAPP_CTAS } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineDark } from "../buttons";
import { ArrowRight } from "../icons";

/** Hauteur du plus grand cube (cm), pour le schéma à l'échelle. */
const MAX_H = Math.max(...PRESENTOIRS.cubes.map((c) => c.h));

/**
 * Location de présentoirs : set de 10 cubes blancs. Photo des cubes et
 * schéma à l'échelle des dimensions.
 */
export default function Presentoirs() {
  const total = PRESENTOIRS.cubes.reduce((n, c) => n + c.count, 0);
  return (
    <section
      id="presentoirs"
      aria-labelledby="presentoirs-title"
      className="scroll-mt-4 px-4 pt-14 sm:px-8 md:pt-20 lg:px-12 lg:pt-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 rounded-[14px] bg-ivory p-5 sm:p-7 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-10">
        <div>
          <p data-reveal className="eyebrow text-gold-deep">
            Location de présentoirs
          </p>
          <h2
            id="presentoirs-title"
            data-reveal
            className="display mt-4 text-[2rem] text-ink md:text-[2.75rem]"
          >
            Un set de {total} cubes blancs
            <br />
            <em className="font-[330] italic">pour sublimer votre table.</em>
          </h2>

          <ul
            data-reveal
            className="mt-5 divide-y divide-sand border-y border-sand text-[0.875rem]"
          >
            {PRESENTOIRS.cubes.map((c) => (
              <li key={c.size} className="flex justify-between gap-4 py-2">
                <span className="text-ink">{c.size}</span>
                <span className="text-muted">
                  {c.count} {c.count > 1 ? "cubes" : "cube"}
                </span>
              </li>
            ))}
          </ul>

          <figure
            data-reveal
            className="mt-6"
            aria-label="Schéma des cubes à l’échelle"
          >
            <div
              aria-hidden="true"
              className="flex h-[7.5rem] max-w-[26rem] items-end gap-1.5 border-b border-sand md:h-[9rem] md:gap-2"
            >
              {PRESENTOIRS.cubes.flatMap((c) =>
                Array.from({ length: c.count }, (_, i) => (
                  <span
                    key={`${c.size}-${i}`}
                    className="block rounded-[2px] border border-muted/35 bg-white"
                    style={{
                      flex: `${c.w} 1 0`,
                      height: `${(c.h / MAX_H) * 100}%`,
                    }}
                  />
                )),
              )}
            </div>
            <figcaption className="mt-2 text-[0.6875rem] text-muted">
              Schéma indicatif à l’échelle (largeur × hauteur).
            </figcaption>
          </figure>
        </div>

        <div className="lg:pt-10">
          <div
            data-reveal="image"
            className="relative mb-5 aspect-[3/2] overflow-hidden rounded-[10px] bg-sand"
          >
            <Image
              src="/images/presentoirs/presentoirs-cubes-blancs.webp"
              alt="Cubes présentoirs blancs de différentes tailles posés sur une table"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 92vw"
              className="object-cover"
              style={{ objectPosition: "50% 40%" }}
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li
              data-reveal
              className="rounded-[10px] border border-gold/50 p-4 md:p-5"
            >
              <h3 className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink">
                Location seule
              </h3>
              <p className="mt-2 font-sans text-[1.125rem] font-semibold text-gold-deep">
                {formatFcfa(PRESENTOIRS.price)}
              </p>
              <p className="text-[0.8125rem] text-muted">le set complet</p>
              <ul className="mt-3 space-y-1 text-[0.8125rem] leading-relaxed text-ink">
                <li>
                  Caution&nbsp;: {formatFcfa(PRESENTOIRS.deposit)}.{" "}
                  {PRESENTOIRS.depositNote}
                </li>
                <li>{PRESENTOIRS.transport}</li>
              </ul>
            </li>
            <li
              data-reveal
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              className="rounded-[10px] border border-sand p-4 md:p-5"
            >
              <h3 className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink">
                Avec une prestation La Marilyn
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                Vous commandez aussi vos gourmandises ou votre buffet&nbsp;? Les
                présentoirs peuvent accompagner votre prestation&nbsp;: les
                conditions vous sont précisées avec votre devis.
              </p>
            </li>
          </ul>

          <div
            data-reveal
            className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"
          >
            <Link href={requestHref("presentoirs")} className={btnGold}>
              Préparer ma demande
              <ArrowRight className={btnArrow} />
            </Link>
            <a
              href={ctaUrl("presentoirs")}
              target="_blank"
              rel="noopener noreferrer"
              className={btnOutlineDark}
            >
              {WHATSAPP_CTAS.presentoirs.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
