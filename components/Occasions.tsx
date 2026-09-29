import Image from "next/image";
import Link from "next/link";
import { btnArrow, btnGold } from "./buttons";
import { ArrowRight } from "./icons";

export default function Occasions() {
  return (
    <section
      id="occasions"
      aria-labelledby="occasions-title"
      className="relative isolate overflow-hidden bg-cream"
    >
      <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-12 sm:px-10 md:pb-20 md:pt-16 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:px-12 lg:py-28">
        {/* Photographie : en retrait à droite sur mobile, colonne dédiée sur desktop */}
        <div
          data-reveal
          className="absolute right-0 top-10 -z-10 h-[23rem] w-[62%] sm:top-8 sm:h-[28rem] sm:w-[56%] lg:relative lg:inset-auto lg:order-2 lg:z-auto lg:aspect-[4/5] lg:h-auto lg:w-full lg:overflow-hidden lg:rounded-[4px]"
        >
          <Image
            src="/images/occasions-tarte-framboise.webp"
            alt="Tarte aux framboises fraîches sur pâte sablée, crème vanille, éclats de pistache et feuille d’or"
            fill
            sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 62vw"
            className="object-cover object-[62%_55%] lg:object-[55%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-cream)_0%,rgb(246_239_229/0.55)_22%,rgb(246_239_229/0)_48%),linear-gradient(to_bottom,var(--color-cream)_0%,rgb(246_239_229/0)_14%,rgb(246_239_229/0)_80%,var(--color-cream)_100%)] lg:hidden" />
        </div>

        <div className="lg:order-1">
          <span
            aria-hidden="true"
            className="flex items-center gap-0 text-gold"
          >
            <span className="block h-2 w-px bg-current" />
            <span className="block h-px w-6 bg-current" />
          </span>
          <h2
            id="occasions-title"
            data-reveal
            className="display mt-6 text-[2.25rem] text-ink sm:text-[2.75rem] lg:text-[3.75rem]"
          >
            Des saveurs
            <br />
            pour chaque
            <br />
            occasion.
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="mt-5 max-w-[12.25rem] text-[0.875rem] leading-relaxed text-muted sm:max-w-[17rem] lg:max-w-[26rem] lg:text-[0.9375rem]"
          >
            Anniversaires, mariages, réceptions ou simplement pour se faire
            plaisir.
          </p>
          <div
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-8 lg:mt-10"
          >
            <Link href="/nos-creations" className={btnGold}>
              Découvrir nos créations
              <ArrowRight className={btnArrow} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
