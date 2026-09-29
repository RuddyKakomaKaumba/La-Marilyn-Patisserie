import Image from "next/image";

export type GalleryItem = {
  /** Zone de la mosaïque (voir `.creation-gallery__grid` dans globals.css). */
  area: "a" | "b" | "c" | "d" | "e" | "f";
  /** Teinte du placeholder tant que la photo n'est pas fournie. */
  tone: string;
  /** Photographie définitive : renseigner `src` + `alt`, le cadre ne change pas. */
  image?: { src: string; alt: string; position?: string };
};

export default function CreationGalleryItem({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
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
      {item.image && (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={
            item.area === "a" || item.area === "e"
              ? "(min-width: 1024px) 640px, 100vw"
              : "(min-width: 1024px) 320px, 50vw"
          }
          className="object-cover transition-transform duration-[600ms] ease-soft group-hover:scale-[1.02]"
          style={{ objectPosition: item.image.position ?? "50% 50%" }}
        />
      )}
    </li>
  );
}
