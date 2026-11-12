import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import captures from "../data/captures.json";
import { GoldDust, Glow, InkBackdrop } from "../components/Atmosphere";
import { PageScroll, Phone, PHONE, PHONE_VIEWPORT, Tap } from "../components/Devices";
import { Photo } from "../components/Photo";
import { Eyebrow, RevealLine, display } from "../components/Type";
import { EASE, keys, tween } from "../lib/anim";
import { useFormat } from "../lib/format";
import { SANS } from "../fonts";
import { COLORS } from "../theme";

export const S4_LEAD = 10;

/**
 * Moments clés du parcours (images depuis le début de la séquence). Ils
 * servent aussi à placer les effets sonores (voir Bande-son).
 */
export const ORDER = {
  tapCard: 28,
  toForm: 62,
  tapPick: 84,
  toDate: 98,
  tapDate: 122,
  scroll: 138,
  tapSend: 162,
  message: 168,
  exit: 222,
};

const STEPS = [
  { at: 0, text: "Choisissez vos gourmandises." },
  { at: ORDER.toForm, text: "Précisez votre demande." },
  { at: ORDER.toDate + 4, text: "Indiquez la date souhaitée." },
  { at: ORDER.tapSend - 6, text: "Envoyez-la sur WhatsApp." },
];

const shot = (name: string) => staticFile(`captures/${name}.png`);
const Screen: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <Img src={shot(name)} style={{ position: "absolute", left: 0, top: 0, width: PHONE.width, ...style }} />
);

/** Icône WhatsApp du site (components/icons.tsx). */
const WhatsAppGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.6 20.4 4.9 16.5A8.6 8.6 0 1 1 8 19.3Z" />
    <path d="M9.1 8.2c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3.1-2.2-.7-4-2.5-4.8-4.7-.3-.9-.2-1.7.1-2.2Z" />
  </svg>
);

/**
 * Message préparé par le site : texte exact produit par le formulaire au
 * moment de la capture (voir captures.json), sans rien ajouter.
 */
const MessageCard: React.FC<{ t: number; width: number }> = ({ t, width }) => {
  const lines = captures.form.message.split("\n").filter((l) => l.trim() !== "");
  const k = width / 780;
  return (
    <div
      style={{
        width,
        borderRadius: 30 * k,
        backgroundColor: COLORS.ivory,
        boxShadow: "0 60px 130px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(226,199,150,0.5)",
        overflow: "hidden",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18 * k,
          padding: `${24 * k}px ${32 * k}px`,
          backgroundColor: COLORS.ink,
          color: COLORS.ivory,
        }}
      >
        <div
          style={{
            width: 62 * k,
            height: 62 * k,
            borderRadius: "50%",
            border: `1.5px solid ${COLORS.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WhatsAppGlyph size={34 * k} color={COLORS.goldLight} />
        </div>
        <div>
          <div style={{ fontSize: 30 * k, fontWeight: 500 }}>La Marilyn</div>
          <div style={{ fontSize: 22 * k, color: COLORS.goldLight, letterSpacing: "0.04em" }}>Votre demande, sur WhatsApp</div>
        </div>
      </div>
      <div style={{ padding: `${30 * k}px ${32 * k}px ${34 * k}px`, backgroundColor: COLORS.cream }}>
        <div
          style={{
            backgroundColor: "#fffdf9",
            borderRadius: `${22 * k}px ${22 * k}px ${6 * k}px ${22 * k}px`,
            padding: `${24 * k}px ${28 * k}px`,
            color: COLORS.ink,
            fontSize: 28.5 * k,
            lineHeight: 1.42,
            boxShadow: "0 6px 18px rgba(58,42,32,0.1)",
            border: `1px solid ${COLORS.sand}`,
          }}
        >
          {lines.map((line, i) => {
            const at = 8 + i * 5;
            const fine = line.startsWith("J’ai bien noté");
            const sub = line.trim().startsWith("◦");
            return (
              <div
                key={i}
                style={{
                  opacity: tween(t, at, at + 10, 0, 1),
                  transform: `translateY(${tween(t, at, at + 12, 12, 0, EASE.out)}px)`,
                  marginTop: i === 0 ? 0 : sub ? 2 * k : line.startsWith("•") ? 6 * k : 12 * k,
                  marginLeft: sub ? 26 * k : 0,
                  fontWeight: line.startsWith("•") || sub ? 500 : 400,
                  fontSize: fine ? 24 * k : undefined,
                  color: fine ? COLORS.muted : undefined,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Séquence 4. La commande, telle qu'elle existe sur le site : fiche des
 * Mini-cupcakes, formulaire de demande (produit coché), date souhaitée, puis
 * envoi du message sur WhatsApp. Aucun paiement, aucune confirmation
 * automatique.
 */
export const S4Commande: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame - S4_LEAD;
  const { W, H, vertical, pick } = useFormat();
  const form = captures.form;

  const enter = tween(f, -S4_LEAD, 22, 0, 1, EASE.out);
  const exit = tween(f, ORDER.exit, ORDER.exit + 18, 0, 1, EASE.in);
  const sent = tween(f, ORDER.message, ORDER.message + 26, 0, 1, EASE.out);

  /* --------------------------- Téléphone --------------------------- */
  const base = pick(1.5, 1.0);
  // La caméra se rapproche des champs pendant la saisie, puis recule.
  const push = keys(f, [ORDER.toForm + 8, ORDER.tapPick, ORDER.scroll - 4, ORDER.scroll + 16], [0, 1, 1, 0]);
  const scale = base * (1 + push * pick(0.1, 0.1)) * (1 - sent * 0.1);
  const px = pick(W / 2, 960) - sent * pick(0, 120);
  const py = pick(1200, 546) + push * pick(66, 0) + (1 - enter) * H * 0.9 + Math.sin(f / 30) * 5;
  const rotY = keys(f, [-S4_LEAD, 24, ORDER.toForm, ORDER.scroll, ORDER.message + 24], [-22, -7, 5, -4, pick(9, 14)]);

  /* ----------------------------- Écrans ---------------------------- */
  const sheetUp = tween(f, ORDER.tapCard + 5, ORDER.tapCard + 23, 1, 0, EASE.out);
  const sheetTop = captures.ficheSheet.y - captures.ficheScrollY;
  const swap = tween(f, ORDER.toForm, ORDER.toForm + 16, 0, 1, EASE.inOut);
  const scrollY = keys(
    f,
    [ORDER.toDate, ORDER.toDate + 20, ORDER.scroll, ORDER.scroll + 20],
    [form.pickY, form.dateY, form.dateY, form.submitY],
  );
  const tapY = (y: number, scroll: number, h: number) => y - scroll + h / 2;

  const step = STEPS.reduce((acc, s, i) => (f >= s.at ? i : acc), 0);

  return (
    <AbsoluteFill style={{ opacity: tween(frame, 0, S4_LEAD + 4, 0, 1) }}>
      <InkBackdrop glow={0.14}>
        <Photo photo="mini-cupcakes" blur zoom={1.3} style={{ inset: 0, opacity: 0.22 }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(18,12,9,0.2) 0%, rgba(18,12,9,0.9) 80%)" }} />
        <Glow x={px} y={pick(1200, 560)} size={pick(1500, 1300)} opacity={0.2} />
      </InkBackdrop>
      <GoldDust count={20} seed="commande" opacity={0.6} />

      {/* Étapes */}
      <div
        style={{
          position: "absolute",
          left: pick(72, 110),
          top: pick(266, 290),
          width: pick(W - 144, 500),
          opacity: 1 - exit,
          transform: `translateY(${-exit * 80}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Eyebrow at={S4_LEAD + 4} size={pick(29, 25)}>
            Commandez directement en ligne
          </Eyebrow>
          <div style={{ display: "flex", gap: 9 }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 34 : 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: i <= step ? COLORS.gold : "rgba(226,199,150,0.28)",
                  opacity: tween(f, 6 + i * 3, 18 + i * 3, 0, 1),
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ height: 26 }} />
        <div style={{ position: "relative", height: pick(170, 250) }}>
          {STEPS.map((s, i) => {
            const next = STEPS[i + 1]?.at;
            if (f < s.at - 2 || (next !== undefined && f > next + 16)) return null;
            return (
              <div key={i} style={{ position: "absolute", inset: 0 }}>
                <RevealLine
                  text={s.text}
                  at={S4_LEAD + s.at + (i === 0 ? 6 : 3)}
                  out={next === undefined ? undefined : S4_LEAD + next - 8}
                  duration={18}
                  stagger={2}
                  style={display(pick(74, 66))}
                />
              </div>
            );
          })}
        </div>
      </div>

      <AbsoluteFill style={{ perspective: 2600, opacity: 1 - exit, transform: `scale(${1 - exit * 0.08})` }}>
        <Phone
          scale={scale}
          style={{
            left: px,
            top: py,
            transform: `scale(${scale}) rotateY(${rotY}deg) rotateX(${4 - push * 2}deg)`,
            filter: sent > 0.02 ? `brightness(${1 - sent * 0.42})` : undefined,
          }}
        >
          {/* Page « Nos créations » puis fiche des Mini-cupcakes */}
          {swap < 1 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${-swap * 110}px)`, opacity: 1 - swap }}>
              <Screen name="m-creations-mignardises-ecran" />
              {sheetUp < 1 && (
                <>
                  <AbsoluteFill style={{ backgroundColor: COLORS.ink, opacity: 0.6 * (1 - sheetUp) }} />
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: sheetTop,
                      width: PHONE.width,
                      height: PHONE_VIEWPORT - sheetTop,
                      overflow: "hidden",
                      borderRadius: "16px 16px 0 0",
                      transform: `translateY(${sheetUp * (PHONE_VIEWPORT - sheetTop)}px)`,
                    }}
                  >
                    <Screen name="m-fiche-produit" style={{ top: -sheetTop }} />
                  </div>
                </>
              )}
              <Tap
                x={captures.ficheCard.x + captures.ficheCard.w / 2}
                y={captures.ficheCard.y - captures.ficheScrollY + 130}
                frame={f}
                at={ORDER.tapCard}
              />
            </div>
          )}

          {/* Formulaire de demande */}
          {swap > 0 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - swap) * PHONE.width}px)` }}>
              <PageScroll page="m-apropos-page" scrollY={scrollY} viewportHeight={PHONE_VIEWPORT} />
              {/* États « avant » : liste non cochée, puis date encore vide */}
              {f < ORDER.tapPick + 12 && (
                <Screen name="m-form-1-liste" style={{ opacity: tween(f, ORDER.tapPick + 4, ORDER.tapPick + 10, 1, 0) }} />
              )}
              {f >= ORDER.toDate + 20 && f < ORDER.tapDate + 12 && (
                <Screen name="m-form-2-date-vide" style={{ opacity: tween(f, ORDER.tapDate + 4, ORDER.tapDate + 10, 1, 0) }} />
              )}
              {f > ORDER.tapSend && (
                <Screen name="m-form-3-envoye" style={{ opacity: tween(f, ORDER.tapSend + 3, ORDER.tapSend + 9, 0, 1) }} />
              )}
              <Tap x={form.pick.x + 9} y={form.pick.y - form.pickY + 9} frame={f} at={ORDER.tapPick} />
              <Tap x={250} y={tapY(form.date.y, form.dateY, form.date.h)} frame={f} at={ORDER.tapDate} />
              <Tap x={form.submit.x + form.submit.w / 2} y={tapY(form.submit.y, form.submitY, form.submit.h)} frame={f} at={ORDER.tapSend} />
              {/* Halo autour de l'élément en cours de saisie */}
              {[
                { box: form.pickRow, scroll: form.pickY, from: ORDER.tapPick + 4, to: ORDER.toDate },
                { box: form.date, scroll: form.dateY, from: ORDER.tapDate + 4, to: ORDER.scroll },
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: h.box.x - 6,
                    top: h.box.y - h.scroll - 5,
                    width: h.box.w + 12,
                    height: h.box.h + 10,
                    borderRadius: 12,
                    border: `2px solid ${COLORS.gold}`,
                    boxShadow: "0 0 0 5px rgba(202,165,108,0.22)",
                    opacity: Math.min(tween(f, h.from, h.from + 8, 0, 1), tween(f, h.to - 6, h.to, 1, 0)),
                  }}
                />
              ))}
            </div>
          )}
        </Phone>

        {/* Le message préparé sort du téléphone */}
        {f >= ORDER.message && (
          <div
            style={{
              position: "absolute",
              left: pick(W / 2, 1420),
              top: pick(1090, 548),
              width: 0,
              height: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${(1 - sent) * pick(260, 120)}px) scale(${0.5 + sent * 0.5}) rotateY(${(1 - sent) * -24 - 3}deg)`,
              opacity: tween(f, ORDER.message, ORDER.message + 12, 0, 1),
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <MessageCard t={f - ORDER.message} width={pick(900, 760)} />
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Suite donnée par La Marilyn */}
      <div
        style={{
          position: "absolute",
          left: pick(72, 110),
          top: pick(416, 650),
          width: pick(W - 144, 500),
          opacity: tween(f, ORDER.message + 24, ORDER.message + 38, 0, 1) * (1 - exit),
          fontFamily: SANS,
          fontSize: pick(34, 29),
          lineHeight: 1.35,
          color: COLORS.goldLight,
        }}
      >
        Nous finalisons le reste avec vous,
        <br />
        avec le plus grand soin.
      </div>
    </AbsoluteFill>
  );
};
