# Film de lancement du site La Marilyn

Projet [Remotion](https://www.remotion.dev) indépendant du site Next.js : il
vit dans `video/`, avec ses propres dépendances, et n'est ni compilé ni
déployé avec le site (`video` est exclu de `tsconfig.json`, d'ESLint et du
déploiement Vercel via `.vercelignore`).

## Livrables (`exports/`)

| Fichier | Format |
| --- | --- |
| `la-marilyn-lancement-vertical.mp4` | 1080 × 1920, 9:16, 30 i/s, 40 s, H.264 + AAC (Reels, TikTok, WhatsApp) |
| `la-marilyn-lancement-horizontal.mp4` | 1920 × 1080, 16:9, mise en page recomposée (Facebook, YouTube, écran) |
| `la-marilyn-couverture-reels.jpg` / `.png` | Couverture Instagram Reels, 1080 × 1920 |

Texte de la voix off : [`VOIX-OFF.md`](./VOIX-OFF.md).

## Commandes

```bash
cd video
npm install
npm run studio            # aperçu interactif, image par image
npm run render            # les deux vidéos et la couverture
npm run render:vertical   # ou un seul export
```

Remotion utilise son propre Chrome et FFmpeg. Les exports arrivent dans
`exports/`.

## Organisation

```
video/
├─ src/
│  ├─ Root.tsx            compositions : LancementVertical, LancementHorizontal, CouvertureReels
│  ├─ Film.tsx            montage des cinq séquences et de la bande-son
│  ├─ timeline.ts         découpage (calé sur la musique) et minutage de la voix off
│  ├─ Soundtrack.tsx      voix, musique (atténuée sous la voix), effets sonores
│  ├─ theme.ts, fonts.ts  couleurs et typographies du site
│  ├─ sequences/          S1Accroche, S2Revelation, S3Creations, S4Commande, S5Final
│  ├─ components/         téléphone, navigateur, typographie animée, lumières, photo, logo
│  ├─ lib/                courbes d'animation, format vertical ou horizontal
│  └─ data/               positions mesurées sur le site (générées par les scripts)
├─ public/
│  ├─ photos/             photographies du site utilisées par le film
│  ├─ captures/           captures du site en production (écrans, cartes, pages en tuiles)
│  ├─ audio/              voix off, musique, effets
│  ├─ brand/              logo officiel
│  └─ fonts/              Newsreader et DM Sans
├─ scripts/
│  ├─ capture-site.cjs    captures du site en production (lecture seule)
│  ├─ prepare-assets.py   copie des photos du site, tuiles de défilement
│  ├─ audio/              voix off (generate_voice.py) et musique + effets (build_audio.py)
│  ├─ preview.mjs, sheet.py, qc.sh   planches de contrôle
└─ exports/               vidéos et couverture
```

## Découpage

90 BPM à 30 i/s : un temps dure 20 images, une mesure 80. Le film fait
15 mesures et chaque séquence commence sur un premier temps.

| Séquence | Temps | Contenu |
| --- | --- | --- |
| 1. L'accroche | 0 à 5,3 s | Gros plan sur le médaillon de l'entremets, la caméra recule, logo et promesse |
| 2. La révélation | 5,3 à 13,3 s | La photo se pose exactement à sa place dans la page d'accueil : c'était déjà le site. Recul, écran, défilement réel |
| 3. Les créations | 13,3 à 24 s | Cake Design, Gâteaux gourmands, Mignardises et crêpes, L'Écrin gourmand, Buffets gourmands |
| 4. La commande | 24 à 32 s | Fiche d'une création, formulaire, date souhaitée, envoi du message sur WhatsApp |
| 5. Le final | 32 à 40 s | Logo, signature, adresse du site lisible pendant plus de cinq secondes |

Le format horizontal réutilise le même montage avec une mise en page propre
(`useFormat().pick(vertical, horizontal)` dans chaque séquence) : capture du
site en version bureau, fenêtre de navigateur, textes à gauche.

En vertical, les textes importants restent dans la zone sûre de Reels et de
TikTok (`SAFE` dans `src/lib/format.ts`).

## Modifier

- **Un texte, un minutage** : `src/timeline.ts` et la séquence concernée.
- **Une photo** : ajouter la source dans `SELECTION` (`scripts/prepare-assets.py`),
  relancer le script, puis utiliser la clé dans la séquence.
- **Le site a changé** : `node scripts/capture-site.cjs`, puis
  `python3 scripts/prepare-assets.py` (les longues captures `*-page.jpg`
  peuvent ensuite être supprimées, seules les tuiles servent).
- **La voix** : voir `VOIX-OFF.md`.
- **La musique** : `scripts/audio/build_audio.py` (accords, mélodie, rythmique,
  effets), puis `python3 scripts/audio/build_audio.py`.

## Ce que montre la séquence 4

Uniquement ce que le site fait réellement : la fiche du Moelleux au
chocolat, le formulaire « Préparer ma demande », le choix de la date et le
bouton « Envoyer sur WhatsApp ». Le message affiché est le texte exact
produit par le formulaire lors de la capture (`src/data/captures.json`), y
compris la mention « cette demande ne vaut pas réservation ». Aucun
paiement ni confirmation automatique n'est représenté.

## Ressources et droits

| Ressource | Origine | Droits |
| --- | --- | --- |
| Photographies | `public/images` du site (20 visuels) | Propriété de La Marilyn |
| Logo | `public/images/logo-la-marilyn.png` | Propriété de La Marilyn |
| Captures d'interface | Site en production, la-marilyn-patisserie.vercel.app | Propriété de La Marilyn |
| Typographies | Newsreader, DM Sans (Google Fonts) | SIL Open Font License |
| Musique et effets sonores | Composés et synthétisés par `scripts/audio/build_audio.py`, sans aucun échantillon tiers | Œuvre du projet, exploitation libre |
| Voix off | Synthèse neuronale locale : modèle Kokoro-82M (licence Apache 2.0), voix française `ff_siwis` entraînée sur le corpus SIWIS (CC BY 4.0) | Usage commercial autorisé. Attribution du corpus : SIWIS French Speech Synthesis Database, Université d'Édimbourg |
| Remotion | Moteur de rendu | Gratuit pour les particuliers et les structures de trois personnes au plus ; au-delà, une licence entreprise est requise (remotion.dev/license) |

### Régénérer la voix

```bash
python3 -m venv .venv && .venv/bin/pip install kokoro-onnx soundfile scipy numpy
# model.onnx et voices/ff_siwis.bin : huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
# (ff_siwis.bin est à convertir en archive numpy « voices.bin », clé ff_siwis)
.venv/bin/python scripts/audio/generate_voice.py --model-dir /chemin/vers/kokoro
```
