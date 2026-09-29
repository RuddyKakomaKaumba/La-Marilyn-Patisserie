import Image from "next/image";
import { whatsappUrl } from "@/lib/site";
import { btnArrow, btnGold } from "../buttons";
import { ArrowRight } from "../icons";

const EVENT_MESSAGE =
  "Bonjour La Marilyn, je souhaiterais commander une création pour un événement.";

export default function EventCTA() {
  return (
    <section
      aria-labelledby="evenement-title"
      className="relative isolate mt-16 overflow-hidden bg-ink text-ivory md:mt-20 lg:mt-28"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/evenements-buffet.webp"
          alt="Table de réception dressée de mignardises, choux et tartelettes sur présentoirs, avec bouquets de fleurs"
          fill
          sizes="100vw"
          className="object-cover object-[50%_62%] lg:object-[50%_58%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(18_12_9/0.78)_22%,rgb(18_12_9/0.2)_52%,rgb(18_12_9/0.25)_78%,var(--color-ink)_100%)]" />
      </div>

      <div className="mx-auto flex min-h-[40rem] max-w-[40rem] flex-col items-center justify-between px-6 pb-14 pt-16 text-center sm:min-h-[46rem] md:pt-20 lg:min-h-[44rem] lg:pb-20">
        <div>
          <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
          <h2
            id="evenement-title"
            data-reveal
            className="display mt-6 text-[2.25rem] text-ivory md:text-[2.75rem] lg:text-[3.5rem]"
          >
            Une création
            <br />
            en tête&nbsp;?
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="mx-auto mt-4 max-w-[20rem] text-[0.875rem] leading-relaxed text-ivory/80 md:max-w-[27rem] md:text-[0.9375rem]"
          >
            Anniversaire, réception, mariage ou événement professionnel&nbsp;:
            imaginons ensemble une création qui vous ressemble.
          </p>
        </div>

        <a
          data-reveal
          href={whatsappUrl(EVENT_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnGold} mt-10`}
        >
          Commander sur WhatsApp
          <ArrowRight className={btnArrow} />
        </a>
      </div>
    </section>
  );
}
