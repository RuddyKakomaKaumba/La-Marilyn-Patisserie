"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_URL } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/** Délai d'inactivité avant l'unique pulsation du bouton (ms). */
const IDLE_BEFORE_PULSE = 6000;

/**
 * Bouton WhatsApp flottant : apparaît en douceur après le chargement, puis
 * une seule pulsation discrète après quelques secondes sans interaction.
 */
export default function WhatsAppFloat() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let timer = 0;
    let done = false;
    const events = ["scroll", "pointerdown", "keydown"] as const;
    const stop = () =>
      events.forEach((e) => window.removeEventListener(e, arm));
    const arm = () => {
      if (done) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        done = true;
        stop();
        setPulse(true);
      }, IDLE_BEFORE_PULSE);
    };
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire à La Marilyn sur WhatsApp"
      className={`wa-float fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-ink/90 text-gold-light shadow-[0_6px_20px_rgb(18_12_9/0.25)] backdrop-blur-sm transition-colors duration-300 hover:border-gold-light hover:bg-ink sm:right-6 md:h-[3.25rem] md:w-[3.25rem] lg:bottom-8 lg:right-8 ${
        pulse ? "wa-float--pulse" : ""
      }`}
    >
      <WhatsAppIcon className="h-[22px] w-[22px] md:h-6 md:w-6" />
    </a>
  );
}
