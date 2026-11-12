# Voix off : texte définitif

Film de lancement du site La Marilyn (40 secondes). Voix féminine, française,
ton chaleureux et posé. « Marilyn » se prononce « Mariline ».

| Séquence | Début | Texte |
| --- | --- | --- |
| 1. L'accroche | 1,3 s | Les plus beaux moments ont toujours un goût de fête. |
| 2. La révélation | 6,4 s | Pour les célébrer, La Marilyn vous ouvre les portes de son nouvel univers en ligne. |
| 3. Les services | 13,6 s | Des gâteaux pour vos plus belles occasions, des pâtisseries pour célébrer vos moments précieux, des mignardises à partager, des coffrets à offrir, et des buffets pour sublimer vos événements. |
| 4. La commande | 24,3 s | Désormais, commandez directement en ligne, en quelques instants. Nous finalisons le reste avec vous, avec le plus grand soin. |
| 5. Le final | 32,9 s | La Marilyn. L'art du gâteau, à portée de main. Commandez dès maintenant. |

Dans la séquence 3, chaque service est dit au moment où son univers apparaît
à l'image.

## Textes à l'écran

- Les plus beaux moments ont toujours un goût de fête.
- NOTRE NOUVEAU SITE EST EN LIGNE
- GÂTEAUX SUR MESURE : Des gâteaux pour vos plus belles occasions
- PÂTISSERIES : Des pâtisseries pour célébrer vos moments précieux
- MIGNARDISES · COFFRETS CADEAUX : Des mignardises à partager, des coffrets à offrir
- BUFFETS · ÉVÉNEMENTS : Des buffets pour sublimer vos événements
- COMMANDEZ DIRECTEMENT EN LIGNE : Choisissez vos gourmandises. Précisez votre demande. Indiquez la date souhaitée. Envoyez-la sur WhatsApp.
- Nous finalisons le reste avec vous, avec le plus grand soin.
- LA MARILYN · L'ART DU GÂTEAU · NOTRE NOUVEAU SITE EST EN LIGNE · Commandez dès maintenant · QR code · SCANNEZ POUR COMMANDER

## Modifier ou remplacer la voix

Le texte est dans `scripts/audio/voiceover.json` (`say` donne l'écriture
phonétique envoyée à la synthèse quand elle diffère du texte). Après une
modification : régénérer la voix (voir `README.md`), reporter les durées
dans `src/timeline.ts` (tableau `VOICE`), puis `npm run render`.

Pour utiliser une comédienne ou un autre service, déposer dans
`public/audio/` les fichiers `vo-1.wav`, `vo-2.wav`, `vo-3a.wav` à
`vo-3d.wav`, `vo-4.wav` et `vo-5.wav`.
