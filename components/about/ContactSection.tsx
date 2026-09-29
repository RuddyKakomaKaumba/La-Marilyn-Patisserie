import { SOCIAL_LINKS, WHATSAPP_CTAS, WHATSAPP_URL } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "../buttons";
import {
  ArrowRight,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "../icons";

export default function ContactSection() {
  return (
    <section
      id="projet"
      aria-labelledby="projet-title"
      className="scroll-mt-4 bg-ink px-6 py-16 text-ivory sm:px-10 md:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p data-reveal className="eyebrow text-gold-light/90">
            Une envie&nbsp;? Un événement&nbsp;?
          </p>
          <h2
            id="projet-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-5 text-[2.625rem] text-ivory sm:text-[3.25rem] lg:text-[4.25rem]"
          >
            Une douceur pour
            <br />
            chaque occasion.
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-5 max-w-[21rem] text-[0.9375rem] leading-relaxed text-ivory/75 sm:max-w-[27rem]"
          >
            Un anniversaire, un mariage, une réception ou simplement une envie
            de faire plaisir&nbsp;? La Marilyn imagine avec vous quelque chose
            de gourmand.
          </p>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          className="mt-9 flex flex-col items-start gap-6 lg:mt-0 lg:items-end"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGold}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {WHATSAPP_CTAS.general.label}
            <ArrowRight className={btnArrow} />
          </a>
          <p className="text-[0.8125rem] text-ivory/60 lg:text-right">
            WhatsApp&nbsp;:{" "}
            <span className="select-all text-ivory/85">+237 94768972</span>
          </p>
          <ul className="flex gap-3">
            <li>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnOutlineLight} h-10 px-5`}
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnOutlineLight} h-10 px-5`}
              >
                <FacebookIcon className="h-4 w-4" />
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
