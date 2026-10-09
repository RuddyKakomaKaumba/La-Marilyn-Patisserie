import Image from "next/image";
import Link from "next/link";
import { REQUEST_IS_NOT_BOOKING } from "@/lib/commerce";
import { priceLines } from "@/lib/pricing";
import { requestHref } from "@/lib/requests";
import { ctaUrl, WHATSAPP_CTAS } from "@/lib/site";
import type { Product } from "../InfiniteProductCarousel";
import { btnArrow, btnGold, btnOutlineDark } from "../buttons";
import { ArrowRight, WhatsAppIcon } from "../icons";

/**
 * Contenu d'une fiche produit : photo, tarif, composition, délais,
 * mentions et action WhatsApp. N'affiche que les informations renseignées.
 */
export default function ProductDetails({
  product,
  titleId,
  onNavigate,
}: {
  product: Product;
  titleId: string;
  /** Appelé avant de suivre un lien interne (pour fermer la fenêtre). */
  onNavigate?: () => void;
}) {
  const cta = product.cta?.key ?? "general";
  const follow = (href: string) => (e: React.MouseEvent) => {
    onNavigate?.();
    if (!href.startsWith("#")) return;
    // Ancre sur la même page : on attend la fermeture de la fenêtre (qui
    // rend le focus à la carte) avant de défiler jusqu'à la section.
    e.preventDefault();
    window.setTimeout(() => {
      const target = document.querySelector(href);
      if (!target) return;
      history.replaceState(null, "", href);
      target.scrollIntoView();
    }, 40);
  };
  const prices = priceLines(product.pricing);
  const facts: [string, string][] = [];
  if (product.composition) facts.push(["Composition", product.composition]);
  if (product.options?.length)
    facts.push(["Au choix", product.options.join(" ou ")]);
  if (product.minQuantity) facts.push(["Minimum", product.minQuantity]);
  if (product.leadTime) facts.push(["Délai", product.leadTime]);

  return (
    <article>
      <div
        className="relative aspect-[16/10] overflow-hidden md:aspect-[16/9]"
        style={{ backgroundColor: product.tone }}
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 768px) 576px, 100vw"
            className="object-cover"
            style={{ objectPosition: product.image.position ?? "50% 50%" }}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[0.6875rem] uppercase tracking-[0.16em] text-muted/70">
            Photo à venir
          </span>
        )}
      </div>

      <div className="px-5 pb-6 pt-5 md:px-7 md:pb-8 md:pt-6">
        <h2
          id={titleId}
          tabIndex={-1}
          className="display outline-none text-[1.75rem] text-ink md:text-[2.125rem]"
        >
          {product.name}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
          {product.description}
        </p>
        {product.details?.map((d) => (
          <p
            key={d}
            className="mt-2 text-[0.9375rem] leading-relaxed text-muted"
          >
            {d}
          </p>
        ))}

        {prices.length > 0 && (
          <ul className="mt-4 space-y-0.5 font-sans text-[1rem] font-semibold text-gold-deep">
            {prices.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {facts.length > 0 && (
          <dl className="mt-4 divide-y divide-sand border-y border-sand text-[0.875rem]">
            {facts.map(([term, value]) => (
              <div key={term} className="flex gap-4 py-2.5">
                <dt className="w-[6.5rem] shrink-0 text-muted">{term}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {product.notes?.length ? (
          <ul className="mt-4 space-y-1.5 text-[0.8125rem] leading-relaxed text-muted">
            {product.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] h-px w-2.5 shrink-0 bg-gold"
                />
                {n}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <a
            href={ctaUrl(cta, product.cta?.detail)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGold}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {WHATSAPP_CTAS[cta].label}
          </a>
          {product.link ? (
            <Link
              href={product.link.href}
              onClick={follow(product.link.href)}
              className={btnOutlineDark}
            >
              {product.link.label}
              <ArrowRight className={btnArrow} />
            </Link>
          ) : product.request ? (
            <Link
              href={requestHref(product.request)}
              onClick={follow(requestHref(product.request))}
              className={btnOutlineDark}
            >
              Préparer ma demande
              <ArrowRight className={btnArrow} />
            </Link>
          ) : null}
        </div>

        <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">
          {REQUEST_IS_NOT_BOOKING}{" "}
          <Link
            href="/a-propos#conditions"
            onClick={follow("/a-propos#conditions")}
            className="underline decoration-gold/60 underline-offset-2 hover:text-ink"
          >
            Nos conditions
          </Link>
        </p>
      </div>
    </article>
  );
}
