import { unstable_cache } from "next/cache";

/**
 * Récupération des dernières publications Instagram de La Marilyn via
 * l'API officielle Meta (Instagram Graph API, endpoint `/{ig-user-id}/media`).
 *
 * Exécuté uniquement côté serveur : le jeton n'est jamais envoyé au navigateur
 * (variables sans préfixe NEXT_PUBLIC_).
 *
 * Cache : la réponse est mise en cache 30 min (Data Cache Next.js). Passé ce
 * délai, la version en cache continue d'être servie pendant que la mise à
 * jour se fait en arrière-plan ; si cette mise à jour échoue, la dernière
 * version valide est conservée.
 */

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  /** URL du média (absente pour certains contenus protégés par droit d'auteur). */
  mediaUrl: string | null;
  /** Vignette, fournie par Meta pour les vidéos / reels. */
  thumbnailUrl: string | null;
  /** Image à afficher dans la galerie (photo, vignette de vidéo ou 1re image d'un carrousel). */
  imageUrl: string;
  permalink: string;
  mediaType: InstagramMediaType;
  caption: string | null;
  timestamp: string;
};

/** Durée de mise en cache des publications (secondes). */
export const INSTAGRAM_REVALIDATE_SECONDS = 1800;

const DEFAULT_HOST = "graph.facebook.com";
const DEFAULT_VERSION = "v25.0";
const REQUEST_TIMEOUT_MS = 8000;

const FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "children{media_type,media_url,thumbnail_url}",
].join(",");

type RawMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: {
    data?: {
      media_type?: string;
      media_url?: string;
      thumbnail_url?: string;
    }[];
  };
};

function getConfig() {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID?.trim();
  if (!token || !accountId) return null;
  return {
    token,
    accountId,
    host: process.env.META_GRAPH_API_HOST?.trim() || DEFAULT_HOST,
    version: process.env.META_GRAPH_API_VERSION?.trim() || DEFAULT_VERSION,
  };
}

/** Image affichable d'une publication, ou null si aucune n'est exploitable. */
function pickImage(m: RawMedia): string | null {
  if (m.media_type === "VIDEO") return m.thumbnail_url ?? null;
  if (m.media_type === "CAROUSEL_ALBUM") {
    for (const child of m.children?.data ?? []) {
      const url =
        child.media_type === "VIDEO" ? child.thumbnail_url : child.media_url;
      if (url) return url;
    }
  }
  return m.media_url ?? null;
}

function normalize(m: RawMedia): InstagramPost | null {
  const imageUrl = pickImage(m);
  if (!imageUrl || !m.permalink) return null;
  const mediaType = (
    ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"].includes(m.media_type ?? "")
      ? m.media_type
      : "IMAGE"
  ) as InstagramMediaType;
  return {
    id: m.id,
    mediaUrl: m.media_url ?? null,
    thumbnailUrl: m.thumbnail_url ?? null,
    imageUrl,
    permalink: m.permalink,
    mediaType,
    caption: m.caption?.trim() || null,
    timestamp: m.timestamp ?? "",
  };
}

/** Appel brut à l'API. Lève une erreur en cas d'échec (jamais de données partielles en cache). */
async function fetchInstagramMedia(limit: number): Promise<InstagramPost[]> {
  const config = getConfig();
  if (!config) throw new Error("Instagram non configuré");

  const url = new URL(
    `https://${config.host}/${config.version}/${config.accountId}/media`,
  );
  url.searchParams.set("fields", FIELDS);
  // Marge : certaines publications (contenu protégé) n'ont pas d'image exploitable.
  url.searchParams.set("limit", String(Math.min(limit * 2, 25)));
  url.searchParams.set("access_token", config.token);

  const res = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    // Le message d'erreur Meta ne contient pas le jeton ; l'URL, si : on ne la journalise pas.
    const body = await res.text().catch(() => "");
    throw new Error(`API Meta ${res.status} : ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: RawMedia[] };
  const posts = (json.data ?? [])
    .map(normalize)
    .filter((p): p is InstagramPost => p !== null)
    .slice(0, limit);
  if (posts.length === 0) throw new Error("Aucune publication exploitable");
  return posts;
}

const cachedInstagramMedia = unstable_cache(
  fetchInstagramMedia,
  ["instagram-media-v1"],
  { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: ["instagram"] },
);

/** Dernière réponse valide connue par ce processus serveur (filet de sécurité). */
let lastKnownPosts: InstagramPost[] | null = null;
let warnedMissingConfig = false;

/**
 * Dernières publications Instagram, normalisées.
 * Ordre de priorité : données fraîches → dernières données en cache → [].
 * Ne lève jamais d'erreur : la galerie complète alors avec son fallback local.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  if (!getConfig()) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn(
        "[instagram] META_ACCESS_TOKEN / INSTAGRAM_ACCOUNT_ID absents : galerie de secours affichée.",
      );
    }
    return [];
  }
  try {
    const posts = await cachedInstagramMedia(limit);
    lastKnownPosts = posts;
    return posts;
  } catch (error) {
    console.error(
      "[instagram] Récupération des publications impossible :",
      error instanceof Error ? error.message : error,
    );
    return lastKnownPosts ?? [];
  }
}
