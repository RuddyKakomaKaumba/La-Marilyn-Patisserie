import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import BrandStory from "@/components/about/BrandStory";
import ContactSection from "@/components/about/ContactSection";
import InstagramGallery from "@/components/about/InstagramGallery";
import QuickContact from "@/components/about/QuickContact";
import ContactCTA from "@/components/ContactCTA";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const title = "À propos & contact | La Marilyn";
const description =
  "Découvrez l’histoire de La Marilyn – L’art du gâteau et contactez-nous sur WhatsApp pour vos gâteaux sur mesure, mignardises, buffets et locations de présentoirs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/a-propos" },
  openGraph: { title, description, url: "/a-propos" },
  twitter: { title, description },
};

export default function APropos() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <BrandStory />
        <InstagramGallery />
        <ContactSection />
        <QuickContact />
        <ContactCTA
          primaryLabel="Nous contacter sur WhatsApp"
          showCreationsLink={false}
        />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <Reveal />
    </>
  );
}
