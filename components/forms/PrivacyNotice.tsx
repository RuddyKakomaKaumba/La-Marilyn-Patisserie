import Link from "next/link";

/**
 * Mention de confidentialité affichée avant l'envoi d'une demande.
 * Seule la partie « ce site n'enregistre pas » est vérifiée techniquement ;
 * le reste reprend l'engagement formulé par La Marilyn.
 */
export default function PrivacyNotice() {
  return (
    <p className="max-w-[40rem] text-[0.75rem] leading-relaxed text-muted md:text-[0.8125rem]">
      <strong className="font-semibold text-ink">Vos données.</strong> Les
      informations que vous saisissez servent uniquement à traiter votre
      demande, préparer votre commande et échanger avec vous pour nos
      prestations. Ce site ne les enregistre pas&nbsp;: elles sont seulement
      placées dans le message WhatsApp que vous choisissez d’envoyer. La Marilyn
      ne vend pas vos données et ne les divulgue pas à des tiers à des fins
      commerciales. Les messages envoyés via WhatsApp sont également traités par
      ce service, conformément à sa propre politique de confidentialité.{" "}
      <Link
        href="/confidentialite"
        className="text-gold-deep underline underline-offset-2 hover:text-ink"
      >
        En savoir plus
      </Link>
    </p>
  );
}
