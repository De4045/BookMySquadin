import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer  = setTimeout(() => setExiting(true), 1700);
    const doneTimer  = setTimeout(() => onComplete(),     2200);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
          style={{ background: "radial-gradient(ellipse at 50% 42%, #140d04 0%, #080604 60%)" }}
        >
          {/* Ambient gold glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute pointer-events-none"
            style={{
              width: 640,
              height: 640,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 70%)",
            }}
          />

          {/* Upper decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="absolute"
            style={{
              top: "calc(50% - 110px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 360,
              height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 30%, #d4af37 50%, rgba(212,175,55,0.6) 70%, transparent 100%)",
            }}
          />

          {/* Lower decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="absolute"
            style={{
              top: "calc(50% + 110px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 360,
              height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 30%, #d4af37 50%, rgba(212,175,55,0.6) 70%, transparent 100%)",
            }}
          />

          {/* Corner ornaments */}
          {[
            { top: "calc(50% - 118px)", left: "calc(50% - 188px)" },
            { top: "calc(50% - 118px)", left: "calc(50% + 182px)" },
            { top: "calc(50% + 104px)", left: "calc(50% - 188px)" },
            { top: "calc(50% + 104px)", left: "calc(50% + 182px)" },
          ].map((pos, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
              className="absolute font-cinzel"
              style={{ ...pos, color: "rgba(212,175,55,0.55)", fontSize: 10, lineHeight: 1 }}
            >
              ✦
            </motion.span>
          ))}

          {/* Main content column */}
          <div className="relative flex flex-col items-center gap-5">

            {/* Logo mark */}
            <motion.img
              src={bmsLogo}
              alt="Book My Squad"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="object-contain"
              style={{
                width: 88,
                height: 88,
                filter: "drop-shadow(0 0 24px rgba(212,175,55,0.55)) drop-shadow(0 0 8px rgba(212,175,55,0.35))",
              }}
            />

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="font-cormorant font-semibold leading-none text-center"
              style={{ fontSize: "clamp(38px, 6vw, 64px)" }}
            >
              <span className="text-white">Book </span>
              <span style={{
                color: "#d4af37",
                fontStyle: "italic",
                textShadow: "0 0 50px rgba(212,175,55,0.45), 0 0 100px rgba(212,175,55,0.20)",
              }}>
                My Squad
              </span>
            </motion.h1>

            {/* Centre ornament */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, delay: 1.05 }}
              className="flex items-center gap-3"
            >
              <div style={{
                width: 56, height: 1,
                background: "linear-gradient(90deg, transparent, #d4af37)",
              }} />
              <span style={{ color: "#d4af37", fontSize: 11 }}>✦</span>
              <div style={{
                width: 56, height: 1,
                background: "linear-gradient(90deg, #d4af37, transparent)",
              }} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.25 }}
              className="font-cinzel text-center"
              style={{
                fontSize: 10,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.60)",
              }}
            >
              India's Finest Event Planning Platform
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              style={{
                width: 160,
                height: 1,
                background: "rgba(255,255,255,0.07)",
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ scaleX: 0, transformOrigin: "left center" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 1.55, ease: "linear" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, rgba(212,175,55,0.4), #d4af37, rgba(212,175,55,0.4))",
                }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
