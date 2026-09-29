import { HeartIcon, PipingBagIcon, ToqueIcon } from "../icons";

const VALUES = [
  { label: "Préparé avec soin", Icon: HeartIcon },
  { label: "Artisanal & généreux", Icon: ToqueIcon },
  { label: "Créations sur mesure", Icon: PipingBagIcon },
];

export default function BrandStory() {
  return (
    <section
      aria-labelledby="histoire-title"
      className="bg-cream px-6 pb-12 pt-9 sm:px-10 md:pb-20 md:pt-16 lg:px-12 lg:pb-28 lg:pt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-20">
          <h2
            id="histoire-title"
            data-reveal
            className="display text-[2rem] text-ink md:text-[2.75rem] lg:text-[3.5rem]"
          >
            Créer du beau,
            <br />
            du bon et
            <br />
            du mémorable.
          </h2>
          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="mt-4 max-w-[34rem] space-y-3 text-[0.9375rem] leading-[1.55] text-muted md:mt-6 md:space-y-4 md:leading-relaxed lg:mt-2 lg:text-base"
          >
            <p>
              Au fil du temps, l’univers La Marilyn s’est élargi&nbsp;: des
              gâteaux sur mesure aux mignardises, en passant par les buffets et
              la location de présentoirs.
            </p>
            <p>
              Une même envie demeure&nbsp;: imaginer des créations généreuses,
              élégantes et pensées pour accompagner les moments qui comptent.
            </p>
          </div>
        </div>

        <ul className="mt-9 grid grid-cols-3 gap-3 border-t border-gold/25 pt-7 md:mt-16 md:pt-9 lg:mt-20 lg:gap-8 lg:pt-12">
          {VALUES.map(({ label, Icon }, i) => (
            <li
              key={label}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="flex flex-col items-center text-center lg:flex-row lg:justify-center lg:gap-4 lg:text-left"
            >
              <Icon className="h-7 w-7 shrink-0 text-gold-deep lg:h-8 lg:w-8" />
              <span className="mt-2.5 max-w-[7.5rem] text-[0.6875rem] font-semibold uppercase leading-[1.45] tracking-[0.1em] text-ink sm:max-w-none lg:mt-0 lg:text-[0.75rem] lg:tracking-[0.12em]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
