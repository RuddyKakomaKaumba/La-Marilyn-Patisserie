import { ECRIN_TERMS } from "@/lib/commerce";
import { PRECOMPOSED_ECRINS } from "@/lib/ecrin";
import EcrinOptions from "./EcrinOptions";

/**
 * L'Écrin gourmand by La Marilyn : coffret cadeau entièrement composé par
 * le visiteur (option 1) ou, plus tard, écrins pré-composés (option 2).
 * Emplacement photo : ajouter une image dans cette section dès réception
 * des photos de l'écrin.
 */
export default function EcrinGourmand() {
  return (
    <section
      id="ecrin"
      aria-labelledby="ecrin-title"
      className="mt-14 scroll-mt-4 bg-ink px-4 py-14 text-ivory sm:px-8 md:mt-20 md:py-20 lg:mt-28 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p data-reveal className="eyebrow text-gold-light/90">
              Nouveau · Coffret cadeau
            </p>
            <span
              aria-hidden="true"
              data-reveal
              className="mt-4 block h-px w-8 bg-gold"
            />
            <h2
              id="ecrin-title"
              data-reveal
              className="display mt-5 text-[2.25rem] text-ivory md:text-[3.25rem] lg:text-[4rem]"
            >
              L’Écrin gourmand
              <br />
              <span className="text-gold-light">by La Marilyn</span>
            </h2>
            <p
              data-reveal
              className="display mt-4 text-[1.25rem] italic text-ivory/85 md:text-[1.5rem]"
            >
              {ECRIN_TERMS.signature}
            </p>
          </div>

          <div
            data-reveal
            className="space-y-4 text-[0.9375rem] leading-relaxed text-ivory/75 lg:pt-10"
          >
            <p className="text-ivory">
              Et si, cette fois, c’était vous qui imaginiez le cadeau&nbsp;?
            </p>
            <p>
              L’Écrin gourmand n’est pas un coffret tout fait&nbsp;: c’est le
              vôtre. Vous choisissez les couleurs, les gourmandises, l’ambiance,
              et même le petit mot que la personne découvrira à l’ouverture.
            </p>
            <p>
              Chaque détail est pensé pour créer une attention qui raconte
              quelque chose, et dont on se souvient longtemps.
            </p>
            <dl className="!mt-6 grid gap-x-6 gap-y-3 border-t border-ivory/15 pt-5 text-[0.8125rem] sm:grid-cols-2">
              <div>
                <dt className="text-ivory/55">Tarif</dt>
                <dd className="mt-0.5 font-semibold text-gold-light">
                  {ECRIN_TERMS.price}
                </dd>
              </div>
              <div>
                <dt className="text-ivory/55">Délai</dt>
                <dd className="mt-0.5 text-ivory">{ECRIN_TERMS.leadTime}</dd>
              </div>
            </dl>
            <p className="text-[0.8125rem] text-ivory/65">
              {ECRIN_TERMS.priceDetail} {ECRIN_TERMS.cake}
            </p>
          </div>
        </div>

        <EcrinOptions precomposed={PRECOMPOSED_ECRINS} />
      </div>
    </section>
  );
}
