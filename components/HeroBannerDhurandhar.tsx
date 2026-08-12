'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES_DHURANDHAR } from '../data/songs-dhurandhar';

export default function HeroBannerDhurandhar(): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_DHURANDHAR.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_DHURANDHAR.length);
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col justify-between">
      {/* Background Layer with bg-dhurandhar.webp */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/bg-dhurandhar.webp"
          alt="धुरंधर - Action Cinema Background"
          className="w-full h-full object-cover object-center filter saturate-[1.12] contrast-[1.06] brightness-90"
        />

        {/* Cinematic Overlays & Fiery Shadow Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,140,50,0.08)_0%,rgba(20,8,5,0.3)_70%,rgba(10,3,2,0.65)_100%)] pointer-events-none" />
      </div>

      {/* Responsive Content Container: Left-Right on Desktop, Stacked on Mobile */}
      <div className="relative z-20 w-full h-full pointer-events-none px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-center md:justify-between pt-16 md:pt-0 pb-20 md:pb-0 gap-6 md:gap-12">
        
        {/* Left Side (Desktop) / Top (Mobile): Main Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold text-orange-400/90 mb-1 drop-shadow-md"
          >
            गानों का अड्डा • The Revenge • Part 1 & 2
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cream tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)] drop-shadow-[0_0_50px_rgba(249,115,22,0.3)]"
          >
            धुरंधर
          </motion.h1>
        </div>

        {/* Right Side (Desktop) / Below (Mobile): Rotating Action Dialogue Card with Tooltip */}
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
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xl border border-orange-500/35 hover:border-orange-400/70 text-xs sm:text-sm md:text-base text-orange-100 hover:text-white font-devanagari shadow-[0_8px_30px_rgba(0,0,0,0.75)] text-center md:text-right leading-relaxed transition-all cursor-pointer active:scale-95"
              >
                {NOSTALGIC_QUOTES_DHURANDHAR[quoteIndex]}
              </motion.button>
            </AnimatePresence>

            {/* Custom Tooltip */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/quote:opacity-100 transition-all duration-200 translate-y-0 group-hover/quote:translate-y-1 scale-95 group-hover/quote:scale-100 z-50">
              Click for Next Dialogue
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
