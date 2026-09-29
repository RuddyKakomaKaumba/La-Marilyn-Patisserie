import Link from "next/link";
import { ctaUrl, WHATSAPP_CTAS, type WhatsAppCta } from "@/lib/site";
import InfiniteProductCarousel, {
  type Product,
} from "../InfiniteProductCarousel";

type CarouselVariant = "compact" | "showcase";
import { btnArrow, btnOutlineDark } from "../buttons";
import { ArrowRight } from "../icons";

type Props = {
  id: string;
  title: string;
  products: Product[];
  direction: "left" | "right";
  speed?: number;
  /** CTA sous le carrousel : demande WhatsApp propre à la rangée. */
  cta: WhatsAppCta;
  /** Format des cartes (voir InfiniteProductCarousel). */
  variant?: CarouselVariant;
  /** Bouton « + » sur les cartes (voir InfiniteProductCarousel). */
  showAction?: boolean;
};

/** Une rangée de la vitrine : titre, carrousel animé et bouton. */
export default function CreationRow({
  id,
  title,
  products,
  direction,
  speed,
  cta,
  variant,
  showAction,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-4 pt-12 md:pt-16 lg:pt-20"
    >
      <div
        data-reveal
        className="mx-auto flex max-w-[1280px] items-baseline justify-between gap-4 px-4 sm:px-8 lg:px-12"
      >
        <h2
          id={`${id}-title`}
          className="display text-[1.75rem] text-ink md:text-[2.25rem] lg:text-[2.75rem]"
        >
          {title}
        </h2>
        <Link
          href="#"
          className="group inline-flex shrink-0 items-center gap-1.5 text-[0.75rem] text-gold-deep transition-colors duration-300 hover:text-ink md:text-[0.8125rem]"
        >
          Voir tout
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div data-reveal className="mt-5 md:mt-7 lg:mt-8">
        <InfiniteProductCarousel
          products={products}
          direction={direction}
          speed={speed}
          label={title}
          variant={variant}
          showAction={showAction}
        />
      </div>

      <div className="mt-7 flex justify-center px-4 md:mt-9">
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
    </section>
  );
}
