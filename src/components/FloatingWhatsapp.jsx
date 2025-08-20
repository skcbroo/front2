// src/components/FloatingWhatsapp.jsx
import { Whatsapp } from "lucide-react";

export default function FloatingWhatsapp() {
  return (
    <a
      href="https://wa.me/5561996204646?text=Olá! Tenho interesse em vender meu processo judicial"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="
        fixed bottom-4 left-4 z-50
        inline-flex items-center justify-center
        w-14 h-14 rounded-full
        bg-green-500 text-white
        shadow-xl ring-1 ring-black/10
        hover:bg-green-600 hover:shadow-2xl
        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400
        transition-all duration-200
      "
    >
      <Whatsapp className="w-7 h-7" aria-hidden="true" />
      <span className="sr-only">Abrir conversa no WhatsApp</span>
    </a>
  );
}
