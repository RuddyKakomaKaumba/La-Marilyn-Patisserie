import type { Metadata } from "next";
import CakeDesign from "@/components/creations/CakeDesign";
import CreationRow from "@/components/creations/CreationRow";
import CreationsIntro from "@/components/creations/CreationsIntro";
import EcrinGourmand from "@/components/creations/EcrinGourmand";
import EventCTA from "@/components/creations/EventCTA";
import Presentoirs from "@/components/creations/Presentoirs";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { BUFFET_TERMS, GATEAUX_TERMS, MIGNARDISES_TERMS } from "@/lib/commerce";
import { CREPES, MIGNARDISES, PATISSERIES, TRAITEUR } from "@/lib/creations";

const title = "Nos créations | La Marilyn";
const description =
  "Cakes, gâteaux sur mesure, mignardises et buffets gourmands : découvrez les créations de La Marilyn, pour une envie du moment comme pour recevoir vos invités.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nos-creations" },
  openGraph: { title, description, url: "/nos-creations" },
  twitter: { title, description },
};

export default function NosCreations() {
  return (
    <>
      <Header />
      <main className="bg-cream">
        <CreationsIntro />
        <CreationRow
          id="patisseries"
          title="Nos gâteaux gourmands"
          intro="Des cakes en format rectangulaire, à commander 24 h à l’avance."
          products={PATISSERIES}
          direction="right"
          speed={24}
          cta="patisserie"
          notes={[GATEAUX_TERMS.notes[1], GATEAUX_TERMS.notes[2]]}
        />
        <CakeDesign />
        <CreationRow
          id="mignardises"
          title="Nos mignardises"
          products={MIGNARDISES}
          direction="left"
          speed={22}
          variant="showcase"
          showAction
          cta="mignardises"
          notes={MIGNARDISES_TERMS.notes}
        />
        <CreationRow
          id="crepes"
          title="Nos crêpes"
          intro="Sucrées ou salées, en petites bouchées ou à l’unité."
          products={CREPES}
          direction="right"
          speed={22}
          cta="crepes"
        />
        <EcrinGourmand />
        <CreationRow
          id="traiteur"
          title="Buffet gourmand"
          intro={`${BUFFET_TERMS.price} Mignardises sucrées et salées, pièces cocktail, gâteaux et présentation : une table pensée pour votre événement.`}
          products={TRAITEUR}
          direction="right"
          speed={24}
          variant="showcase"
          showAction
          cta="buffet"
        />
        <Presentoirs />
        <EventCTA />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <Reveal />
    </>
  );
}
