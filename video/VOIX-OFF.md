# Voix off : texte définitif

Film de lancement du site La Marilyn (40 secondes). Voix féminine, française,
ton chaleureux et posé. « Marilyn » se prononce « Mariline ».

| Séquence | Début | Texte |
| --- | --- | --- |
| 1. L'accroche | 1,3 s | Vos envies gourmandes méritent toute notre attention. |
| 2. La révélation | 6,5 s | La Marilyn vous ouvre les portes de son nouvel univers en ligne. |
| 3. Les créations | 13,5 s | Du cake design, des gâteaux gourmands, des mignardises et des crêpes, des coffrets cadeaux, et des buffets pour tous vos événements. |
| 4. La commande | 24,3 s | Commandez directement depuis notre site, en quelques instants. Nous finalisons ensuite votre commande avec vous. |
| 5. Le final | 33,0 s | Le nouveau site La Marilyn est en ligne. Commandez dès maintenant. |

Dans la séquence 3, chaque service est dit au moment où son univers apparaît
à l'image (un univers toutes les deux secondes).

## Textes à l'écran

- Vos envies gourmandes méritent toute notre attention.
- NOTRE NOUVEAU SITE EST EN LIGNE
- Cake Design · Gâteaux gourmands · Mignardises et crêpes · L'Écrin gourmand · Buffets gourmands
- COMMANDEZ DIRECTEMENT EN LIGNE : Choisissez votre création. Précisez votre demande. Indiquez la date souhaitée. Envoyez-la sur WhatsApp.
- Nous finalisons ensuite votre commande avec vous.
- LA MARILYN · L'ART DU GÂTEAU · NOTRE NOUVEAU SITE EST EN LIGNE · Commandez dès maintenant · la-marilyn-patisserie.vercel.app

## Modifier ou remplacer la voix

Le texte est dans `scripts/audio/voiceover.json` (`say` donne l'écriture
phonétique envoyée à la synthèse quand elle diffère du texte). Après une
modification : régénérer la voix (voir `README.md`), reporter les durées
dans `src/timeline.ts` (tableau `VOICE`), puis `npm run render`.

Pour utiliser une comédienne ou un autre service, déposer dans
`public/audio/` les fichiers `vo-1.wav`, `vo-2.wav`, `vo-3a.wav` à
`vo-3e.wav`, `vo-4.wav` et `vo-5.wav`.
