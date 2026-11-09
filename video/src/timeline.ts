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

/** Voix off : image de départ et durée (secondes) de chaque réplique. */
export const VOICE = [
  { id: "vo-1", from: 39, seconds: 2.75, text: "Vos envies gourmandes méritent toute notre attention." },
  { id: "vo-2", from: 196, seconds: 3.65, text: "La Marilyn vous ouvre les portes de son nouvel univers en ligne." },
  { id: "vo-3", from: 418, seconds: 5.89, text: "Explorez nos créations, trouvez l’inspiration et imaginez les gourmandises de votre prochain événement." },
  { id: "vo-4", from: 729, seconds: 6.96, text: "Préparez votre demande directement sur notre site. Nous échangeons ensuite avec vous pour finaliser votre commande." },
  { id: "vo-5", from: 992, seconds: 3.69, text: "Le nouveau site La Marilyn est en ligne. Découvrez-le dès maintenant." },
] as const;
