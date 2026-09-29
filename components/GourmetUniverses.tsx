import Image from "next/image";
import Link from "next/link";
import { ctaUrl, WHATSAPP_CTAS, type WhatsAppCta } from "@/lib/site";
import { ArrowRight } from "./icons";

type Universe = {
  title: string;
  /** Titre affiché sur deux lignes sur mobile, si besoin. */
  lines?: [string, string];
  /** Lien de navigation (page Nos créations)… */
  nav?: { label: string; href: string };
  /** …ou demande WhatsApp, pour les univers sans page dédiée. */
  whatsapp?: WhatsAppCta;
  image: { src: string; alt: string; position: string };
};

const UNIVERSES: Universe[] = [
  {
    title: "Pâtisseries",
    nav: { label: "Voir les créations", href: "/nos-creations#patisseries" },
    image: {
      src: "/images/univers/patisseries.webp",
      alt: "Tartelette aux fraises fraîches, éclats de pistache et feuille d’or",
      position: "50% 56%",
    },
  },
  {
    title: "Gâteaux",
    whatsapp: "surMesure",
    image: {
      src: "/images/univers/gateaux.webp",
      alt: "Tarte au chocolat et noisettes caramélisées, décors de chocolat et feuille d’or",
      position: "50% 60%",
    },
  },
  {
    title: "Mignardises",
    nav: {
      label: "Voir les mignardises",
      href: "/nos-creations#mignardises",
    },
    image: {
      src: "/images/univers/mignardises.webp",
      alt: "Assortiment de mignardises : dômes chocolat, entremets, tartelettes aux fruits",
      position: "50% 52%",
    },
  },
  {
    title: "Location de présentoirs",
    lines: ["Location", "de présentoirs"],
    whatsapp: "presentoirs",
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
      className="scroll-mt-4 bg-cream px-4 pb-12 pt-9 sm:px-8 md:pb-20 md:pt-16 lg:px-12 lg:pb-28 lg:pt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <header data-reveal className="mx-auto max-w-[36rem] text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
          <h2
            id="univers-title"
            className="display mt-5 text-[2rem] text-ink md:mt-6 md:text-[2.75rem] lg:text-[3.25rem]"
          >
            Nos univers
            <br />
            gourmands
          </h2>
          <p className="mx-auto mt-3 max-w-[20.5rem] text-[0.9375rem] leading-[1.55] text-muted md:mt-4 md:max-w-[28rem] md:leading-relaxed">
            Pâtisseries, gâteaux, mignardises et jolis présentoirs&nbsp;: tout
            ce qu’il faut pour régaler vos invités et dresser une belle table.
          </p>
        </header>

        <ul className="mt-7 grid grid-cols-2 gap-2.5 md:mt-12 md:gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {UNIVERSES.map((u, i) => {
            const label = u.whatsapp
              ? WHATSAPP_CTAS[u.whatsapp].label
              : (u.nav?.label ?? "");
            return (
              <li
                key={u.title}
                data-reveal
                style={
                  { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties
                }
              >
                <CardLink universe={u}>
                  <div className="relative aspect-[4/4.4] overflow-hidden bg-sand lg:aspect-[4/4.8]">
                    <Image
                      src={u.image.src}
                      alt={u.image.alt}
                      fill
                      sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, 48vw"
                      className="object-cover transition-transform duration-[650ms] ease-soft group-hover:scale-[1.03]"
                      style={{ objectPosition: u.image.position }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between px-3 pb-3.5 pt-3 md:px-4 md:pb-5 md:pt-4">
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
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] text-muted transition-colors duration-300 group-hover:text-gold-deep">
                      {label}
                      <ArrowRight className="h-3 w-3 text-gold-deep transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </CardLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const CARD_CLASS =
  "group flex h-full flex-col overflow-hidden rounded-[10px] bg-ivory transition-[translate] duration-500 ease-soft hover:-translate-y-0.5";

function CardLink({
  universe,
  children,
}: {
  universe: Universe;
  children: React.ReactNode;
}) {
  if (universe.whatsapp) {
    return (
      <a
        href={ctaUrl(universe.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className={CARD_CLASS}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={universe.nav?.href ?? "/nos-creations"} className={CARD_CLASS}>
      {children}
    </Link>
  );
}
