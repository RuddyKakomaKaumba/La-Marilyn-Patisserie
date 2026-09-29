import { getInstagramPosts, type InstagramPost } from "@/lib/instagram";
import { SOCIAL_LINKS } from "@/lib/site";
import { SOCIAL_FALLBACK } from "@/lib/socialFallback";
import { btnArrow, btnOutlineDark } from "../buttons";
import { ArrowRight, InstagramIcon } from "../icons";
import CreationGalleryItem, {
  type GalleryArea,
  type GalleryItem,
} from "./CreationGalleryItem";

/** Ordre de lecture de la mosaïque : a (mise en avant 4:3), b, c, d, f, e. */
const AREAS: GalleryArea[] = ["a", "b", "c", "d", "f", "e"];

/** Texte alternatif tiré de la légende, sans hashtags ni retours à la ligne. */
function altFromCaption(caption: string | null) {
  const text = (caption ?? "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "Création La Marilyn publiée sur Instagram";
  return text.length > 120 ? `${text.slice(0, 117).trimEnd()}…` : text;
}

function toGalleryItem(post: InstagramPost, area: GalleryArea, tone: string) {
  const alt = altFromCaption(post.caption);
  return {
    area,
    tone,
    href: post.permalink,
    label: `${alt} — voir la publication sur Instagram`,
    image: { src: post.imageUrl, alt },
  } satisfies GalleryItem;
}

export default async function InstagramGallery() {
  const posts = await getInstagramPosts(AREAS.length);

  // Publications Instagram en priorité, complétées par la galerie locale.
  const items: GalleryItem[] = AREAS.map((area, i) => {
    const fallback = SOCIAL_FALLBACK[i % SOCIAL_FALLBACK.length];
    const post = posts[i];
    if (post) return toGalleryItem(post, area, fallback.tone);
    return {
      area,
      tone: fallback.tone,
      image: fallback.image,
      href: fallback.href,
      label: "Voir les créations de La Marilyn sur Instagram",
    };
  });

  return (
    <section
      aria-labelledby="galerie-title"
      className="bg-cream px-4 pb-16 sm:px-8 md:pb-20 lg:px-12 lg:pb-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <header data-reveal className="mx-auto max-w-[36rem] px-2 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
          <h2
            id="galerie-title"
            className="display mt-6 text-[2.25rem] text-ink md:text-[2.75rem] lg:text-[3.25rem]"
          >
            Quelques créations
            <br />
            signées La Marilyn.
          </h2>
          <p className="mx-auto mt-4 max-w-[20rem] text-[0.875rem] leading-relaxed text-muted md:max-w-[26rem] md:text-[0.9375rem]">
            Un aperçu de notre univers, de nos gâteaux aux petites attentions
            gourmandes.
          </p>
        </header>

        <div className="creation-gallery mt-8 md:mt-12 lg:mt-14">
          <ul className="creation-gallery__grid">
            {items.map((item, i) => (
              <CreationGalleryItem key={item.area} item={item} index={i} />
            ))}
          </ul>
        </div>

        <div data-reveal className="mt-8 flex justify-center md:mt-10">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnOutlineDark} w-full max-w-[21rem] sm:w-auto`}
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
            Voir plus sur Instagram
            <ArrowRight className={btnArrow} />
          </a>
        </div>
      </div>
    </section>
  );
}
