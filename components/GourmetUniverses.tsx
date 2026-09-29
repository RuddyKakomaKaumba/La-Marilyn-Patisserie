import Image from "next/image";
import { ArrowRight } from "./icons";

type Universe = {
  title: string;
  /** Titre affiché sur deux lignes sur mobile, si besoin. */
  lines?: [string, string];
  cta: string;
  href: string;
  image: { src: string; alt: string; position: string };
};

const UNIVERSES: Universe[] = [
  {
    title: "Pâtisseries",
    cta: "Voir les créations",
    href: "#",
    image: {
      src: "/images/univers/patisseries.webp",
      alt: "Tartelette aux fraises fraîches, éclats de pistache et feuille d’or",
      position: "50% 56%",
    },
  },
  {
    title: "Gâteaux",
    cta: "Voir les gâteaux",
    href: "#",
    image: {
      src: "/images/univers/gateaux.webp",
      alt: "Tarte au chocolat et noisettes caramélisées, décors de chocolat et feuille d’or",
      position: "50% 60%",
    },
  },
  {
    title: "Mignardises",
    cta: "Voir les mignardises",
    href: "#",
    image: {
      src: "/images/univers/mignardises.webp",
      alt: "Assortiment de mignardises : dômes chocolat, entremets, tartelettes aux fruits",
      position: "50% 52%",
    },
  },
  {
    title: "Location de présentoirs",
    lines: ["Location", "de présentoirs"],
    cta: "Voir les options",
    href: "#",
    image: {
      src: "/images/univers/location-presentoirs.webp",
      alt: "Présentoir doré à trois étages sur un plan de marbre",
      position: "50% 50%",
    },
  },
];

export default function GourmetUniverses() {
  return (
    <section
      id="univers"
      aria-labelledby="univers-title"
      className="scroll-mt-4 bg-cream px-4 pb-14 pt-10 sm:px-8 md:pb-20 md:pt-16 lg:px-12 lg:pb-28 lg:pt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <header data-reveal className="mx-auto max-w-[36rem] text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
          <h2
            id="univers-title"
            className="display mt-6 text-[2.25rem] text-ink md:text-[2.75rem] lg:text-[3.25rem]"
          >
            Nos univers
            <br />
            gourmands
          </h2>
          <p className="mx-auto mt-4 max-w-[20.5rem] text-[0.875rem] leading-relaxed text-muted md:max-w-[28rem] md:text-[0.9375rem]">
            Découvrez nos pâtisseries, gâteaux et mignardises, ainsi que notre
            service de location de présentoirs pour sublimer vos événements.
          </p>
        </header>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {UNIVERSES.map((u, i) => (
            <li
              key={u.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
            >
              <a
                href={u.href}
                className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-ivory"
              >
                <div className="relative aspect-[4/4.4] overflow-hidden bg-sand lg:aspect-[4/4.8]">
                  <Image
                    src={u.image.src}
                    alt={u.image.alt}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, 48vw"
                    className="object-cover transition-transform duration-[600ms] ease-soft group-hover:scale-[1.02]"
                    style={{ objectPosition: u.image.position }}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between px-3 pb-4 pt-3.5 md:px-4 md:pb-5 md:pt-4">
                  <h3 className="font-sans text-[0.75rem] font-semibold uppercase leading-[1.45] tracking-[0.1em] text-ink md:text-[0.8125rem]">
                    {u.lines ? (
                      <>
                        {u.lines[0]}
                        <br />
                        {u.lines[1]}
                      </>
                    ) : (
                      u.title
                    )}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[0.6875rem] text-muted transition-colors duration-300 group-hover:text-gold-deep md:text-[0.75rem]">
                    {u.cta}
                    <ArrowRight className="h-3 w-3 text-gold-deep transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
