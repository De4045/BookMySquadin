import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210";
const DEFAULT_MESSAGE = "Hi! I found Book My Squad and I'd love to discuss planning my event. Can you help?";

export function FloatingWhatsApp() {
  const [visible, setVisible]   = useState(false);
  const [pulse, setPulse]       = useState(false);
  const [tooltip, setTooltip]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => { setPulse(true); setTooltip(true); }, 1200);
    const t2 = setTimeout(() => setTooltip(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [visible]);

  const open = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-6 z-[9990] flex flex-col items-end gap-3 pointer-events-none">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {tooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto flex items-start gap-2 max-w-[220px]"
          >
            <div className="relative bg-white text-[#111] rounded-2xl rounded-br-none px-4 py-3 shadow-2xl text-sm font-manrope leading-snug">
              <p className="font-semibold text-[13px] mb-0.5">Chat with us!</p>
              <p className="text-[12px] text-gray-600">Get a free quote in minutes 🎊</p>
              <div className="absolute bottom-0 right-0 translate-x-1 translate-y-full">
                <svg width="16" height="10" viewBox="0 0 16 10"><path d="M0 0 L16 0 L16 10 Z" fill="white"/></svg>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="mt-0.5 w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-white/80 hover:bg-black/60 transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={open}
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto relative w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.45)] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #25d366 0%, #128c5e 100%)" }}
      >
        {/* Pulse rings */}
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-[#25d366] opacity-30" />
            <span className="absolute inset-[-6px] rounded-full border border-[#25d366]/25 animate-pulse" />
          </>
        )}
        {/* WhatsApp icon */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.676 5.1 1.858 7.248L1 31l7.973-2.09A14.95 14.95 0 0 0 16 31c8.284 0 15-6.716 15-15S24.284 1 16 1Zm0 27.4a12.37 12.37 0 0 1-6.324-1.735l-.453-.27-4.73 1.24 1.262-4.617-.296-.47A12.381 12.381 0 0 1 3.6 16C3.6 9.151 9.151 3.6 16 3.6S28.4 9.151 28.4 16 22.849 28.4 16 28.4Zm6.793-9.28c-.373-.187-2.2-1.086-2.54-1.21-.34-.124-.588-.187-.836.187-.248.373-.963 1.21-1.18 1.458-.217.249-.435.28-.808.094-.373-.187-1.574-.58-2.998-1.851-1.108-.989-1.856-2.21-2.073-2.583-.217-.373-.023-.574.163-.76.168-.168.373-.435.56-.652.186-.217.248-.373.373-.621.124-.249.062-.466-.031-.652-.093-.187-.836-2.014-1.145-2.758-.302-.724-.608-.625-.836-.637-.217-.01-.466-.013-.715-.013s-.652.093-.994.466c-.342.373-1.304 1.275-1.304 3.108 0 1.833 1.336 3.604 1.522 3.852.187.249 2.628 4.012 6.37 5.627.89.384 1.585.614 2.127.787.893.285 1.706.245 2.349.149.716-.107 2.2-.9 2.511-1.768.31-.867.31-1.611.217-1.768-.093-.155-.341-.248-.715-.435Z"/>
        </svg>
      </motion.button>
    </div>
  );
}
