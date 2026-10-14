import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { WHATSAPP_DISPLAY } from "@/lib/site";

const title = "Confidentialité | La Marilyn";
const description =
  "Comment La Marilyn utilise les informations transmises via le site et WhatsApp.";

/**
 * Page préparée, non indexée tant que les informations marquées
 * « À confirmer » n'ont pas été complétées et validées.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/confidentialite" },
  robots: { index: false, follow: true },
};

/** Date du dernier contrôle technique des affirmations de cette page. */
const VERIFIED_ON = "14 octobre 2026";

function ToConfirm({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-[4px] bg-[#fff3cd] px-1.5 py-0.5 text-[0.8125rem] text-[#5c4300] [box-decoration-break:clone]">
      <strong className="font-semibold">À confirmer</strong> · {children}
    </mark>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand pt-6">
      <h2 className="display text-[1.5rem] text-ink md:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-cocoa">
        {children}
      </div>
    </section>
  );
}

export default function Confidentialite() {
  return (
    <>
      <Header />
      <main className="bg-ivory px-6 pb-20 pt-[6.5rem] sm:px-10 md:pt-[9rem]">
        <article className="mx-auto max-w-[44rem]">
          <p className="eyebrow text-gold-deep">Confidentialité</p>
          <h1 className="display mt-4 text-[2.25rem] text-ink md:text-[3rem]">
            Vos données personnelles
          </h1>
          <p
            role="note"
            className="mt-5 rounded-[8px] border border-[#e6c35c] bg-[#fff8e1] px-4 py-3 text-[0.875rem] leading-relaxed text-[#5c4300]"
          >
            Page en cours de validation&nbsp;: les mentions signalées «&nbsp;À
            confirmer&nbsp;» seront complétées par La Marilyn. Les informations
            techniques ci-dessous ont été vérifiées sur le site le {VERIFIED_ON}
            .
          </p>

          <div className="mt-8 space-y-8">
            <Section title="Qui est responsable de vos données ?">
              <p>
                La Marilyn – L’Art du Gâteau, pâtisserie basée à Douala
                (Cameroun).
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Raison sociale et forme juridique&nbsp;:{" "}
                  <ToConfirm>à fournir par La Marilyn</ToConfirm>
                </li>
                <li>
                  Contact pour toute question sur vos données&nbsp;: WhatsApp{" "}
                  {WHATSAPP_DISPLAY}. Adresse e-mail dédiée&nbsp;:{" "}
                  <ToConfirm>à fournir</ToConfirm>
                </li>
              </ul>
            </Section>

            <Section title="Quelles informations sont collectées ?">
              <p>
                Uniquement celles que vous choisissez de saisir dans les
                formulaires «&nbsp;Préparer ma demande&nbsp;» et «&nbsp;Composer
                mon écrin&nbsp;»&nbsp;: votre prénom (facultatif), la date
                souhaitée et les détails de votre demande (occasion, produits et
                quantités, nombre de personnes, budget indicatif, lieu de
                l’événement ou quartier de livraison, couleurs, petit mot,
                précisions).
              </p>
              <p>
                Le site ne vous demande ni nom complet, ni adresse e-mail, ni
                numéro de téléphone.
              </p>
            </Section>

            <Section title="Comment sont-elles transmises ?">
              <p>
                Le site n’enregistre pas ces informations&nbsp;: il n’a ni base
                de données ni envoi vers un serveur. Il les place dans un
                message WhatsApp pré-rempli qui s’ouvre sur votre appareil. Rien
                n’est transmis tant que vous n’envoyez pas ce message vous-même.
              </p>
              <p>
                Le contenu du message figure dans l’adresse du lien WhatsApp
                ouvert par votre navigateur. Une fois envoyé, il est traité par
                WhatsApp (Meta), conformément à sa propre politique de
                confidentialité.
              </p>
            </Section>

            <Section title="À quoi servent-elles ?">
              <p>
                À traiter votre demande, préparer votre commande, vous confirmer
                le prix et les conditions, et échanger avec vous pour la
                prestation. La Marilyn ne vend pas vos données et ne les
                divulgue pas à des tiers à des fins commerciales.
              </p>
            </Section>

            <Section title="Qui y a accès ?">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>La Marilyn&nbsp;;</li>
                <li>
                  WhatsApp (Meta), pour l’acheminement des messages&nbsp;;
                </li>
                <li>
                  l’hébergeur du site, qui peut conserver des journaux
                  techniques (adresse IP, pages consultées)&nbsp;:{" "}
                  <ToConfirm>
                    nom de l’hébergeur et durée de conservation
                  </ToConfirm>
                </li>
              </ul>
            </Section>

            <Section title="Combien de temps sont-elles conservées ?">
              <p>
                Le site lui-même ne conserve rien. Dans la conversation WhatsApp
                de La Marilyn&nbsp;:{" "}
                <ToConfirm>durée de conservation</ToConfirm>
              </p>
            </Section>

            <Section title="Cookies et traceurs">
              <p>
                Le site ne dépose aucun cookie, n’utilise aucun stockage local
                et n’intègre aucun outil de mesure d’audience ni de publicité.
                Les polices de caractères sont servies par le site lui-même.
                Lorsque la galerie Instagram est activée, elle est chargée par
                le serveur du site&nbsp;: votre navigateur ne contacte pas
                Instagram en affichant la page.
              </p>
            </Section>

            <Section title="Vos droits">
              <p>
                Vous pouvez demander à La Marilyn l’accès à vos données, leur
                rectification ou leur suppression en lui écrivant sur WhatsApp
                au {WHATSAPP_DISPLAY}. Délai de réponse&nbsp;:{" "}
                <ToConfirm>à préciser</ToConfirm>
              </p>
              <p>
                Cadre légal&nbsp;: loi camerounaise n°&nbsp;2024/017 du 23
                décembre 2024 relative à la protection des données à caractère
                personnel.{" "}
                <ToConfirm>
                  obligations applicables, notamment pour l’usage de WhatsApp
                  (validation juridique)
                </ToConfirm>
              </p>
            </Section>
          </div>

          <p className="mt-10 text-[0.875rem]">
            <Link
              href="/a-propos#demande"
              className="text-gold-deep underline underline-offset-4 hover:text-ink"
            >
              Retour au formulaire de demande
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
