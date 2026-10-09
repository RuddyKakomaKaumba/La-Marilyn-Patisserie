import Image from "next/image";
import Link from "next/link";
import { CAKE_DESIGN_TERMS } from "@/lib/commerce";
import { CAKE_DESIGNS } from "@/lib/creations";
import { CAKE_DESIGN_PHOTOS } from "@/lib/galleryPhotos";
import { requestHref } from "@/lib/requests";
import { ctaUrl, WHATSAPP_CTAS } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineDark } from "../buttons";
import { ArrowRight } from "../icons";

/**
 * Cake Design : gâteaux personnalisés sur commande (anniversaire, mariage…).
 * Les visuels viennent de CAKE_DESIGNS : une nouvelle photo de gâteau
 * d'anniversaire s'ajoute dans lib/creations.ts.
 */
export default function CakeDesign() {
  return (
    <section
      id="cake-design"
      aria-labelledby="cake-design-title"
      className="scroll-mt-4 px-4 pt-14 sm:px-8 md:pt-20 lg:px-12 lg:pt-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 rounded-[14px] bg-ivory p-4 sm:p-6 md:gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:p-10">
        <ul
          data-reveal="image"
          className="grid grid-cols-2 gap-2.5 md:gap-4"
          aria-label="Exemples de créations Cake Design"
        >
          {CAKE_DESIGNS.map((cake) => (
            <li key={cake.name}>
              <figure>
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-[10px]"
                  style={{ backgroundColor: cake.tone }}
                >
                  {cake.image && (
                    <Image
                      src={cake.image.src}
                      alt={cake.image.alt}
                      fill
                      sizes="(min-width: 1280px) 330px, (min-width: 1024px) 27vw, 46vw"
                      className="object-cover"
                      style={{ objectPosition: cake.image.position }}
                    />
                  )}
                </div>
                <figcaption className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink md:text-[0.8125rem]">
                  {cake.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="lg:pr-4">
          <p data-reveal className="eyebrow text-gold-deep">
            Cake Design · Sur commande
          </p>
          <h2
            id="cake-design-title"
            data-reveal
            className="display mt-4 text-[2rem] text-ink md:text-[2.75rem] lg:text-[3.25rem]"
          >
            Un gâteau
            <br />
            <em className="font-[330] italic">qui vous ressemble.</em>
          </h2>
          <p
            data-reveal
            className="mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted"
          >
            Anniversaire, mariage ou grande occasion : votre gâteau est imaginé
            avec vous, de la forme à la dernière finition.
          </p>

          <div data-reveal className="mt-5 border-y border-sand py-4">
            <p className="font-sans text-[1.0625rem] font-semibold text-gold-deep">
              À partir de 25&nbsp;000&nbsp;FCFA
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
              Pour les créations les plus simples. Les créations personnalisées
              ou plus complexes sont réalisées sur devis, selon :{" "}
              {CAKE_DESIGN_TERMS.quoteFactors.join(", ")}.
            </p>
          </div>

          <dl
            data-reveal
            className="mt-4 space-y-1.5 text-[0.8125rem] leading-relaxed"
          >
            <div className="flex gap-3">
              <dt className="w-[5rem] shrink-0 text-muted">Délai</dt>
              <dd className="text-ink">{CAKE_DESIGN_TERMS.leadTime}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-[5rem] shrink-0 text-muted">Urgence</dt>
              <dd className="text-ink">{CAKE_DESIGN_TERMS.urgent}</dd>
            </div>
          </dl>

          <div
            data-reveal
            className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"
          >
            <Link href={requestHref("cake-design")} className={btnGold}>
              Demander un devis
              <ArrowRight className={btnArrow} />
            </Link>
            <a
              href={ctaUrl("surMesure")}
              target="_blank"
              rel="noopener noreferrer"
              className={btnOutlineDark}
            >
              {WHATSAPP_CTAS.surMesure.label}
            </a>
          </div>
          <p className="mt-3 text-[0.75rem] text-muted">
            {CAKE_DESIGN_TERMS.final}
          </p>
        </div>
      </div>

      {/* Réalisations : défilement horizontal sur mobile, grille dès md. */}
      <div className="mx-auto mt-8 max-w-[1280px] md:mt-12">
        <h3 data-reveal className="eyebrow text-gold-deep">
          Quelques réalisations
        </h3>
        <ul
          data-reveal="image"
          className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 sm:scroll-px-8 gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {CAKE_DESIGN_PHOTOS.map((photo) => (
            <li
              key={photo.src}
              className="w-[42vw] max-w-[13rem] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-sand">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 23vw, 42vw"
                    className="object-cover"
                    style={{ objectPosition: photo.position ?? "50% 50%" }}
                  />
                </div>
                <figcaption className="mt-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  {photo.category}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
