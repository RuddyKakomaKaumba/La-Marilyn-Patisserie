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
    src: "/images/creations/gateau-floral-roses-macarons.webp",
    alt: "Gâteau d’anniversaire blanc orné de roses en sucre, de macarons et d’un topper « Happy Birthday » doré",
    position: "50% 40%",
  },
  {
    src: "/images/galerie/piece-montee-bleu-argent.jpg",
    alt: "Pièce montée de mariage à quatre étages, bleu capitonné et blanc, rubans argentés et topper « Mr & Mrs »",
  },
  {
    src: "/images/galerie/gateau-minnie.webp",
    alt: "Gâteau de premier anniversaire rose décoré de Minnie, de boutons et de perles en sucre",
  },
  {
    src: "/images/creations/gateau-manchester-city.webp",
    alt: "Gâteau aux couleurs de Manchester City, écharpe bleu ciel et ballons en pâte à sucre",
  },
  // 6e emplacement (bandeau horizontal) : photo paysage en premier affichage.
  {
    src: "/images/galerie/buffet-bouchees.jpg",
    alt: "Buffet de bouchées : brochettes tomate-fromage, mini-burgers, canapés au saumon et tartelettes",
  },
  {
    src: "/images/galerie/gateau-emmenagement.webp",
    alt: "Gâteau rectangulaire « Bon emménagement Maman » bordé de rosaces violettes et blanches, devant sa boîte La Marilyn",
    position: "50% 70%",
  },
  {
    src: "/images/galerie/gateau-soleil.webp",
    alt: "Gâteau de baptême jaune et blanc surmonté d’un soleil souriant, « You are my sunshine »",
  },
  {
    src: "/images/galerie/renverse-ananas.webp",
    alt: "Gâteau renversé à l’ananas caramélisé sur un présentoir, une part servie",
  },
  {
    src: "/images/creations/gateau-trois-etages-turquoise-argent.webp",
    alt: "Gâteau à trois étages blanc et turquoise, roses en sucre et inscriptions argentées pour les 25 ans de la chorale Marie Reine",
    position: "50% 40%",
  },
];

/**
 * Réalisations Cake Design (page Nos créations) : une seule vue par
 * création. La légende indique uniquement la catégorie.
 */
export type CakeDesignPhoto = GalleryPhoto & {
  category:
    | "Anniversaire élégant"
    | "Anniversaire enfant"
    | "Anniversaire thématique"
    | "Célébration";
  /** Mise en avant en tête de la galerie (format agrandi). */
  featured?: boolean;
};

export const CAKE_DESIGN_PHOTOS: CakeDesignPhoto[] = [
  {
    src: "/images/creations/gateau-jasmine-turquoise-violet.webp",
    alt: "Gâteau d’anniversaire turquoise sur le thème de Jasmine, cascade de roses violettes et blanches, perles dorées et papillons irisés",
    category: "Anniversaire enfant",
    position: "50% 40%",
    featured: true,
  },
  {
    src: "/images/creations/gateau-bon-emmenagement-maman.webp",
    alt: "Gâteau rectangulaire blanc « Bon Emménagement Maman » en lettres dorées, bordé de rosaces violettes, mauves et blanches",
    category: "Célébration",
    position: "50% 50%",
    featured: true,
  },
  {
    src: "/images/creations/gateau-trois-etages-turquoise-argent.webp",
    alt: "Gâteau à trois étages blanc et turquoise, roses en sucre et chiffres « 25 » argentés",
    category: "Anniversaire élégant",
    position: "50% 40%",
  },
  {
    src: "/images/creations/gateau-baby-boss.webp",
    alt: "Gâteau blanc et bleu marine sur le thème Baby Boss, biberon et billets en sucre",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/creations/gateau-blanc-or-31.webp",
    alt: "Gâteau blanc et or surmonté d’un « 31 » doré, perles dorées et cœurs blancs",
    category: "Anniversaire élégant",
  },
  {
    src: "/images/creations/gateau-licorne-rose-deux-etages.webp",
    alt: "Gâteau à deux étages rose et blanc, licornes, perles en sucre et prénom doré",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/creations/gateau-noir-or-fleurs-roses.webp",
    alt: "Gâteau noir à coulures dorées, rosaces, perles dorées et couronne de roses « Happy Birthday »",
    category: "Anniversaire élégant",
    position: "50% 40%",
  },
  {
    src: "/images/creations/gateau-spiderman-deux-etages.webp",
    alt: "Gâteau à deux étages rouge et bleu sur le thème de Spider-Man, pour un 5e anniversaire",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/creations/gateau-blanc-fleurs-rhodi.webp",
    alt: "Gâteau blanc orné de fleurs en relief nacrées et d’un prénom en lettres dorées",
    category: "Anniversaire élégant",
    position: "50% 55%",
  },
  {
    src: "/images/creations/gateau-ourson-arc-en-ciel.webp",
    alt: "Gâteau vert et beige surmonté d’un ourson, d’un arc-en-ciel et d’une lune, pour un premier anniversaire",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/creations/gateau-manchester-city.webp",
    alt: "Gâteau aux couleurs de Manchester City, écharpe bleu ciel et ballons en pâte à sucre",
    category: "Anniversaire thématique",
  },
  {
    src: "/images/creations/gateau-jungle-palmier.webp",
    alt: "Gâteau jungle vu de dessus : palmier, rivière, fleurs et lianes en pâte à sucre",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/galerie/gateau-minnie.webp",
    alt: "Gâteau de premier anniversaire rose décoré de Minnie, de boutons et de perles en sucre",
    category: "Anniversaire enfant",
  },
  {
    src: "/images/galerie/gateau-manchester-united.jpg",
    alt: "Gâteau d’anniversaire rouge aux couleurs de Manchester United, ballon, écharpe et crampon doré",
    category: "Anniversaire thématique",
    position: "50% 60%",
  },
];
