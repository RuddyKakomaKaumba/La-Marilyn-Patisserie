import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import { SANS } from "../../fonts";
import { EASE, tween } from "../../lib/anim";
import { LAYOUT } from "../layout";
import { FPS, VOICE } from "../timeline";

type Chunk = { text: string; words: { w: string; s: number; e: number }[]; start: number; end: number };

const norm = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Longueur maximale d'un sous-titre (une ou deux lignes à l'écran). */
const MAX_CHARS = 32;

/**
 * Découpe une réplique en sous-titres : texte exact du script, rythme pris
 * sur les mots horodatés de la voix (alignement mot à mot, tolérant aux
 * mots mal reconnus). Coupe de préférence après une virgule ou un point.
 */
function chunksOf(text: string, words: [string, number, number][], from: number, seconds: number): Chunk[] {
  const script = text.split(/\s+/);
  // Alignement : chaque mot du script reçoit l'horodatage du mot reconnu
  // correspondant (ou, à défaut, une interpolation entre ses voisins).
  const times: ({ s: number; e: number } | null)[] = script.map(() => null);
  let j = 0;
  for (let i = 0; i < script.length; i++) {
    const target = norm(script[i]);
    for (let k = j; k < Math.min(words.length, j + 3); k++) {
      const got = norm(words[k][0]);
      if (got && (got === target || got.startsWith(target.slice(0, 4)) || target.startsWith(got.slice(0, 4)))) {
        times[i] = { s: words[k][1], e: words[k][2] };
        j = k + 1;
        break;
      }
    }
  }
  for (let i = 0; i < script.length; i++) {
    if (times[i]) continue;
    let a = i - 1;
    while (a >= 0 && !times[a]) a--;
    let b = i + 1;
    while (b < script.length && !times[b]) b++;
    const ta = a >= 0 ? times[a]!.e : 0;
    const tb = b < script.length ? times[b]!.s : seconds;
    const n = b - a;
    times[i] = { s: ta + ((tb - ta) * (i - a - 0.5)) / n, e: ta + ((tb - ta) * (i - a + 0.5)) / n };
  }
  const chunks: Chunk[] = [];
  const push = (idx: number[]) => {
    const ws = idx.map((i) => ({ w: script[i], s: from + times[i]!.s * FPS, e: from + times[i]!.e * FPS }));
    chunks.push({ text: ws.map((w) => w.w).join(" "), words: ws, start: ws[0].s, end: ws[ws.length - 1].e });
  };
  const len = (idx: number[]) => idx.map((k) => script[k]).join(" ").length;
  // 1. Propositions : on coupe après la ponctuation.
  const clauses: number[][] = [[]];
  script.forEach((w, i) => {
    clauses[clauses.length - 1].push(i);
    if (/[.,;:!?]$/.test(w) && i < script.length - 1) clauses.push([]);
  });
  // 2. Propositions courtes regroupées, longues coupées en parts égales.
  let cur: number[] = [];
  for (const cl of clauses) {
    if (cur.length && len([...cur, ...cl]) <= MAX_CHARS && len(cur) < 20) {
      cur = [...cur, ...cl];
      continue;
    }
    if (cur.length) push(cur);
    cur = cl;
    if (len(cur) > MAX_CHARS) {
      const parts = Math.ceil(len(cur) / MAX_CHARS);
      const target = len(cur) / parts;
      let start = 0;
      for (let p = 1; p < parts; p++) {
        // Coupe au plus près de la longueur visée.
        let best = start + 1;
        let bestGap = Infinity;
        for (let k = start + 1; k < cur.length; k++) {
          // Coupe naturelle : avant une conjonction ou après une virgule.
          const natural = /^(et|ou|pour|avec|selon|sur|chez)$/i.test(script[cur[k]]) || /,$/.test(script[cur[k - 1]]);
          const gap = Math.abs(len(cur.slice(start, k)) - target) - (natural ? 14 : 0);
          if (gap < bestGap) {
            bestGap = gap;
            best = k;
          }
        }
        push(cur.slice(start, best));
        start = best;
      }
      cur = cur.slice(start);
    }
  }
  if (cur.length) push(cur);
  return chunks;
}

export const CAPTIONS: Chunk[] = VOICE.flatMap((v) => chunksOf(v.text, v.words, v.from, v.seconds));

/**
 * Sous-titres intégrés, style Reels : gros caractères blancs, le mot
 * prononcé s'allume en or. Chaque groupe de mots apparaît d'un coup sec.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const i = CAPTIONS.findIndex((c, k) => {
    const next = CAPTIONS[k + 1];
    const end = Math.min(c.end + 10, next ? next.start - 1 : Infinity);
    return frame >= c.start - 3 && frame <= end;
  });
  if (i < 0) return null;
  const c = CAPTIONS[i];
  const next = CAPTIONS[i + 1];
  const end = Math.min(c.end + 10, next ? next.start - 1 : Infinity);
  const o = Math.min(tween(frame, c.start - 3, c.start, 0, 1), tween(frame, end - 3, end, 1, 0));
  const pop = tween(frame, c.start - 3, c.start + 4, 0.86, 1, EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: (LAYOUT.width - LAYOUT.captionWidth) / 2,
        width: LAYOUT.captionWidth,
        top: LAYOUT.captionY,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(-50%) scale(${pop})`,
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.18,
          textAlign: "center",
          letterSpacing: "-0.01em",
          maxWidth: LAYOUT.captionWidth,
          // Contour sombre : lisible sur n'importe quel fond
          textShadow: "0 0 3px rgba(18,12,9,0.95), 0 0 3px rgba(18,12,9,0.95), 0 4px 18px rgba(0,0,0,0.85)",
        }}
      >
        {c.words.map((w, k) => {
          const active = frame >= w.s - 2 && frame < (c.words[k + 1]?.s ?? c.end + 6) - 2;
          const said = frame >= w.s - 2;
          return (
            <span
              key={k}
              style={{
                display: "inline-block",
                color: active ? COLORS.goldLight : said ? COLORS.ivory : "rgba(251,247,241,0.82)",
                transform: `scale(${active ? 1.07 : 1})`,
                margin: "0 0.12em",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
