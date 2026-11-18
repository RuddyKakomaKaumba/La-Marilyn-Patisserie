import { FESTIVE } from "@/lib/seasonal";

/*
 * Décor du hero (thème des fêtes) : guirlande lumineuse en festons,
 * paillettes dorées qui s'élèvent et halo chaleureux. Purement décoratif
 * (aria-hidden), transparent aux clics, animations en CSS uniquement
 * (app/seasonal.css), coupées si prefers-reduced-motion.
 */

const SWAGS = 4;
const BULBS_PER_SWAG = 6;
const TOP = 6;
const CONTROL = 150; // creux du feston ≈ 78 % de la hauteur
const COLORS = ["gold", "red", "snow", "green"] as const;

const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t ** 2 * b;

const STRING = Array.from({ length: SWAGS }, (_, i) => {
  const x0 = (i * 1000) / SWAGS;
  const x1 = ((i + 1) * 1000) / SWAGS;
  return `${i === 0 ? `M${x0} ${TOP}` : ""} Q${(x0 + x1) / 2} ${CONTROL} ${x1} ${TOP}`;
}).join(" ");

const BULBS = Array.from({ length: SWAGS * BULBS_PER_SWAG }, (_, k) => {
  const i = Math.floor(k / BULBS_PER_SWAG);
  const t = ((k % BULBS_PER_SWAG) + 0.5) / BULBS_PER_SWAG;
  const x0 = (i * 1000) / SWAGS;
  const x1 = ((i + 1) * 1000) / SWAGS;
  return {
    left: quad(x0, (x0 + x1) / 2, x1, t) / 10,
    top: quad(TOP, CONTROL, TOP, t),
    color: COLORS[k % COLORS.length],
    delay: ((k * 37) % 23) / 10,
  };
});

// Positions fixes (pas d'aléatoire : rendu identique serveur / client).
const SPARKS = [
  [8, 78, 0, 3],
  [16, 64, 2.4, 2],
  [24, 86, 1.1, 4],
  [33, 72, 3.6, 2],
  [41, 90, 0.6, 3],
  [52, 70, 2.9, 2],
  [58, 84, 4.2, 3],
  [64, 62, 1.7, 4],
  [70, 80, 3.1, 2],
  [76, 68, 0.3, 3],
  [83, 88, 2.2, 2],
  [90, 74, 4.8, 3],
  [95, 60, 1.4, 2],
  [46, 58, 5.2, 2],
];

export default function HeroFestive() {
  if (!FESTIVE) return null;
  return (
    <div aria-hidden="true" className="hero-festive">
      <div className="hero-festive__glow" />
      <div className="hero-festive__garland">
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path d={STRING} vectorEffect="non-scaling-stroke" />
        </svg>
        {BULBS.map((b, i) => (
          <span
            key={i}
            className="hero-festive__bulb"
            data-color={b.color}
            style={
              {
                left: `${b.left}%`,
                top: `${(b.top / 120) * 100}%`,
                "--d": `${b.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {SPARKS.map(([x, y, d, s], i) => (
        <span
          key={i}
          className="hero-festive__spark"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--d": `${d}s`,
              "--s": `${s}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
