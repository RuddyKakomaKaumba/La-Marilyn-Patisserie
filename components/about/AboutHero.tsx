import CurveDivider from "../CurveDivider";
import StoryImagePlaceholder from "./StoryImagePlaceholder";

export default function AboutHero() {
  return (
    <section
      aria-labelledby="apropos-title"
      className="relative isolate overflow-hidden bg-ink px-6 pb-16 pt-[7.5rem] text-ivory sm:px-10 md:pb-20 md:pt-[9rem] lg:px-12 lg:pb-28 lg:pt-[10.5rem]"
    >
      <div className="mx-auto max-w-[1280px] lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
        <div className="max-w-[21rem] sm:max-w-[30rem] lg:max-w-[34rem]">
          <p data-reveal className="eyebrow text-gold-light/90">
            Notre histoire
          </p>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-5 block h-px w-8 bg-gold"
          />
          <h1
            id="apropos-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-5 text-[2.625rem] text-ivory sm:text-[3.5rem] lg:text-[4.5rem]"
          >
            Une passion
            <br />
            <em className="font-[330] italic">née de la gourmandise.</em>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-5 max-w-[21rem] text-[0.9375rem] leading-relaxed text-ivory/75 sm:max-w-[27rem] lg:mt-7 lg:text-base"
          >
            La Marilyn – L’art du gâteau est née d’une envie simple&nbsp;: faire
            de chaque occasion un moment gourmand, à partager avec ceux qu’on
            aime.
          </p>
        </div>

        {/* Portrait / atelier La Marilyn — image à ajouter */}
        <StoryImagePlaceholder className="mt-10 lg:mt-0" />
      </div>
      <CurveDivider />
    </section>
  );
}
