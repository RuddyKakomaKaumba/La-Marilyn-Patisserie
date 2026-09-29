import Image from "next/image";
import { LOGO, WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "./buttons";
import { ArrowRight, WhatsAppIcon } from "./icons";

const FOOTER_LINKS = [
  { href: "#", label: "Pâtisseries" },
  { href: "#", label: "Gâteaux" },
  { href: "#", label: "Mignardises" },
  { href: "#", label: "Location" },
];

export default function ContactCTA() {
  return (
    <footer
      id="contact"
      className="bg-ink px-6 pb-24 pt-16 text-center text-ivory sm:px-10 md:pt-24 lg:pb-14"
    >
      <section aria-labelledby="contact-title" className="mx-auto max-w-[34rem]">
        <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
        <h2
          id="contact-title"
          data-reveal
          className="display mt-6 text-[2.25rem] text-ivory md:text-[2.75rem] lg:text-[3.25rem]"
        >
          Une gourmandise
          <br />
          en tête&nbsp;?
        </h2>
        <p
          data-reveal
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          className="mx-auto mt-4 max-w-[19rem] text-[0.875rem] leading-relaxed text-ivory/70 md:max-w-[24rem] md:text-[0.9375rem]"
        >
          Commandez, demandez un devis ou contactez-nous pour discuter de votre
          événement.
        </p>
        <div
          data-reveal
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          className="mx-auto mt-8 flex max-w-[20rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGold}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Nous contacter
            <ArrowRight className={btnArrow} />
          </a>
          <a href="#univers" className={btnOutlineLight}>
            Découvrir nos créations
          </a>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-[34rem] md:mt-20">
        <Image
          src={LOGO.src}
          width={LOGO.width}
          height={LOGO.height}
          alt="La Marilyn"
          sizes="112px"
          className="mx-auto h-auto w-[104px] md:w-[112px]"
        />
        <nav aria-label="Liens de pied de page" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.8125rem] text-ivory/80">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="transition-colors duration-300 hover:text-gold-light"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 text-[0.6875rem] tracking-[0.04em] text-ivory/45">
          © {new Date().getFullYear()} La Marilyn · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
