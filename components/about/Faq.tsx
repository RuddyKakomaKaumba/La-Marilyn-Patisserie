import Link from "next/link";
import {
  CAKE_DESIGN_TERMS,
  CANCELLATION,
  CONFIRMATION_STEPS,
  DELIVERY,
  ECRIN_TERMS,
  GATEAUX_TERMS,
  MODIFICATIONS,
  PAYMENT,
  URGENT,
} from "@/lib/commerce";

type Item = { q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    q: "Comment commander ?",
    a: (
      <p>
        Préparez votre demande avec le formulaire ci-dessus ou écrivez
        directement à La Marilyn sur WhatsApp. Votre message arrive tout prêt :
        il ne reste qu’à l’envoyer.
      </p>
    ),
  },
  {
    q: "Quand ma commande est-elle confirmée ?",
    a: (
      <>
        <p>Une demande ne vaut pas réservation. La commande est confirmée :</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {CONFIRMATION_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </>
    ),
  },
  {
    q: "Comment fonctionnent l’acompte et le solde ?",
    a: (
      <ul className="list-disc space-y-1 pl-5">
        {PAYMENT.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    ),
  },
  {
    q: "Quels sont les modes de paiement ?",
    a: <p>{PAYMENT.means} Aucun paiement n’est demandé sur le site.</p>,
  },
  {
    q: "Puis-je annuler ou modifier ma commande ?",
    a: (
      <>
        <p>{CANCELLATION}</p>
        <p className="mt-2">{MODIFICATIONS}</p>
      </>
    ),
  },
  {
    q: "Quels sont les délais ?",
    a: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Gâteaux gourmands : {GATEAUX_TERMS.leadTime}</li>
        <li>
          Mignardises et crêpes : 24 h ou 48 h selon le produit (indiqué sur
          chaque fiche) ; 72 h minimum pour les grosses commandes.
        </li>
        <li>Cake Design : {CAKE_DESIGN_TERMS.leadTime}</li>
        <li>L’Écrin gourmand : {ECRIN_TERMS.leadTime}</li>
        <li>
          Buffets et événements : selon la nature et l’ampleur de l’événement.
        </li>
      </ul>
    ),
  },
  {
    q: "Et pour une commande urgente ?",
    a: <p>{URGENT}</p>,
  },
  {
    q: "Comment sont fixés les tarifs et la personnalisation ?",
    a: (
      <>
        <p>
          Les tarifs confirmés sont indiqués sur chaque fiche de la page{" "}
          <Link
            href="/nos-creations"
            className="underline decoration-gold/60 underline-offset-2"
          >
            Nos créations
          </Link>
          . Les gâteaux gourmands sont vendus seuls : garniture, crème,
          décoration, inscription et personnalisation ne sont pas comprises.
        </p>
        <p className="mt-2">
          Le Cake Design, les buffets et les créations personnalisées font
          l’objet d’un devis ; le prix final est toujours confirmé par La
          Marilyn.
        </p>
      </>
    ),
  },
  {
    q: "Livrez-vous ?",
    a: (
      <>
        <p>{DELIVERY.base}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {DELIVERY.fees.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="mt-2">{DELIVERY.final}</p>
        <p className="mt-2">{DELIVERY.pickup}</p>
      </>
    ),
  },
  {
    q: "Qu’est-ce que L’Écrin gourmand ?",
    a: (
      <>
        <p>
          Un coffret cadeau que vous composez : gourmandises, couleurs, ambiance
          et petit mot. {ECRIN_TERMS.price} {ECRIN_TERMS.priceDetail} Délai :{" "}
          {ECRIN_TERMS.leadTime.toLowerCase()}
        </p>
        <p className="mt-2">{ECRIN_TERMS.cake}</p>
        <p className="mt-2">
          <Link
            href="/nos-creations#ecrin"
            className="underline decoration-gold/60 underline-offset-2"
          >
            Composer mon écrin
          </Link>
        </p>
      </>
    ),
  },
];

/** Questions fréquentes : accordéons natifs (details/summary). */
export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-4 bg-ivory px-4 py-12 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow text-gold-deep">Questions fréquentes</p>
          <h2
            id="faq-title"
            className="display mt-4 text-[1.75rem] text-ink md:text-[2.5rem]"
          >
            Bon à savoir
          </h2>
        </div>
        <div data-reveal className="divide-y divide-sand border-y border-sand">
          {ITEMS.map((item) => (
            <details key={item.q} className="faq group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-sans text-[0.9375rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative h-3 w-3 shrink-0 text-gold-deep before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <div className="pb-5 pr-6 text-[0.875rem] leading-relaxed text-muted">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
