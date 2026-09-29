import { SOCIAL_LINKS } from "@/lib/site";
import { btnArrow, btnOutlineDark } from "../buttons";
import { ArrowRight, InstagramIcon } from "../icons";
import CreationGalleryItem, { type GalleryItem } from "./CreationGalleryItem";

/** Nuances : crème, beige, caramel, chocolat clair, chocolat noir. */
const GALLERY: GalleryItem[] = [
  { area: "a", tone: "#c99a67" }, // mise en avant (4:3)
  { area: "b", tone: "#3d2a1f" }, // portrait (2:3)
  { area: "c", tone: "#e6d7c2" }, // carré
  { area: "d", tone: "#8a5f43" }, // portrait (2:3)
  { area: "f", tone: "#efe5d7" }, // carré
  { area: "e", tone: "#dcc6a8" }, // paysage (2:1)
];

export default function InstagramGallery() {
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
            {GALLERY.map((item, i) => (
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
