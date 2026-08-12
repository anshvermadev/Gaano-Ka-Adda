'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES_2000S } from '../data/songs-2000s';

export default function HeroBanner2000s(): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_2000S.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col items-center justify-between">
      {/* Background Layer with Filmic Aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mobile Vertical Background */}
        <img
          src="/bg-2000s-mobile.webp"
          alt="2000s Bollywood Romance Scene - Mobile"
          className="block sm:hidden w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05] brightness-90"
        />

        {/* Desktop Landscape Background */}
        <img
          src="/bg-2000s-desktop.webp"
          alt="2000s Bollywood Romance Scene - Desktop"
          className="hidden sm:block w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05] brightness-90"
        />

        {/* Romantic Filmic Overlays & Amber-Rose Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-950/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,180,160,0.1)_0%,rgba(20,10,25,0.25)_70%,rgba(10,5,15,0.55)_100%)] pointer-events-none" />
      </div>

      {/* Main Title & Rotating 2000s Romance Memory */}
      <div className="relative z-20 pointer-events-none px-4 text-center flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-rose-300/90 mb-1 drop-shadow-md"
        >
          गानों का अड्डा • 90s to 2000s Hits
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-title text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-cream tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)] drop-shadow-[0_0_40px_rgba(255,200,220,0.2)]"
        >
          सदाबहार 2000s
        </motion.h1>

        {/* Nostalgic Memory Quote Pill */}
        <div className="mt-2 sm:mt-3 h-8 sm:h-9 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              className="px-4 py-1 rounded-full bg-black/45 backdrop-blur-md border border-rose-400/20 text-xs sm:text-sm text-rose-100 font-devanagari shadow-lg"
            >
              {NOSTALGIC_QUOTES_2000S[quoteIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
