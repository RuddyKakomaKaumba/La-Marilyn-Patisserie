/**
 * Photos de la mosaïque « Quelques créations signées La Marilyn ».
 *
 * La mosaïque affiche 6 emplacements et renouvelle doucement les photos :
 * avec plus de 6 photos, les suivantes entrent progressivement en rotation.
 * Pour en ajouter une : déposer le fichier dans /public/images/galerie/ et
 * compléter cette liste. Les publications Instagram (si l'API est
 * configurée) s'ajoutent en tête de la rotation.
 */
export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Point de cadrage (object-position), centré par défaut. */
  position?: string;
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/images/galerie/gateau-fleurs-macarons.webp",
    alt: "Gâteau d’anniversaire blanc orné de roses en sucre, de macarons et d’un topper « Happy Birthday » doré",
  },
  {
    src: "/images/galerie/piece-montee-bleu-argent.jpg",
    alt: "Pièce montée de mariage à quatre étages, bleu capitonné et blanc, rubans argentés et topper « Mr & Mrs »",
  },
  {
    src: "/images/galerie/gateau-manchester-united.jpg",
    alt: "Gâteau d’anniversaire rouge aux couleurs de Manchester United, ballon, écharpe et crampon doré",
    position: "50% 60%",
  },
  {
    src: "/images/galerie/gateau-minnie.webp",
    alt: "Gâteau de premier anniversaire rose décoré de Minnie, de boutons et de perles en sucre",
  },
  {
    src: "/images/galerie/gateau-manchester-city.webp",
    alt: "Gâteau aux couleurs de Manchester City, écharpe bleu ciel et ballons en pâte à sucre",
  },
];
