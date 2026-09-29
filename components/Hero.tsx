import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_CTAS, WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "./buttons";
import CurveDivider from "./CurveDivider";
import { ArrowRight, PlusIcon } from "./icons";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-ivory lg:flex lg:h-[100svh] lg:max-h-[980px] lg:min-h-[700px] lg:items-center"
    >
      {/* Photographie */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[66%] md:h-[68%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[60%]">
        <Image
          src="/images/hero-entremets-chocolat.webp"
          alt="Entremets au chocolat glacé, orné du médaillon signature La Marilyn, de noisettes caramélisées et de feuilles de chocolat"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[50%_58%] lg:object-[50%_60%]"
        />
        {/* Fondus sombres pour la lisibilité */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(18_12_9/0.85)_20%,rgb(18_12_9/0.3)_40%,rgb(18_12_9/0)_55%)] lg:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(18_12_9/0.7)_22%,rgb(18_12_9/0)_55%),linear-gradient(to_bottom,rgb(18_12_9/0.55)_0%,rgb(18_12_9/0)_22%)] lg:block" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-[27.5rem] pt-[7rem] sm:px-10 sm:pb-[33rem] md:pt-[9rem] lg:px-12 lg:pb-0 lg:pt-10">
        <div className="max-w-[20.5rem] sm:max-w-[30rem] lg:max-w-[34rem]">
          <p data-reveal className="eyebrow leading-[1.9] text-gold-light/90">
            Pâtisseries · Mignardises
            <br />
            Buffets · Location
          </p>

          <h1
            id="hero-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-5 text-[2.875rem] text-ivory sm:text-[3.75rem] lg:text-[4.75rem] xl:text-[5.25rem]"
          >
            <em className="font-[330] italic">Des créations</em>
            <br />
            gourmandes
            <br />
            pour tous vos
            <br />
            moments.
          </h1>

          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-5 max-w-[19rem] text-[0.9375rem] leading-relaxed text-ivory/75 sm:max-w-[24rem] lg:mt-7 lg:text-base"
          >
            Des pâtisseries, des gâteaux et des mignardises préparés avec soin,
            pour vos grandes occasions comme pour les petits plaisirs du
            quotidien.
          </p>

          <div
            data-reveal
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            className="mt-8 flex flex-col items-start gap-3.5 sm:flex-row sm:items-center lg:mt-10"
          >
            <Link href="/nos-creations" className={btnGold}>
              Découvrir nos créations
              <ArrowRight className={btnArrow} />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={btnOutlineLight}
            >
              {WHATSAPP_CTAS.general.label}
              <ArrowRight className={btnArrow} />
            </a>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <a
        href="#univers"
        aria-label="Découvrir la suite"
        className="absolute bottom-12 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-ivory/60 text-ivory transition-colors duration-300 hover:border-gold-light hover:text-gold-light md:bottom-16 lg:bottom-10"
      >
        <PlusIcon className="h-4 w-4" />
      </a>

      {/* Courbe de transition vers la section claire */}
      <CurveDivider className="lg:hidden" />
    </section>
  );
}
