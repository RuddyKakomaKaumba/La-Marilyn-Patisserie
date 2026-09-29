import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_CTAS, WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLightQuiet } from "./buttons";
import CurveDivider from "./CurveDivider";
import { ArrowRight, PlusIcon } from "./icons";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex hero-mobile flex-col overflow-hidden bg-ink text-ivory md:h-[100svh] md:max-h-[72rem] md:min-h-[44rem] lg:max-h-[980px] lg:min-h-[700px] lg:flex-row lg:items-center"
    >
      {/* Photographie */}
      {/*
        Mobile / tablette : la photo remplit le hero sous le haut de page, de
        sorte que le gâteau apparaisse juste sous les boutons ; le haut (déjà
        sombre) se fond dans le brun. Desktop : moitié droite.
        Hauteur mobile : 100svh, ou un peu plus (≈ 105 %) sur les écrans très
        courts pour que le gâteau reste visible.
      */}
      <div className="hero-mobile__media absolute inset-x-0 bottom-0 -z-10 md:top-[20vw] lg:inset-y-0 lg:left-auto lg:top-0 lg:w-[60%]">
        <Image
          src="/images/hero-entremets-chocolat.webp"
          alt="Entremets au chocolat glacé, orné du médaillon signature La Marilyn, de noisettes caramélisées et de feuilles de chocolat"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[50%_0%] lg:object-[50%_60%]"
        />
        {/* Fondus sombres pour la lisibilité */}
        {/* Sombre derrière le texte, transparent autour du gâteau */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(18_12_9/0.85)_22%,rgb(18_12_9/0.5)_42%,rgb(18_12_9/0)_56%,rgb(18_12_9/0)_86%,rgb(18_12_9/0.45)_100%)] lg:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(18_12_9/0.7)_22%,rgb(18_12_9/0)_55%),linear-gradient(to_bottom,rgb(18_12_9/0.55)_0%,rgb(18_12_9/0)_22%)] lg:block" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-[4.75rem] sm:px-10 md:pt-[7rem] lg:px-12 lg:pt-10">
        <div className="max-w-[20.5rem] sm:max-w-[30rem] lg:max-w-[34rem]">
          <p
            data-reveal
            className="eyebrow text-[0.625rem] leading-[1.7] tracking-[0.14em] text-gold-light/90 md:text-[0.6875rem] md:leading-[1.9] md:tracking-[0.16em]"
          >
            Pâtisseries · Mignardises
            <br />
            Buffets · Location
          </p>

          <h1
            id="hero-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-3 text-balance text-[clamp(2.25rem,11vw,3.25rem)] leading-[0.98] text-ivory sm:text-[3.75rem] md:mt-5 lg:text-[4.75rem] lg:leading-[1.02] xl:text-[5.25rem]"
          >
            {/* Retours à la ligne naturels sur mobile, 4 lignes sur desktop */}
            <em className="font-[330] italic">Des créations</em>{" "}
            <br className="hidden lg:inline" />
            gourmandes <br className="hidden lg:inline" />
            pour tous vos <br className="hidden lg:inline" />
            moments.
          </h1>

          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-3 max-w-[18.5rem] text-[0.9375rem] leading-[1.45] text-ivory/80 sm:max-w-[24rem] md:mt-5 lg:mt-7 lg:text-base lg:leading-relaxed"
          >
            Pâtisseries et mignardises préparées avec soin pour vos petits et
            grands moments.
          </p>

          <div
            data-reveal
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            className="mt-5 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3.5 md:mt-8 lg:mt-10"
          >
            <Link href="/nos-creations" className={btnGold}>
              Découvrir nos créations
              <ArrowRight className={btnArrow} />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={btnOutlineLightQuiet}
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
        className="absolute bottom-9 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-ivory/60 text-ivory transition-colors duration-300 hover:border-gold-light hover:text-gold-light md:bottom-14 md:h-10 md:w-10 lg:bottom-10"
      >
        <PlusIcon className="h-4 w-4" />
      </a>

      {/* Courbe de transition vers la section claire */}
      <CurveDivider className="lg:hidden" />
    </section>
  );
}
