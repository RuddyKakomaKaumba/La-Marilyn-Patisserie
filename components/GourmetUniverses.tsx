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
    nav: {
      label: "Découvrir le Cake Design",
      href: "/nos-creations#cake-design",
    },
    image: {
      src: "/images/creations/gateau-trois-etages-turquoise-argent.webp",
      alt: "Gâteau à trois étages blanc et turquoise, roses en sucre et inscriptions argentées pour les 25 ans d’une chorale",
      position: "50% 18%",
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
    nav: { label: "Voir l’offre", href: "/nos-creations#presentoirs" },
    image: {
      src: "/images/presentoirs/cubes-blancs-table-marbre.webp",
      alt: "Cubes présentoirs blancs de différentes tailles posés sur une table en marbre",
      position: "60% 62%",
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
                    {/* Aspect de bouton : la carte entière reste le lien. */}
                    <span className={CARD_CTA_CLASS}>
                      <span>{label}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gold-deep transition-[color,translate] duration-300 ease-soft group-hover:translate-x-0.5 group-hover:text-gold-light group-focus-visible:translate-x-0.5 group-focus-visible:text-gold-light" />
                    </span>
                  </div>
                </CardLink>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mt-9 flex justify-center md:mt-12">
          <Link
            href="/nos-creations#ecrin"
            className="group relative inline-flex min-h-12 max-w-full items-center gap-3 rounded-[18px] border border-gold/60 bg-ink px-6 pb-3 pt-4 text-left text-ivory shadow-[0_10px_28px_-16px_rgba(18,12,9,0.55)] transition-[background-color,border-color,translate] duration-300 ease-soft hover:-translate-y-0.5 hover:border-gold-light hover:bg-cocoa active:translate-y-0 sm:rounded-full sm:py-3.5 sm:pl-8 sm:pr-7 md:min-h-14"
          >
            {/* Pastille « Nouveau » : orange abricot, texte encre. */}
            <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-[#e9965b] to-[#dc7a37] px-2.5 py-[3px] font-sans text-[0.625rem] font-semibold uppercase leading-none tracking-[0.16em] text-ink shadow-[0_2px_8px_-2px_rgba(18,12,9,0.45)] ring-2 ring-cream sm:left-7">
              Nouveau
            </span>
            <span className="font-sans text-[0.875rem] leading-snug md:text-[0.9375rem]">
              <span className="block sm:inline">
                L’Écrin gourmand by La Marilyn
              </span>
              <span className="hidden sm:inline"> — </span>
              <span className="block text-gold-light sm:inline">
                Composez votre cadeau
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-gold-light transition-transform duration-300 ease-soft group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const CARD_CTA_CLASS =
  "mt-3 flex min-h-12 w-full items-center justify-between gap-2 rounded-full border border-gold-deep px-3.5 py-1.5 text-[0.75rem] font-medium leading-[1.2] text-ink transition-[background-color,border-color,color] duration-300 ease-soft group-hover:border-ink group-hover:bg-ink group-hover:text-ivory group-focus-visible:border-ink group-focus-visible:bg-ink group-focus-visible:text-ivory md:mt-4 md:px-4 md:text-[0.8125rem] lg:text-[0.75rem] xl:text-[0.8125rem]";

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
