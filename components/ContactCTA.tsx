import Link from "next/link";
import { WHATSAPP_CTAS, WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "./buttons";
import { ArrowRight, WhatsAppIcon } from "./icons";

type Props = {
  /** Libellé du bouton WhatsApp. */
  primaryLabel?: string;
  /** Affiche le bouton secondaire « Découvrir nos créations ». */
  showCreationsLink?: boolean;
};

export default function ContactCTA({
  primaryLabel = WHATSAPP_CTAS.general.label,
  showCreationsLink = true,
}: Props) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ink px-6 pt-12 text-center text-ivory sm:px-10 md:pt-24"
    >
      <div className="mx-auto max-w-[34rem]">
        <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
        <h2
          id="contact-title"
          data-reveal
          className="display mt-5 text-[2rem] text-ivory md:mt-6 md:text-[2.75rem] lg:text-[3.25rem]"
        >
          Une gourmandise
          <br />
          en tête&nbsp;?
        </h2>
        <p
          data-reveal
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          className="mx-auto mt-3 max-w-[19.5rem] text-[0.9375rem] leading-[1.55] text-ivory/75 md:mt-4 md:max-w-[24rem] md:leading-relaxed"
        >
          Une envie de cake, un anniversaire à fêter ou des invités à
          recevoir&nbsp;? Écrivez-nous, on en parle ensemble.
        </p>
        <div
          data-reveal
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          className="mx-auto mt-6 flex max-w-[20rem] flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3 md:mt-8"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGold}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {primaryLabel}
            <ArrowRight className={btnArrow} />
          </a>
          {showCreationsLink && (
            <Link href="/nos-creations" className={btnOutlineLight}>
              Découvrir nos créations
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
