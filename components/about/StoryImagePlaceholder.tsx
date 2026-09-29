import Image from "next/image";

type Props = {
  /** Photographie définitive : renseigner `src` + `alt`, le cadre ne change pas. */
  image?: { src: string; alt: string; position?: string };
  className?: string;
};

/**
 * Visuel du hero « Notre histoire » (portrait / atelier La Marilyn).
 * Sans photo : aplat chocolat, plus bas sur mobile.
 */
export default function StoryImagePlaceholder({
  image,
  className = "",
}: Props) {
  return (
    <div
      data-reveal="image"
      data-placeholder={
        image ? undefined : "Portrait / atelier La Marilyn — image à ajouter"
      }
      className={`relative overflow-hidden rounded-[10px] ${image ? "aspect-[4/5]" : "aspect-[5/4] md:aspect-[4/5]"} bg-[#3b2a1f] ${className}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
          style={{ objectPosition: image.position ?? "50% 50%" }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_30%,#4a3426_0%,#3b2a1f_60%,#30221a_100%)]"
        />
      )}
    </div>
  );
}
