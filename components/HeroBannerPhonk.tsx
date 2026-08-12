'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES_PHONK } from '../data/songs-phonk';

export default function HeroBannerPhonk(): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_PHONK.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_PHONK.length);
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col justify-between">
      {/* Background Layer with Mobile & Desktop Switching */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mobile Background */}
        <img
          src="/bg-phonk-mobile.webp"
          alt="Phonk Drift Night Scene - Mobile Background"
          className="block sm:hidden w-full h-full object-cover object-center filter saturate-[1.2] contrast-[1.08] brightness-90"
        />

        {/* Desktop Background */}
        <img
          src="/bg-phonk-desktop.webp"
          alt="Phonk Drift Night Scene - Desktop Background"
          className="hidden sm:block w-full h-full object-cover object-center filter saturate-[1.2] contrast-[1.08] brightness-90"
        />

        {/* Dark Drift Overlays & Neon Violet Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(239,68,68,0.08)_0%,rgba(30,10,20,0.3)_70%,rgba(10,2,8,0.7)_100%)] pointer-events-none" />
      </div>

      {/* Responsive Content Container: Left-Right on Desktop, Just Above Player on Mobile */}
      <div className="relative z-20 w-full h-full pointer-events-none px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-end md:justify-between pb-28 sm:pb-32 md:pb-0 pt-0 md:pt-0 gap-2.5 md:gap-12">
        
        {/* Left Side (Desktop) / Above Player (Mobile): Main Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-red-400/90 mb-0.5 drop-shadow-md font-mono"
          >
            GAANO KA ADDA • BRAZILIAN PHONK & DRIFT BEATS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-cream tracking-wider uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)] drop-shadow-[0_0_50px_rgba(239,68,68,0.4)]"
          >
            PHONK / FUNK
          </motion.h1>
        </div>

        {/* Right Side (Desktop) / Below Title (Mobile): Rotating Phonk Quote Card with Tooltip */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right max-w-md lg:max-w-lg pointer-events-auto">
          <div className="relative group/quote">
            <AnimatePresence mode="wait">
              <motion.button
                key={quoteIndex}
                type="button"
                onClick={handleNextQuote}
                initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.45 }}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-xl border border-red-500/35 hover:border-red-400/70 text-xs sm:text-sm md:text-base text-red-100 hover:text-white font-medium shadow-[0_8px_30px_rgba(0,0,0,0.75)] text-center md:text-right leading-relaxed transition-all cursor-pointer active:scale-95"
              >
                "{NOSTALGIC_QUOTES_PHONK[quoteIndex]}"
              </motion.button>
            </AnimatePresence>

            {/* Custom Tooltip */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/quote:opacity-100 transition-all duration-200 translate-y-0 group-hover/quote:translate-y-1 scale-95 group-hover/quote:scale-100 z-50">
              Click for Next Quote
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
