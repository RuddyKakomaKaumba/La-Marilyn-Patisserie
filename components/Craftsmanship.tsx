import Image from "next/image";
import Link from "next/link";
import { btnArrow, btnOutlineLight } from "./buttons";
import { ArrowRight } from "./icons";

const CRAFT_IMAGE = {
  src: "/images/savoir-faire-poche-a-douille.webp",
  alt: "Crème vanille dressée à la poche à douille sur une tartelette aux framboises",
};

export default function Craftsmanship() {
  return (
    <section
      id="savoir-faire"
      aria-labelledby="savoir-faire-title"
      className="relative isolate overflow-hidden bg-ink text-ivory lg:flex lg:min-h-[760px] lg:items-end"
    >
      <div className="relative h-[29rem] overflow-hidden sm:h-[42rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[64%]">
        <Image
          src={CRAFT_IMAGE.src}
          alt={CRAFT_IMAGE.alt}
          fill
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="object-cover object-[50%_20%] lg:object-[50%_14%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(18_12_9/0.25)_0%,rgb(18_12_9/0)_22%,rgb(18_12_9/0)_52%,var(--color-ink)_100%)] lg:bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(18_12_9/0.55)_24%,rgb(18_12_9/0)_55%),linear-gradient(to_top,rgb(18_12_9/0.6)_0%,rgb(18_12_9/0)_35%)]" />
      </div>

      <div className="relative -mt-36 px-6 pb-12 sm:-mt-52 sm:px-10 sm:pb-20 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1440px] lg:px-12 lg:pb-28">
        <div className="max-w-[21rem] sm:max-w-[28rem] lg:max-w-[30rem]">
          <p data-reveal className="eyebrow text-ivory/85">
            Notre savoir-faire
          </p>
          <h2
            id="savoir-faire-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-4 text-[2.25rem] text-ivory sm:mt-5 sm:text-[3.5rem] lg:text-[4.5rem]"
          >
            Le détail
            <br />
            fait toute la
            <br />
            différence.
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-4 max-w-[21rem] text-[0.9375rem] leading-[1.55] text-ivory/75 sm:mt-6 sm:max-w-[25rem] sm:leading-relaxed"
          >
            De bons ingrédients, des gestes précis et un soin particulier
            apporté à chaque finition&nbsp;: chaque création est préparée à la
            main, comme pour nos propres invités.
          </p>
          <div
            data-reveal
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            className="mt-6 sm:mt-8"
          >
            <Link href="/a-propos" className={btnOutlineLight}>
              Notre histoire
              <ArrowRight className={btnArrow} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
