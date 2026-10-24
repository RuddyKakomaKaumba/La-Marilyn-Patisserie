"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { PrecomposedEcrin } from "@/lib/ecrin";
import { formatFcfa } from "@/lib/pricing";
import { buildRequestMessage, REQUEST_TYPES } from "@/lib/requests";
import { whatsappUrl } from "@/lib/site";
import { btnArrow, btnGold, btnOutlineLight } from "../buttons";
import { ArrowRight } from "../icons";
const EcrinConfigurator = dynamic(() => import("./EcrinConfigurator"), {
  ssr: false,
});

/**
 * Les deux façons de demander un écrin : le composer (configurateur
 * déplié à la demande) ou choisir un écrin pré-composé — mention
 * « bientôt disponible » tant que la collection est vide.
 */
export default function EcrinOptions({
  precomposed,
}: {
  precomposed: PrecomposedEcrin[];
}) {
  const [composing, setComposing] = useState(false);
  const available = precomposed.length > 0;

  return (
    <div className="mt-10 md:mt-14">
      <ul className="grid gap-3 md:grid-cols-2 md:gap-5">
        <li
          data-reveal
          className="flex flex-col rounded-[12px] border border-gold/40 p-5 md:p-7"
        >
          <p className="eyebrow text-gold-light/90">Option 1</p>
          <h3 className="display mt-3 text-[1.625rem] text-ivory md:text-[2rem]">
            Composer mon écrin
          </h3>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ivory/70">
            L’occasion, les gourmandises, les couleurs, le petit mot&nbsp;: vous
            imaginez tout, La Marilyn valide la composition avec vous.
          </p>
          <div className="mt-auto pt-5">
            <button
              type="button"
              aria-expanded={composing}
              aria-controls="ecrin-composer"
              onClick={() => setComposing((c) => !c)}
              className={btnGold}
            >
              {composing ? "Masquer le formulaire" : "Je compose mon écrin"}
              <ArrowRight
                className={`${btnArrow} ${composing ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        </li>

        <li
          data-reveal
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          className="flex flex-col rounded-[12px] border border-ivory/15 p-5 md:p-7"
        >
          <p className="eyebrow text-ivory/55">Option 2</p>
          <h3 className="display mt-3 text-[1.625rem] text-ivory md:text-[2rem]">
            Choisir un écrin pré-composé
          </h3>
          {available ? (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ivory/70">
              Des écrins déjà imaginés par La Marilyn&nbsp;: choisissez le vôtre
              et envoyez votre demande en un message.
            </p>
          ) : (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ivory/70">
              <span className="mr-2 inline-block rounded-full border border-gold/50 px-2.5 py-0.5 text-[0.6875rem] uppercase tracking-[0.12em] text-gold-light">
                Bientôt disponible
              </span>
              Des écrins déjà imaginés par La Marilyn, à choisir et à demander
              en un message.
            </p>
          )}
        </li>
      </ul>

      {available && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {precomposed.map((ecrin) => (
            <PrecomposedCard key={ecrin.name} ecrin={ecrin} />
          ))}
        </ul>
      )}

      <div id="ecrin-composer" hidden={!composing} className="mt-5 md:mt-8">
        {composing && <EcrinConfigurator />}
      </div>
    </div>
  );
}

function PrecomposedCard({ ecrin }: { ecrin: PrecomposedEcrin }) {
  const message = buildRequestMessage(REQUEST_TYPES.ecrin.subject, [
    ["Écrin choisi", ecrin.name],
    ["Prix indiqué", ecrin.price ? formatFcfa(ecrin.price) : undefined],
  ]);
  return (
    <li className="flex flex-col overflow-hidden rounded-[12px] bg-ink-soft">
      {ecrin.image && (
        <div className="relative aspect-[4/3]">
          <Image
            src={ecrin.image.src}
            alt={ecrin.image.alt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: ecrin.image.position }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-sans text-[1rem] font-semibold text-ivory">
          {ecrin.name}
        </h4>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-ivory/70">
          {ecrin.description}
        </p>
        <ul className="mt-3 space-y-1 text-[0.8125rem] text-ivory/80">
          {ecrin.contents.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
        {ecrin.price && (
          <p className="mt-3 font-semibold text-gold-light">
            {formatFcfa(ecrin.price)}
          </p>
        )}
        <div className="mt-auto pt-4">
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnOutlineLight}
          >
            Demander cet écrin
            <ArrowRight className={btnArrow} />
          </a>
        </div>
      </div>
    </li>
  );
}
