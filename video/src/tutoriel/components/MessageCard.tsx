import React from "react";
import P from "../data/parcours.json";
import { COLORS } from "../../theme";
import { SANS } from "../../fonts";
import { EASE, tween } from "../../lib/anim";
import { CUE, SEQ } from "../timeline";

/** Icône WhatsApp du site (components/icons.tsx). */
const WhatsAppGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.6 20.4 4.9 16.5A8.6 8.6 0 1 1 8 19.3Z" />
    <path d="M9.1 8.2c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3.1-2.2-.7-4-2.5-4.8-4.7-.3-.9-.2-1.7.1-2.2Z" />
  </svg>
);

/**
 * Le message que le site prépare pour WhatsApp : texte exact récupéré lors
 * de la capture (data/parcours.json). Il n'est pas envoyé : la carte montre
 * le récapitulatif, avant l'envoi par le client.
 */
export const MessageCard: React.FC<{ f: number; from: number; burgerPt?: { x: number; y: number } }> = ({ f, from }) => {
  const lines = (P.commande.message ?? "").split("\n");
  const inn = tween(f, from, from + 12, 0, 1, EASE.out);
  const out = tween(f, SEQ.final.from - 14, SEQ.final.from + 4, 1, 0);
  // Le message défile lentement, du premier article aux informations client.
  const scroll = tween(f, from + 24, CUE.message + 100, 0, 540, EASE.inOut);
  const W = 860;
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - W) / 2,
        top: 500,
        width: W,
        opacity: inn * out,
        transform: `translateY(${(1 - inn) * 120}px) scale(${0.9 + inn * 0.1}) rotateX(${(1 - inn) * 14}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div style={{ borderRadius: 30, overflow: "hidden", boxShadow: "0 60px 130px rgba(0,0,0,0.65), 0 0 0 1.5px rgba(226,199,150,0.55)", fontFamily: SANS }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 30px", backgroundColor: COLORS.ink, color: COLORS.ivory }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1.5px solid ${COLORS.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WhatsAppGlyph size={32} color={COLORS.goldLight} />
          </div>
          <div>
            <div style={{ fontSize: 31, fontWeight: 500 }}>Votre commande, en un seul message</div>
            <div style={{ fontSize: 23, color: COLORS.goldLight, letterSpacing: "0.03em" }}>Préparé par le site, prêt à être envoyé</div>
          </div>
        </div>
        <div style={{ position: "relative", height: 560, overflow: "hidden", backgroundColor: COLORS.cream, padding: "26px 30px" }}>
          <div
            style={{
              backgroundColor: "#fffdf9",
              borderRadius: "22px 22px 6px 22px",
              padding: "22px 28px",
              color: COLORS.ink,
              fontSize: 27,
              lineHeight: 1.4,
              border: `1px solid ${COLORS.sand}`,
              boxShadow: "0 6px 18px rgba(58,42,32,0.1)",
              transform: `translateY(${-scroll}px)`,
            }}
          >
            {lines.map((line, i) => {
              const at = from + 6 + Math.min(i, 14) * 1.5;
              const head = /^(ARTICLE|TOTAL|SOUS-TOTAL|INFORMATIONS)/.test(line);
              const note = /^(J’ai bien noté|Montant indicatif|Merci de me confirmer)/.test(line);
              return (
                <div
                  key={i}
                  style={{
                    minHeight: line ? undefined : 14,
                    opacity: tween(f, at, at + 10, 0, 1),
                    fontWeight: head ? 600 : 400,
                    color: note ? COLORS.muted : head ? COLORS.goldDeep : COLORS.ink,
                    fontSize: note ? 23 : 27,
                    letterSpacing: head ? "0.04em" : undefined,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: `linear-gradient(to top, ${COLORS.cream}, rgba(246,239,229,0))` }} />
        </div>
      </div>
      {/* Ce qui se passe ensuite : texte du site */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "center",
          opacity: tween(f, CUE.message + 30, CUE.message + 40, 0, 1),
        }}
      >
        <div
          style={{
            padding: "18px 30px",
            borderRadius: 22,
            backgroundColor: "rgba(18,12,9,0.88)",
            border: "1.5px solid rgba(226,199,150,0.7)",
            color: COLORS.ivory,
            fontFamily: SANS,
            fontSize: 31,
            lineHeight: 1.35,
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          La Marilyn vous confirme la disponibilité
          <br />
          et le montant définitif.
        </div>
      </div>
    </div>
  );
};
