# La Marilyn — Site vitrine

Site de la pâtisserie La Marilyn (Next.js · TypeScript · Tailwind CSS).
Pages : Accueil (`/`), Nos créations (`/nos-creations`), À propos / Contact (`/a-propos`).

```bash
npm install
cp .env.example .env.local   # optionnel : active la galerie Instagram en local
npm run dev                  # http://localhost:3000
npm run build
```

## Structure

- `app/` — layout (polices, metadata SEO/Open Graph), pages, favicon
- `components/` — sections des pages (`about/`, `creations/`) et composants partagés
- `lib/site.ts` — WhatsApp, navigation, liens des réseaux sociaux
- `lib/instagram.ts` — récupération serveur des publications Instagram
- `lib/galleryPhotos.ts` — photos de la mosaïque « Quelques créations »
- `public/images/` — photographies et logo

## Galerie Instagram (« Quelques créations signées La Marilyn »)

La galerie de la page À propos affiche automatiquement les 6 dernières
publications de [@lamarilyn2](https://www.instagram.com/lamarilyn2). Chaque
visuel ouvre la publication d'origine dans un nouvel onglet.

### Fonctionnement

1. `getInstagramPosts()` (`lib/instagram.ts`) interroge l'API officielle Meta
   (`GET /{ig-user-id}/media`) **côté serveur uniquement**.
2. La réponse est mise en cache 30 min et la page est régénérée toutes les
   30 min (ISR). Les visiteurs ne déclenchent jamais d'appel direct à Meta.
3. Photos : `media_url`. Vidéos / reels : `thumbnail_url`. Carrousels :
   première image (ou vignette) de l'album. Les publications sans image
   exploitable (contenu protégé par droit d'auteur) sont ignorées.

### Si l'API Meta est indisponible

Ordre de priorité : publications fraîches → dernières publications en cache →
photos locales (`lib/galleryPhotos.ts`). Publications et photos locales
forment ensemble la rotation de la mosaïque. Aucune erreur n'est montrée aux visiteurs ; les erreurs sont
journalisées côté serveur avec le préfixe `[instagram]` (sans le jeton).

### Variables d'environnement

| Variable                 | Obligatoire | Description                                                                 |
| ------------------------ | ----------- | --------------------------------------------------------------------------- |
| `META_ACCESS_TOKEN`      | oui         | Jeton d'accès Meta au compte Instagram professionnel. **Secret.**           |
| `INSTAGRAM_ACCOUNT_ID`   | oui         | IG User ID du compte (identifiant numérique, pas « lamarilyn2 »).           |
| `META_GRAPH_API_HOST`    | non         | `graph.facebook.com` (défaut) ou `graph.instagram.com` (Instagram Login).   |
| `META_GRAPH_API_VERSION` | non         | Version de l'API Graph (défaut `v25.0`).                                    |
| `NEXT_PUBLIC_SITE_URL`   | conseillé   | URL publique du site (balises Open Graph).                                  |

- **Développement** : dans `.env.local` (ignoré par Git).
- **Production** : dans les variables d'environnement de l'hébergeur (ex.
  Vercel → Project → Settings → Environment Variables, environnement
  « Production »), puis redéployer.
- Ne jamais committer de vraies valeurs ni préfixer ces secrets par
  `NEXT_PUBLIC_` (ils seraient alors envoyés au navigateur).

### Configuration Meta (une fois)

Prérequis : le compte Instagram @lamarilyn2 doit être un **compte
professionnel** (Entreprise ou Créateur) relié à la Page Facebook
[lamarilyn2](https://www.facebook.com/lamarilyn2).

Méthode recommandée (jeton sans expiration) :

1. Sur [developers.facebook.com](https://developers.facebook.com), créer une
   application de type « Entreprise ».
2. Dans Meta Business Suite (Paramètres de l'entreprise), ajouter la Page et
   le compte Instagram, puis créer un **utilisateur système** ayant accès à
   ces deux ressources et à l'application.
3. Générer pour cet utilisateur système un jeton **sans expiration** avec les
   permissions `instagram_basic` et `pages_show_list` (ajouter
   `business_management` si demandé) → `META_ACCESS_TOKEN`.
4. Récupérer l'IG User ID :
   `GET https://graph.facebook.com/v25.0/{page-id}?fields=instagram_business_account`
   → valeur `instagram_business_account.id` → `INSTAGRAM_ACCOUNT_ID`.

Alternative : « Instagram API with Instagram Login » (`META_GRAPH_API_HOST=graph.instagram.com`).
Son jeton longue durée expire au bout de 60 jours et doit être renouvelé
(`GET https://graph.instagram.com/refresh_access_token`) puis mis à jour chez
l'hébergeur ; la méthode utilisateur système évite cette maintenance.
