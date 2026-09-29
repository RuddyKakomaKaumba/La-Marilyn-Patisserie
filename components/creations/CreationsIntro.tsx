import CurveDivider from "../CurveDivider";

export default function CreationsIntro() {
  return (
    <section
      aria-labelledby="creations-title"
      className="relative isolate overflow-hidden bg-ink px-6 pb-16 pt-[7.5rem] text-ivory sm:px-10 md:pb-20 md:pt-[9rem] lg:px-12 lg:pb-24 lg:pt-[10.5rem]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[21rem] sm:max-w-[30rem] lg:max-w-[40rem]">
          <p data-reveal className="eyebrow text-gold-light/90">
            Nos créations
          </p>
          <span
            aria-hidden="true"
            data-reveal
            className="mt-5 block h-px w-8 bg-gold"
          />
          <h1
            id="creations-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-5 text-[2.625rem] text-ivory sm:text-[3.5rem] lg:text-[4.5rem]"
          >
            Des créations
            <br />
            <em className="font-[330] italic">pour chaque envie.</em>
          </h1>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-5 max-w-[20rem] text-[0.9375rem] leading-relaxed text-ivory/75 sm:max-w-[26rem] lg:mt-6 lg:text-base"
          >
            Pâtisseries, mignardises et créations pour vos événements. Découvrez
            l’univers gourmand de La Marilyn.
          </p>
        </div>
      </div>
      <CurveDivider />
    </section>
  );
}
