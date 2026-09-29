import ContactCTA from "@/components/ContactCTA";
import Craftsmanship from "@/components/Craftsmanship";
import GourmetUniverses from "@/components/GourmetUniverses";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Occasions from "@/components/Occasions";
import Reveal from "@/components/Reveal";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <GourmetUniverses />
        <Craftsmanship />
        <Occasions />
      </main>
      <ContactCTA />
      <WhatsAppFloat />
      <Reveal />
    </>
  );
}
