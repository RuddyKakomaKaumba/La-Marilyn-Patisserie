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
 * La phrase des services est découpée en quatre : chaque service est dit
 * au moment où son univers apparaît (séquence 3, voir S3_CUTS).
 */
const S3 = SEQ.creations.from;
export const VOICE = [
  { id: "vo-1", from: 39, seconds: 3.08, text: "Les plus beaux moments ont toujours un goût de fête." },
  { id: "vo-2", from: 192, seconds: 4.996, text: "Pour les célébrer, La Marilyn vous ouvre les portes de son nouvel univers en ligne." },
  { id: "vo-3a", from: S3 + 8, seconds: 2.083, text: "Des gâteaux pour vos plus belles occasions," },
  { id: "vo-3b", from: S3 + 84, seconds: 2.408, text: "des pâtisseries pour célébrer vos moments précieux," },
  { id: "vo-3c", from: S3 + 169, seconds: 2.689, text: "des mignardises à partager, des coffrets à offrir," },
  { id: "vo-3d", from: S3 + 256, seconds: 2.034, text: "et des buffets pour sublimer vos événements." },
  { id: "vo-4", from: 728, seconds: 7.047, text: "Désormais, commandez directement en ligne, en quelques instants. Nous finalisons le reste avec vous, avec le plus grand soin." },
  { id: "vo-5", from: 988, seconds: 4.451, text: "La Marilyn. L’art du gâteau, à portée de main. Commandez dès maintenant." },
] as const;
