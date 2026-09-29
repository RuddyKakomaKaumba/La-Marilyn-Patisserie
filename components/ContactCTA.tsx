import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "./buttons";
import { ArrowRight, WhatsAppIcon } from "./icons";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ink px-6 pt-16 text-center text-ivory sm:px-10 md:pt-24"
    >
      <div className="mx-auto max-w-[34rem]">
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
          <Link href="/nos-creations" className={btnOutlineLight}>
            Découvrir nos créations
          </Link>
        </div>
      </div>
    </section>
  );
}
