import { WHATSAPP_URL } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire à La Marilyn sur WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-gold/50 bg-ink/90 text-gold-light shadow-[0_6px_20px_rgb(18_12_9/0.25)] backdrop-blur-sm transition-colors duration-300 hover:border-gold-light hover:bg-ink sm:right-6 lg:bottom-8 lg:right-8"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
