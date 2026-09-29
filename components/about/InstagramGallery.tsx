import { getInstagramPosts, type InstagramPost } from "@/lib/instagram";
import { GALLERY_PHOTOS } from "@/lib/galleryPhotos";
import { SOCIAL_LINKS } from "@/lib/site";
import { btnArrow, btnOutlineDark } from "../buttons";
import { ArrowRight, InstagramIcon } from "../icons";
import CreationMosaic, { type MosaicItem } from "./CreationMosaic";

/** Texte alternatif tiré de la légende, sans hashtags ni retours à la ligne. */
function altFromCaption(caption: string | null) {
  const text = (caption ?? "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "Création La Marilyn publiée sur Instagram";
  return text.length > 120 ? `${text.slice(0, 117).trimEnd()}…` : text;
}

/** Domaines d'images Instagram optimisés par next/image (voir next.config.ts). */
const OPTIMIZED_HOSTS = [/\.cdninstagram\.com$/, /\.fbcdn\.net$/];

function fromPost(post: InstagramPost): MosaicItem {
  let unoptimized = true;
  try {
    const { hostname } = new URL(post.imageUrl);
    unoptimized = !OPTIMIZED_HOSTS.some((re) => re.test(hostname));
  } catch {}
  return {
    src: post.imageUrl,
    alt: altFromCaption(post.caption),
    href: post.permalink,
    unoptimized,
  };
}

export default async function InstagramGallery() {
  // Dernières publications Instagram (si l'API est configurée), puis photos
  // locales : toutes entrent dans la rotation de la mosaïque.
  const posts = await getInstagramPosts(12);
  const items: MosaicItem[] = [...posts.map(fromPost), ...GALLERY_PHOTOS];

  return (
    <section
      aria-labelledby="galerie-title"
      className="bg-cream px-4 pb-12 sm:px-8 md:pb-20 lg:px-12 lg:pb-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <header data-reveal className="mx-auto max-w-[36rem] px-2 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-8 bg-gold" />
          <h2
            id="galerie-title"
            className="display mt-5 text-[2rem] text-ink md:mt-6 md:text-[2.75rem] lg:text-[3.25rem]"
          >
            Quelques créations
            <br />
            signées La Marilyn.
          </h2>
          <p className="mx-auto mt-3 max-w-[20rem] text-[0.9375rem] leading-[1.55] text-muted md:mt-4 md:max-w-[26rem] md:leading-relaxed">
            Un aperçu de notre univers, de nos gâteaux aux petites attentions
            gourmandes.
          </p>
        </header>

        <div className="creation-gallery mt-7 md:mt-12 lg:mt-14">
          <CreationMosaic items={items} />
        </div>

        <div data-reveal className="mt-6 flex justify-center md:mt-10">
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
