import Image from "next/image";

export type GalleryArea = "a" | "b" | "c" | "d" | "e" | "f";

export type GalleryItem = {
  /** Zone de la mosaïque (voir `.creation-gallery__grid` dans globals.css). */
  area: GalleryArea;
  /** Teinte de fond : placeholder, et fond visible pendant le chargement de l'image. */
  tone: string;
  image?: { src: string; alt: string; position?: string };
  /** Lien ouvert dans un nouvel onglet (publication Instagram ou profil). */
  href?: string;
  /** Nom accessible du lien. */
  label?: string;
};

/** Domaines d'images Instagram optimisés par next/image (voir next.config.ts). */
const OPTIMIZED_HOSTS = [/\.cdninstagram\.com$/, /\.fbcdn\.net$/];

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

export default function CreationGalleryItem({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  const media = item.image && (
    <Image
      src={item.image.src}
      alt={item.image.alt}
      fill
      unoptimized={!canOptimize(item.image.src)}
      sizes={
        item.area === "a" || item.area === "e"
          ? "(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
          : "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, 50vw"
      }
      className="object-cover transition-transform duration-[600ms] ease-soft group-hover:scale-[1.02]"
      style={{ objectPosition: item.image.position ?? "50% 50%" }}
    />
  );

  return (
    <li
      data-reveal="image"
      style={
        {
          gridArea: item.area,
          backgroundColor: item.tone,
          "--reveal-delay": `${index * 60}ms`,
        } as React.CSSProperties
      }
      className="group relative overflow-hidden rounded-[10px]"
    >
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="absolute inset-0 block"
        >
          {media}
        </a>
      ) : (
        media
      )}
    </li>
  );
}
