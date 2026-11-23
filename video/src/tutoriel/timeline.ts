/**
 * Tutoriel « Votre commande, en quelques clics » : découpage du film.
 *
 * Tout est calé sur la musique (90 BPM à 30 i/s) : un temps = 20 images,
 * une mesure = 80 images. Le film dure 22 mesures (58,7 s) et chaque
 * séquence commence sur un premier temps (voir scripts/tutoriel/build_music.py).
 *
 * Pour ajuster le rythme : modifier SEQ, puis les repères d'action (CUE),
 * qui pilotent à la fois l'image (gestes, caméra) et les effets sonores.
 */
import voix from "./data/voix.json";

export const FPS = 30;
export const BEAT = 20;
export const BAR = 4 * BEAT;
export const DURATION = 22 * BAR; // 1760 images = 58,7 s

/** Image de début d'une mesure (numérotée à partir de 1). */
export const bar = (n: number, beat = 0) => (n - 1) * BAR + beat * BEAT;

export const SEQ = {
  accroche: { from: bar(1), to: bar(3) }, //     0,0 →  5,3 s
  decouvrir: { from: bar(3), to: bar(7) }, //    5,3 → 16,0 s
  panier: { from: bar(7), to: bar(12) }, //     16,0 → 29,3 s
  consulter: { from: bar(12), to: bar(16) }, // 29,3 → 40,0 s
  whatsapp: { from: bar(16), to: bar(20) }, //  40,0 → 50,7 s
  final: { from: bar(20), to: DURATION }, //    50,7 → 58,7 s
} as const;

/**
 * Repères d'action, en images absolues. Chaque geste à l'écran (toucher,
 * défilement, ouverture) et son effet sonore partent de ces valeurs.
 */
export const CUE = {
  // 1. Accroche : la photo devient le site, puis le téléphone apparaît
  photoToSite: 96,
  phoneIn: 112,
  // 2. Découvrir les créations
  tapDecouvrir: 196,
  navCreations: 204,
  chips: 232,
  fastScroll: 300,
  rewind: 352,
  onCard: 386,
  tapCard: 440,
  ficheOpen: 446,
  // 3. Ajouter au panier
  ficheScroll: 486,
  tapAdd: 528,
  added: 532,
  ficheScroll2: 548,
  tapContinue: 586,
  sheetClose: 590,
  float1: 612,
  toMignardises: 626,
  tapBurger: 690,
  burgerAdded: 694,
  multi: 720,
  tapFloat: 862,
  // 4. Consulter le panier
  drawerOpen: 868,
  rows: 900,
  tapPlus: 996,
  plusDone: 1000,
  total: 1012,
  tapFinaliser: 1160,
  // 5. Finaliser sur WhatsApp
  navCommande: 1166,
  toInfos: 1192,
  typeName: 1222,
  tapDate: 1256,
  dateShown: 1262,
  toMode: 1270,
  tapLivraison: 1296,
  typePlace: 1304,
  toSubmit: 1332,
  tapSend: 1364,
  message: 1372,
  // 6. Conclusion
  finalIn: 1520,
} as const;

type VoiceKey = keyof typeof voix;
type Word = [string, number, number];

/**
 * Voix off : image de départ de chaque réplique (durées et mots mesurés
 * sur les fichiers, dans data/voix.json). Le texte est celui du script
 * (VOIX-OFF-TUTORIEL.md), qui sert aussi aux sous-titres.
 */
const LINES: { id: VoiceKey; from: number; text: string }[] = [
  { id: "vo-1", from: 14, text: "Commander vos gourmandises chez La Marilyn, c’est désormais plus simple." },
  { id: "vo-2", from: 178, text: "Rendez-vous sur notre site, parcourez nos créations et choisissez ce qui vous fait plaisir." },
  { id: "vo-3", from: 492, text: "Ajoutez vos produits au panier." },
  { id: "vo-4", from: 608, text: "Vous pouvez choisir plusieurs gourmandises et ajuster les quantités selon vos besoins." },
  { id: "vo-5", from: 890, text: "Retrouvez tous vos choix au même endroit, ajustez les quantités et consultez le montant de votre panier." },
  { id: "vo-6", from: 1206, text: "Une fois votre panier prêt, envoyez votre demande sur WhatsApp." },
  { id: "vo-7", from: 1382, text: "La Marilyn vérifie les détails avec vous et confirme votre commande." },
  { id: "vo-8", from: 1536, text: "La Marilyn, l’art du gâteau. Retrouvez toutes nos créations en ligne." },
];

export const VOICE = LINES.map((l) => {
  const v = voix[l.id] as unknown as { seconds: number; words?: Word[] };
  return { ...l, seconds: v.seconds, words: (v.words ?? []) as Word[] };
});
