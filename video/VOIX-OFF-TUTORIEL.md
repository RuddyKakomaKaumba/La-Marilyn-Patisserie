# Tutoriel « Votre commande, en quelques clics » : script final

Vidéo verticale de 50 secondes (1080 × 1920, 30 i/s), montée sur une
musique afro-house à 120 BPM. Voix féminine, française, chaleureuse et
enjouée. « Marilyn » se prononce « Mariline ».

## Narration

| Séquence | Début | Voix off |
| --- | --- | --- |
| 1. Accroche | 0,3 s | Commander vos gourmandises chez La Marilyn, c’est désormais plus simple. |
| 2. Découvrir les créations | 6,3 s | Rendez-vous sur notre site, parcourez nos créations et choisissez ce qui vous fait plaisir. |
| 3. Ajouter au panier | 14,4 s | Ajoutez vos produits au panier. |
| | 17,6 s | Vous pouvez choisir plusieurs gourmandises et ajuster les quantités selon vos besoins. |
| 4. Consulter le panier | 24,5 s | Retrouvez tous vos choix au même endroit, ajustez les quantités et consultez le montant de votre panier. |
| 5. Finaliser sur WhatsApp | 32,3 s | Une fois votre panier prêt, envoyez votre demande sur WhatsApp. |
| | 38,0 s | La Marilyn vérifie les détails avec vous et confirme votre commande. |
| 6. Conclusion | 42,6 s | La Marilyn, l’art du gâteau. Retrouvez toutes nos créations en ligne. |

Les sous-titres reprennent ce texte mot pour mot, synchronisés sur la voix.

## Textes à l’écran

- Accroche (un mot par temps, sur quatre créations) : VOS · GOURMANDISES ·
  EN QUELQUES · CLICS
- Titres d’étape plein cadre : ÉTAPE 1 / 4 CHOISISSEZ · ÉTAPE 2 / 4 AJOUTEZ
  AU PANIER · ÉTAPE 3 / 4 VÉRIFIEZ VOTRE PANIER · ÉTAPE 4 / 4 ENVOYEZ SUR
  WHATSAPP
- Étapes : Étape 1 sur 4 Choisissez · Étape 2 sur 4 Ajoutez au panier ·
  Étape 3 sur 4 Vérifiez votre panier · Étape 4 sur 4 Envoyez sur WhatsApp
- Défilement : noms des sections du site (Gâteaux gourmands, Cake Design,
  Mignardises, Crêpes, L’Écrin gourmand, Buffets)
- Ajout direct : 10 pièces ajoutées : le minimum requis
- Plusieurs gourmandises, un seul panier.
- Message : Votre commande, en un seul message · Préparé par le site, prêt à
  être envoyé · La Marilyn vous confirme la disponibilité et le montant
  définitif.
- Conclusion : LA MARILYN · L’ART DU GÂTEAU · Découvrez notre site ·
  la-marilyn-patisserie.vercel.app · QR code

## Parcours montré (site public, version classique)

1. Accueil, bouton « Découvrir nos créations ».
2. Nos créations : catégories, puis la carte du Moelleux au chocolat
   (5 000 FCFA) et sa fiche.
3. Fiche : « Ajouter au panier » (1 gâteau, sous-total 5 000 FCFA), puis
   « Continuer mes achats » ; le bouton du panier affiche 1.
4. Mini burgers : « Ajouter au panier » depuis la carte, qui ajoute
   directement le minimum de 10 pièces (650 FCFA la pièce) ; le panier
   affiche 2.
5. Panier : deux lignes, quantités, sous-totaux, total 11 500 FCFA ; « + »
   sur le Moelleux : 2 gâteaux, total 16 500 FCFA ; « Finaliser ma commande ».
6. Ma commande : nom, date souhaitée (05/12/2026), livraison
   (Bonapriso, Douala), « Envoyer ma commande sur WhatsApp ».
7. Message préparé par le site : texte exact, récupéré sans être envoyé.

Données saisies pour la démonstration : prénom fictif « Aminata ». Aucun
paiement en ligne, aucune réservation ni confirmation automatique n’est
montré : le message rappelle que la demande ne vaut pas réservation.

## Remplacer la voix

Texte et réglages : `scripts/tutoriel/voiceover.json`. Fichiers :
`public/tutoriel/audio/vo-1.wav` à `vo-8.wav` (même noms pour un
enregistrement en studio). Après modification, reporter les départs dans
`src/tutoriel/timeline.ts` (tableau `LINES`), puis relancer le rendu.
