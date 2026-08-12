'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES } from '../data/songs';

interface HeroBannerProps {
  onTractorClick: () => void;
  isTractorRevving: boolean;
}

export default function HeroBanner({ onTractorClick, isTractorRevving }: HeroBannerProps): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col items-center justify-between">
      {/* Background Layer with Mobile & Desktop Image Switching */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-transform duration-300 ${isTractorRevving ? 'animate-shake' : ''}`}>
        {/* Mobile Vertical Background (Portrait) */}
        <img
          src="/bg-mobile.png"
          alt="90s Indian Village Scene - Mobile Background"
          className="block sm:hidden w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
        />

        {/* Desktop Landscape Background */}
        <img
          src="/bg-desktop.png"
          alt="90s Indian Village Scene - Desktop Background"
          className="hidden sm:block w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
        />
        
        {/* Filmic Overlays & Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,240,200,0.06)_0%,rgba(15,22,12,0.22)_70%,rgba(8,12,6,0.48)_100%)] pointer-events-none" />
      </div>

      {/* Main Title & Rotating Village Memory */}
      <div className="relative z-20 pointer-events-none px-4 text-center flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-title text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-cream tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)] drop-shadow-[0_0_40px_rgba(255,240,200,0.2)]"
        >
          ट्रैक्टर वाला
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
              className="px-4 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-cream font-devanagari shadow-lg"
            >
              {NOSTALGIC_QUOTES[quoteIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Single-line Interactive Rev Hint (No emojis) */}
      <div className="absolute bottom-24 sm:bottom-6 left-4 sm:left-10 z-20 pointer-events-auto">
        <motion.button
          type="button"
          onClick={onTractorClick}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-amber-400/50 text-[11px] sm:text-xs text-amber-200/90 hover:text-amber-200 tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Click tractor or press T to rev
        </motion.button>
      </div>

      {/* Interactive Tractor Hotspots (Mobile & Desktop) */}
      {/* Desktop click zone */}
      <div
        onClick={onTractorClick}
        className="hidden sm:block absolute top-[35%] left-[10%] w-[52%] h-[55%] z-10 cursor-pointer rounded-3xl"
        title="Click to rev tractor engine or press 'T'"
      />
      {/* Mobile click zone */}
      <div
        onClick={onTractorClick}
        className="block sm:hidden absolute top-[52%] left-[6%] w-[88%] h-[38%] z-10 cursor-pointer rounded-2xl"
        title="Tap to rev tractor engine"
      />
    </div>
  );
}
