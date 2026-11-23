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
│  ├─ components/         téléphone, navigateur, typographie animée, lumières, photo, logo, QR code
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
│  ├─ audio/              voix off (voiceover.json, generate_voice.py) et musique + effets (build_audio.py)
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
| 3. Les services | 13,3 à 24 s | Quatre univers en motion design (arches, cercles, anneaux dorés) : gâteaux, pâtisseries, mignardises et coffrets, buffets. La voix dit une phrase par univers |
| 4. La commande | 24 à 32 s | « Commandez directement en ligne » : fiche des Mini-cupcakes, formulaire, date souhaitée, envoi du message sur WhatsApp |
| 5. Le final | 32 à 40 s | Logo, signature, appel « Commandez dès maintenant » et QR code vers le site |

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

Uniquement ce que le site fait réellement : la fiche des Mini-cupcakes, le
formulaire « Préparer ma demande » (Mini-cupcakes cochés), le choix de la
date et le bouton « Envoyer sur WhatsApp ». Le message affiché est le texte
exact produit par le formulaire lors de la capture (`src/data/captures.json`),
y compris la mention « cette demande ne vaut pas réservation ». Aucun
paiement ni confirmation automatique n'est représenté.

## QR code

Le plan final et la couverture portent un QR code vers
`https://la-marilyn-patisserie.vercel.app` (`src/data/qr.json`, dessiné par
`src/components/QrCode.tsx`). Pour une autre adresse, régénérer la matrice
avec `segno` (niveau de correction Q) et remplacer `rows` dans ce fichier.

## Ressources et droits

| Ressource | Origine | Droits |
| --- | --- | --- |
| Photographies | `public/images` du site (22 visuels) | Propriété de La Marilyn |
| Logo | `public/images/logo-la-marilyn.png` | Propriété de La Marilyn |
| Captures d'interface | Site en production, la-marilyn-patisserie.vercel.app | Propriété de La Marilyn |
| Typographies | Newsreader, DM Sans (Google Fonts) | SIL Open Font License |
| Musique et effets sonores | Composés et synthétisés par `scripts/audio/build_audio.py`, sans aucun échantillon tiers | Œuvre du projet, exploitation libre |
| Voix off | Synthèse neuronale locale : Chatterbox Multilingual (Resemble AI, licence MIT). Timbre donné par `scripts/audio/reference-timbre.wav`, extrait de la voix libre « jessica » (Piper, corpus UPMC, CC BY-SA 4.0) | Usage commercial autorisé. Attribution du corpus : UPMC / MaryTTS (github.com/marytts/upmc-pierre-data). Chatterbox ajoute au son un filigrane inaudible signalant une voix de synthèse |
| Remotion | Moteur de rendu | Gratuit pour les particuliers et les structures de trois personnes au plus ; au-delà, une licence entreprise est requise (remotion.dev/license) |

### Régénérer la voix

```bash
# Moteur de synthèse (Python 3.11) et contrôle par transcription
uv venv -p 3.11 .venv-voix && uv pip install --python .venv-voix/bin/python chatterbox-tts "setuptools<81" \
  --extra-index-url https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match
python3 -m venv .venv-qc && .venv-qc/bin/pip install faster-whisper soundfile scipy numpy

# 1. Plusieurs prises par réplique  2. Choix de la plus fidèle, découpe, finition
.venv-voix/bin/python scripts/audio/generate_voice.py takes --out /tmp/prises
.venv-qc/bin/python scripts/audio/generate_voice.py select --takes /tmp/prises
```

Les durées obtenues sont écrites dans `scripts/audio/voiceover-durations.json` ;
les reporter dans `src/timeline.ts`.

---

# Tutoriel « Votre commande, en quelques clics »

Second film du projet : un tutoriel pédagogique du panier multi-produits,
réalisé à partir du parcours réel sur le site public. Il partage le moteur
Remotion, les typographies et les composants de ce dossier, mais vit dans
ses propres sous-dossiers (`tutoriel`).

## Livrables (`exports/tutoriel/`)

| Fichier | Contenu |
| --- | --- |
| `la-marilyn-tutoriel-vertical.mp4` | 1080 × 1920, 30 i/s, 58,7 s, H.264 + AAC : voix, musique, effets et sous-titres intégrés |
| `la-marilyn-tutoriel-voix-off.flac` | Voix off seule, calée sur la vidéo (sans perte ; `npm run tutoriel:voix` produit le WAV) |
| `la-marilyn-tutoriel-couverture.jpg` | Couverture Instagram, 1080 × 1920 |

Script et textes : [`VOIX-OFF-TUTORIEL.md`](./VOIX-OFF-TUTORIEL.md).

## Commandes

```bash
npm run studio               # prévisualisation interactive (composition TutorielVertical)
npm run tutoriel:apercu      # planche de six images, sans rendu complet
npm run tutoriel:render      # vidéo finale
npm run tutoriel:voix        # piste de voix seule
npm run tutoriel:couverture  # couverture Instagram
npm run tutoriel:captures    # recapture du parcours sur le site public
npm run tutoriel:musique     # musique et effets
```

## Organisation

```
src/tutoriel/
├─ Tutoriel.tsx        composition : fond, plan-séquence, conclusion, sous-titres, son
├─ timeline.ts         séquences, repères d'action (CUE) et départs de la voix
├─ layout.ts           zones du format vertical (titre, écran, sous-titres)
├─ screens.tsx         l'écran du site, image par image, reconstitué depuis les captures
├─ Soundtrack.tsx      voix, musique atténuée sous la voix, effets synchronisés
├─ Cover.tsx           couverture Instagram
├─ sequences/          Parcours (caméra du plan-séquence, loupes, cartes) et Final
├─ components/         téléphone et caméra, pages en tuiles, fenêtres, surbrillances,
│                      toucher, loupe, en-tête d'étapes, sous-titres, carte du message
└─ data/               mesures du site (parcours.json, pages.json) et voix (voix.json)
public/tutoriel/       captures du site (tuiles comprises) et audio
scripts/tutoriel/      capture-parcours.cjs, prepare.py, build_music.py, voiceover.json
```

Ajuster le film :
- **durées et rythme** : `SEQ` et `CUE` dans `src/tutoriel/timeline.ts` ;
  les gestes, la caméra et les effets sonores suivent ces repères ;
- **voix et sous-titres** : `scripts/tutoriel/voiceover.json`, puis les
  départs dans `timeline.ts` ; les sous-titres se recalculent seuls ;
- **caméra** : tableau `CAM` dans `sequences/Parcours.tsx` (point visé, zoom,
  inclinaison) ;
- **déclinaison horizontale** : ajouter un jeu de valeurs dans `layout.ts`
  et une composition 1920 × 1080 ; l'écran du site et la caméra sont
  indépendants du format.

## Fidélité au site

- Captures prises sur https://la-marilyn-patisserie.vercel.app (version
  classique, panier multi-produits en ligne), en lecture seule. Le panier
  vit dans le navigateur de capture ; l'ouverture de WhatsApp est
  interceptée : aucun message n'est envoyé.
- Le message affiché est le texte exact préparé par le site
  (`src/tutoriel/data/parcours.json`).
- Les interfaces ne sont pas redessinées : loupes et surbrillances
  agrandissent ou soulignent les captures réelles.
- Produits choisis pour leurs prix stables : Moelleux au chocolat
  (5 000 FCFA) et Mini burgers (650 FCFA la pièce, minimum 10), identiques
  en ligne et dans les tarifs confirmés le 15 novembre.

## Technologies et ressources

| Élément | Outil ou origine | Droits |
| --- | --- | --- |
| Montage, animation, rendu | Remotion 4 (React), Chrome sans interface, FFmpeg | Licence Remotion (gratuite jusqu'à trois personnes) |
| Captures du parcours | Playwright, mobile 390 × 844 à 3× | Interface La Marilyn |
| Photographies, logo | Site La Marilyn (`public/images`) | Propriété de La Marilyn |
| Typographies | Newsreader, DM Sans | SIL Open Font License |
| Voix off | Chatterbox Multilingual (Resemble AI, MIT), timbre de référence issu de la voix libre « jessica » (corpus UPMC, CC BY-SA 4.0) ; meilleure prise choisie par transcription faster-whisper | Usage commercial autorisé ; filigrane inaudible de voix de synthèse |
| Musique et effets | Synthétisés par `scripts/tutoriel/build_music.py` (numpy, scipy), aucun échantillon tiers | Œuvre du projet |
| Sous-titres | Texte du script, minutage par alignement sur les mots de la voix | |
| QR code | segno | |
