import CurveDivider from "../CurveDivider";
import StoryImagePlaceholder from "./StoryImagePlaceholder";

export default function AboutHero() {
  return (
    <section
      aria-labelledby="apropos-title"
      className="relative isolate overflow-hidden bg-ink px-6 pb-12 pt-[5.25rem] text-ivory sm:px-10 md:pb-20 md:pt-[9rem] lg:px-12 lg:pb-28 lg:pt-[10.5rem]"
    >
      <div className="mx-auto max-w-[1280px] lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
        <div className="max-w-[21rem] sm:max-w-[30rem] lg:max-w-[34rem]">
          <p data-reveal className="eyebrow text-gold-light/90">
            Notre histoire
          </p>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-3 block h-px w-8 bg-gold md:mt-5"
          />
          <h1
            id="apropos-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-4 text-[2.5rem] leading-[0.98] text-ivory sm:text-[3.5rem] md:mt-5 md:leading-[1.02] lg:text-[4.5rem]"
          >
            Une pâtisserie <br />{" "}
            <em className="font-[330] italic">faite avec passion.</em>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-3 max-w-[21rem] text-[0.9375rem] leading-[1.5] text-ivory/75 sm:max-w-[27rem] md:mt-5 md:leading-relaxed lg:mt-7 lg:text-base"
          >
            La Marilyn, L’art du gâteau, est une maison de pâtisserie basée à
            Douala. Nous préparons vos gâteaux et vos gourmandises avec le même
            soin, pour un simple goûter comme pour une grande fête.
          </p>
        </div>

        {/* Portrait / atelier La Marilyn */}
        <StoryImagePlaceholder
          className="mt-8 md:mt-10 lg:mt-0"
          image={{
            src: "/images/atelier-mains-poche-a-douille.webp",
            alt: "Mains de la pâtissière de La Marilyn, en tablier brodé du logo, décorant à la poche à douille un gâteau au chocolat garni de fraises",
            // Photo recadrée sur les mains, fondu vers le fond en haut.
            position: "50% 50%",
          }}
        />
      </div>
      <CurveDivider />
    </section>
  );
}
