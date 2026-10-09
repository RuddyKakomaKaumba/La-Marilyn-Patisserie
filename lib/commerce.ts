/**
 * Conditions commerciales confirmées par La Marilyn. Textes partagés par
 * les fiches produits, la page Nos créations et la FAQ : les modifier ici
 * suffit. Ne jamais y ajouter de montant, délai ou zone non confirmés.
 */

/** Une demande n'est pas une réservation : les trois étapes de confirmation. */
export const CONFIRMATION_STEPS = [
  "La Marilyn valide votre projet (faisabilité, date, disponibilité).",
  "Vous vous mettez d’accord sur le prix.",
  "La commande est confirmée à réception de l’acompte.",
];

export const REQUEST_IS_NOT_BOOKING =
  "Une demande ne vaut pas réservation : la commande est confirmée après validation du projet, accord sur le prix et réception de l’acompte.";

export const ORDER_STEPS = [
  {
    title: "Votre demande",
    text: "Vous préparez votre demande sur le site ou écrivez directement sur WhatsApp.",
  },
  {
    title: "Validation et prix",
    text: "La Marilyn étudie votre projet, vérifie la date et vous confirme le prix.",
  },
  {
    title: "Acompte",
    text: "Votre commande est confirmée à réception de l’acompte de 75 %.",
  },
  {
    title: "Remise",
    text: "Vous êtes prévenu par SMS ou WhatsApp quand tout est prêt ; le solde est réglé avant la remise.",
  },
];

export const PAYMENT = {
  summary: "Acompte de 75 % à la commande, solde de 25 % avant la remise.",
  lines: [
    "Un acompte de 75 % confirme la commande.",
    "Le solde de 25 % est réglé avant la remise de la commande.",
    "Vous êtes prévenu par SMS ou WhatsApp lorsque votre commande est prête ; elle vous est remise après le paiement complet.",
    "Pour certaines grosses commandes, un paiement complet peut être demandé.",
  ],
  means:
    "Paiement par Orange Money. Le numéro de paiement vous est communiqué lors de la confirmation de la commande.",
};

export const CANCELLATION =
  "L’annulation est gratuite tant que l’acompte n’a pas été versé. Une fois l’acompte payé, il n’est pas remboursable.";

export const MODIFICATIONS =
  "Les modifications sont étudiées selon la faisabilité et les disponibilités. Elles peuvent faire évoluer le prix ou le délai.";

export const URGENT =
  "Une commande urgente reste possible selon les disponibilités, avec un supplément d’urgence précisé par La Marilyn au cas par cas.";

export const DELIVERY = {
  base: "La Marilyn est basée à Douala, au Cameroun. Les frais de livraison sont à la charge du client.",
  fees: [
    "Gâteaux gourmands et mignardises : à partir de 1 000 FCFA.",
    "Cake Design : à partir de 5 000 FCFA.",
    "Grosses commandes et événements : selon le volume, la destination et le transport.",
  ],
  final:
    "Les frais définitifs dépendent des conditions réelles de livraison et vous sont confirmés avec la commande.",
  pickup:
    "Le retrait sur place reste exceptionnel et uniquement après accord préalable.",
};

export const PACKAGING = "Emballage standard inclus.";

/* ---- Par univers ------------------------------------------------------ */

export const GATEAUX_TERMS = {
  notes: [
    "Format rectangulaire.",
    "Prix du gâteau seul : garniture, crème, décoration, inscription et personnalisation non comprises.",
    PACKAGING,
    "Liste des parfums susceptible d’évoluer.",
  ],
  leadTime:
    "24 h minimum, selon les disponibilités. Pour une préparation le lendemain, confirmez avant 18 h ; après 18 h, la commande peut passer au créneau suivant disponible.",
  /** Heure limite de confirmation pour le lendemain. */
  cutoffHour: 18,
};

export const MIGNARDISES_TERMS = {
  notes: [
    PACKAGING,
    "Grosses commandes : 72 h minimum.",
    "Demande urgente : étudiée selon les possibilités, avec un supplément.",
  ],
};

export const CAKE_DESIGN_TERMS = {
  price:
    "À partir de 25 000 FCFA pour les créations les plus simples. Les créations personnalisées ou plus complexes sont réalisées sur devis.",
  quoteFactors: [
    "format",
    "structure",
    "nombre de niveaux",
    "finition",
    "décoration",
    "complexité",
    "éléments particuliers",
    "budget",
  ],
  leadTime: "5 jours minimum.",
  urgent:
    "Les commandes urgentes sont possibles selon les disponibilités, avec un éventuel supplément.",
  final: "Le prix final est confirmé par La Marilyn.",
};

export const ECRIN_TERMS = {
  signature: "À offrir, à savourer, à retenir.",
  price: "À partir de 30 000 FCFA.",
  priceDetail:
    "Le prix final dépend de la composition, des quantités, des gourmandises et des personnalisations choisies.",
  leadTime: "7 jours minimum.",
  cake: "Le gâteau n’est pas compris dans le prix de l’écrin : il peut être commandé séparément, avec son propre tarif.",
};

export const BUFFET_TERMS = {
  price: "Exclusivement sur devis personnalisé.",
  services: [
    "mignardises sucrées et salées",
    "pièces cocktail",
    "gâteaux et créations gourmandes",
    "présentation des produits",
    "compositions adaptées à l’événement",
  ],
  leadTime: "Le délai dépend de la nature et de l’ampleur de l’événement.",
};

export const PRESENTOIRS = {
  cubes: [
    { count: 2, size: "20 × 20 × 15 cm", w: 20, h: 15 },
    { count: 2, size: "25 × 25 × 25 cm", w: 25, h: 25 },
    { count: 2, size: "30 × 30 × 35 cm", w: 30, h: 35 },
    { count: 2, size: "35 × 35 × 45 cm", w: 35, h: 45 },
    { count: 1, size: "40 × 40 × 60 cm", w: 40, h: 60 },
    { count: 1, size: "20 × 20 × 60 cm", w: 20, h: 60 },
  ],
  price: 25_000,
  deposit: 10_000,
  depositNote: "Caution remboursée au retour du matériel en bon état.",
  transport: "Transport à la charge du client.",
};
