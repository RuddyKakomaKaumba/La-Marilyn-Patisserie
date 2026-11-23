/**
 * Tutoriel « Votre commande, en quelques clics » : découpage du film.
 *
 * Tout est calé sur la musique (afro-house, 120 BPM à 30 i/s) : un temps =
 * 15 images, une mesure = 60 images. Le film dure 25 mesures (50 s) ; chaque
 * étape commence sur un premier temps et chaque geste tombe sur un temps
 * (voir scripts/tutoriel/build_music.py).
 *
 * Pour ajuster le rythme : modifier SEQ, puis les repères d'action (CUE),
 * qui pilotent à la fois l'image (gestes, caméra) et les effets sonores.
 */
import voix from "./data/voix.json";

export const FPS = 30;
export const BEAT = 15;
export const BAR = 4 * BEAT;
export const DURATION = 25 * BAR; // 1500 images = 50 s

/** Image de début d'une mesure (numérotée à partir de 1), et d'un temps. */
export const bar = (n: number, beat = 0) => (n - 1) * BAR + beat * BEAT;

export const SEQ = {
  accroche: { from: bar(1), to: bar(4) }, //    0 →  6 s (drop à 4 s)
  decouvrir: { from: bar(4), to: bar(8) }, //   6 → 14 s
  panier: { from: bar(8), to: bar(13) }, //    14 → 24 s
  consulter: { from: bar(13), to: bar(17) }, // 24 → 32 s
  whatsapp: { from: bar(17), to: bar(22) }, //  32 → 42 s
  final: { from: bar(22), to: DURATION }, //    42 → 50 s
} as const;

/** Titres d'étape plein cadre, sur le premier temps de chaque étape. */
export const STEP_CARDS = [SEQ.decouvrir.from, SEQ.panier.from, SEQ.consulter.from, SEQ.whatsapp.from];

/**
 * Repères d'action, en images absolues (presque tous sur un temps). Chaque
 * geste à l'écran (toucher, défilement, ouverture) et son effet sonore
 * partent de ces valeurs.
 */
export const CUE = {
  // 1. Accroche : montage des créations sur le temps, puis la photo devient le site
  montage: 0,
  photoToSite: 100,
  phoneIn: bar(3),
  // 2. Découvrir les créations
  tapDecouvrir: bar(4, 2),
  navCreations: bar(4, 2) + 5,
  chips: bar(5),
  fastScroll: bar(5, 3),
  rewind: bar(6, 1) + 3,
  onCard: bar(6, 3),
  tapCard: bar(7, 1),
  ficheOpen: bar(7, 1) + 4,
  // 3. Ajouter au panier
  ficheScroll: bar(8) + 10,
  tapAdd: bar(8, 3),
  added: bar(8, 3) + 2,
  ficheScroll2: bar(9),
  tapContinue: bar(9, 2),
  sheetClose: bar(9, 2) + 2,
  float1: bar(9, 3) + 4,
  toMignardises: bar(10) - 8,
  tapBurger: bar(10, 2) + 3,
  burgerAdded: bar(10, 2) + 5,
  multi: bar(11, 2),
  tapFloat: bar(12, 3) + 2,
  // 4. Consulter le panier
  drawerOpen: bar(12, 3) + 6,
  rows: bar(13, 1),
  tapPlus: bar(14, 2),
  plusDone: bar(14, 2) + 3,
  total: bar(14, 3),
  tapFinaliser: bar(16, 2) + 10,
  // 5. Finaliser sur WhatsApp
  navCommande: bar(16, 3),
  toInfos: bar(17) + 10,
  typeName: bar(17, 2) + 6,
  tapDate: bar(18) + 3,
  dateShown: bar(18) + 8,
  toMode: bar(18, 1) + 5,
  tapLivraison: bar(18, 3),
  typePlace: bar(18, 3) + 6,
  toSubmit: bar(19, 1),
  tapSend: bar(19, 3),
  message: bar(19, 3) + 6,
  // 6. Conclusion
  finalIn: bar(22),
} as const;

type VoiceKey = keyof typeof voix;
type Word = [string, number, number];

/**
 * Voix off : image de départ de chaque réplique (durées et mots mesurés
 * sur les fichiers, dans data/voix.json). Le texte est celui du script
 * (VOIX-OFF-TUTORIEL.md), qui sert aussi aux sous-titres.
 */
const LINES: { id: VoiceKey; from: number; text: string }[] = [
  { id: "vo-1", from: 8, text: "Commander vos gourmandises chez La Marilyn, c’est désormais plus simple." },
  { id: "vo-2", from: 190, text: "Rendez-vous sur notre site, parcourez nos créations et choisissez ce qui vous fait plaisir." },
  { id: "vo-3", from: 432, text: "Ajoutez vos produits au panier." },
  { id: "vo-4", from: 528, text: "Vous pouvez choisir plusieurs gourmandises et ajuster les quantités selon vos besoins." },
  { id: "vo-5", from: 735, text: "Retrouvez tous vos choix au même endroit, ajustez les quantités et consultez le montant de votre panier." },
  { id: "vo-6", from: 970, text: "Une fois votre panier prêt, envoyez votre demande sur WhatsApp." },
  { id: "vo-7", from: 1140, text: "La Marilyn vérifie les détails avec vous et confirme votre commande." },
  { id: "vo-8", from: 1278, text: "La Marilyn, l’art du gâteau. Retrouvez toutes nos créations en ligne." },
];

export const VOICE = LINES.map((l) => {
  const v = voix[l.id] as unknown as { seconds: number; words?: Word[] };
  return { ...l, seconds: v.seconds, words: (v.words ?? []) as Word[] };
});
