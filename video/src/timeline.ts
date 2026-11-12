/**
 * Découpage du film. Tout est calé sur la musique : 90 BPM à 30 i/s, soit
 * 20 images par temps et 80 images par mesure. Chaque séquence commence
 * sur le premier temps d'une mesure (voir scripts/audio/build_audio.py).
 */
export const FPS = 30;
export const BEAT = 20;
export const BAR = 4 * BEAT;
export const DURATION = 15 * BAR; // 1200 images = 40 s

/** Image de début d'une mesure (numérotée à partir de 1). */
export const bar = (n: number, beat = 0) => (n - 1) * BAR + beat * BEAT;

export const SEQ = {
  accroche: { from: bar(1), to: bar(3) }, //   0,00 →  5,33 s
  revelation: { from: bar(3), to: bar(6) }, //  5,33 → 13,33 s
  creations: { from: bar(6), to: bar(10) }, // 13,33 → 24,00 s
  commande: { from: bar(10), to: bar(13) }, // 24,00 → 32,00 s
  final: { from: bar(13), to: DURATION }, //   32,00 → 40,00 s
} as const;

/**
 * Voix off : image de départ et durée (secondes) de chaque réplique.
 * La phrase des services est découpée en cinq : chaque service est dit au
 * moment où son univers apparaît (séquence 3, un univers toutes les 2 s).
 */
const S3 = SEQ.creations.from;
export const VOICE = [
  { id: "vo-1", from: 39, seconds: 2.88, text: "Vos envies gourmandes méritent toute notre attention." },
  { id: "vo-2", from: 196, seconds: 3.82, text: "La Marilyn vous ouvre les portes de son nouvel univers en ligne." },
  { id: "vo-3a", from: S3 + 6, seconds: 1.37, text: "Du cake design," },
  { id: "vo-3b", from: S3 + 3 * BEAT + 6, seconds: 1.38, text: "des gâteaux gourmands," },
  { id: "vo-3c", from: S3 + 6 * BEAT + 5, seconds: 1.69, text: "des mignardises et des crêpes," },
  { id: "vo-3d", from: S3 + 9 * BEAT + 8, seconds: 1.26, text: "des coffrets cadeaux," },
  { id: "vo-3e", from: S3 + 12 * BEAT + 8, seconds: 1.81, text: "et des buffets pour tous vos événements." },
  { id: "vo-4", from: 729, seconds: 5.93, text: "Commandez directement depuis notre site, en quelques instants. Nous finalisons ensuite votre commande avec vous." },
  { id: "vo-5", from: 990, seconds: 3.9, text: "Le nouveau site La Marilyn est en ligne. Commandez dès maintenant." },
] as const;
