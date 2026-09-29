import Image from "next/image";
import { btnArrow, btnOutlineLight } from "./buttons";
import { ArrowRight } from "./icons";

/**
 * Photographie de la section « Le détail fait toute la différence ».
 * TEMPORAIRE : le visuel dédié (poche à douille sur tarte framboise) n'a pas
 * encore été reçu. On recadre en attendant sur le geste de la pâtissière
 * dans la photo du Hero. Pour intégrer le visuel définitif : déposer le
 * fichier dans /public/images/, mettre à jour `src`/`alt` et remplacer
 * `frame` par un simple `object-position` (ex. "object-[50%_30%]").
 */
const CRAFT_IMAGE = {
  src: "/images/hero-entremets-chocolat.webp",
  alt: "Pâtissière dressant une crème à la poche à douille",
  frame:
    "object-cover object-[50%_0%] origin-[80%_31%] scale-[2.05] lg:origin-[78%_26%] lg:scale-[1.55]",
};

export default function Craftsmanship() {
  return (
    <section
      id="savoir-faire"
      aria-labelledby="savoir-faire-title"
      className="relative isolate overflow-hidden bg-ink text-ivory lg:flex lg:min-h-[760px] lg:items-end"
    >
      <div className="relative h-[34rem] overflow-hidden sm:h-[42rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[64%]">
        <Image
          src={CRAFT_IMAGE.src}
          alt={CRAFT_IMAGE.alt}
          fill
          sizes="(min-width: 1024px) 64vw, 100vw"
          className={CRAFT_IMAGE.frame}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(18_12_9/0.25)_0%,rgb(18_12_9/0)_22%,rgb(18_12_9/0)_52%,var(--color-ink)_100%)] lg:bg-[linear-gradient(to_right,var(--color-ink)_0%,rgb(18_12_9/0.55)_24%,rgb(18_12_9/0)_55%),linear-gradient(to_top,rgb(18_12_9/0.6)_0%,rgb(18_12_9/0)_35%)]" />
      </div>

      <div className="relative -mt-44 px-6 pb-16 sm:-mt-52 sm:px-10 sm:pb-20 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1440px] lg:px-12 lg:pb-28">
        <div className="max-w-[21rem] sm:max-w-[28rem] lg:max-w-[30rem]">
          <p data-reveal className="eyebrow text-ivory/85">
            Notre savoir-faire
          </p>
          <h2
            id="savoir-faire-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="display mt-5 text-[2.875rem] text-ivory sm:text-[3.5rem] lg:text-[4.5rem]"
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
            className="mt-6 max-w-[21rem] text-[0.875rem] leading-relaxed text-ivory/75 sm:max-w-[25rem] lg:text-[0.9375rem]"
          >
            Des ingrédients de qualité, des gestes précis et une attention
            portée à chaque finition : chacune de nos créations est façonnée à
            la main, avec exigence et passion.
          </p>
          <div
            data-reveal
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            className="mt-8"
          >
            <a href="#" className={btnOutlineLight}>
              Notre histoire
              <ArrowRight className={btnArrow} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
