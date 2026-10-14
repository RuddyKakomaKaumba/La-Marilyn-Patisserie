import { ctaUrl, WHATSAPP_CTAS, type WhatsAppCta } from "@/lib/site";
import InfiniteProductCarousel, {
  type Product,
} from "../InfiniteProductCarousel";
import { btnArrow, btnOutlineDark } from "../buttons";
import { ArrowRight } from "../icons";
import SeeAll from "./SeeAll";

type CarouselVariant = "compact" | "showcase";

type Props = {
  id: string;
  title: string;
  /** Courte introduction sous le titre (facultative). */
  intro?: string;
  products: Product[];
  direction: "left" | "right";
  speed?: number;
  /** CTA sous le carrousel : demande WhatsApp propre à la rangée. */
  cta: WhatsAppCta;
  /** Mentions communes à la rangée, affichées discrètement sous le CTA. */
  notes?: string[];
  /** Format des cartes (voir InfiniteProductCarousel). */
  variant?: CarouselVariant;
  /** Bouton « + » sur les cartes (voir InfiniteProductCarousel). */
  showAction?: boolean;
  /** Images chargées en priorité (première rangée de la page). */
  priorityCount?: number;
  /** Fond de la rangée (par défaut : celui de la page). */
  className?: string;
};

/** Une rangée de la vitrine : titre, carrousel animé et bouton. */
export default function CreationRow({
  id,
  title,
  intro,
  products,
  direction,
  speed,
  cta,
  notes,
  variant,
  showAction,
  priorityCount,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-4 pt-10 md:pt-16 lg:pt-20 ${className}`}
    >
      <div data-reveal className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id={`${id}-title`}
            className="display text-[1.75rem] text-ink md:text-[2.25rem] lg:text-[2.75rem]"
          >
            {title}
          </h2>
          <SeeAll title={title} products={products} />
        </div>
        {intro && (
          <p className="mt-2 max-w-[34rem] text-[0.875rem] leading-relaxed text-muted md:text-[0.9375rem]">
            {intro}
          </p>
        )}
      </div>

      <div data-reveal className="mt-4 md:mt-7 lg:mt-8">
        <InfiniteProductCarousel
          products={products}
          direction={direction}
          speed={speed}
          label={title}
          variant={variant}
          showAction={showAction}
          priorityCount={priorityCount}
        />
      </div>

      <div className="mt-6 flex justify-center px-4 md:mt-9">
        <a
          href={ctaUrl(cta)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnOutlineDark} w-full max-w-[21rem] sm:w-auto`}
        >
          {WHATSAPP_CTAS[cta].label}
          <ArrowRight className={btnArrow} />
        </a>
      </div>

      {notes?.length ? (
        <ul className="mx-auto mt-4 flex max-w-[44rem] flex-wrap justify-center gap-x-4 gap-y-1 px-6 text-center text-[0.75rem] leading-relaxed text-muted">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
