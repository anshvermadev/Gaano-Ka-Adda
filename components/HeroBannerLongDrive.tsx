'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES_LONGDRIVE } from '../data/songs-longdrive';

export default function HeroBannerLongDrive(): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_LONGDRIVE.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_LONGDRIVE.length);
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col items-center justify-between">
      {/* Background Layer with Mobile & Desktop Switching */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mobile Background */}
        <img
          src="/bg-longdrive-mobile.webp"
          alt="Long Drive Night Road Scene - Mobile Background"
          className="block sm:hidden w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.04] brightness-95"
        />

        {/* Desktop Background */}
        <img
          src="/bg-longdrive-desktop.webp"
          alt="Long Drive Night Road Scene - Desktop Background"
          className="hidden sm:block w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.04] brightness-95"
        />

        {/* Filmic Overlays & Midnight Road Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.06)_0%,rgba(10,15,30,0.25)_70%,rgba(5,8,18,0.6)_100%)] pointer-events-none" />
      </div>

      {/* Main Title & Rotating Quote Directly Below */}
      <div className="relative z-20 pointer-events-none px-4 text-center flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold text-cyan-300/85 mb-1 drop-shadow-md"
        >
          गानों का अड्डा • Late Night Road Trip
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-title text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-bold text-cream tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.8)] drop-shadow-[0_0_50px_rgba(56,189,248,0.3)]"
        >
          लॉन्ग ड्राइव
        </motion.h1>

        {/* Rotating Road Trip Quote Pill with Tooltip */}
        <div className="mt-3 sm:mt-4 min-h-[40px] flex items-center justify-center pointer-events-auto">
          <div className="relative group/quote">
            <AnimatePresence mode="wait">
              <motion.button
                key={quoteIndex}
                type="button"
                onClick={handleNextQuote}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.45 }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-cyan-400/30 hover:border-cyan-300/60 text-xs sm:text-sm md:text-base text-cyan-100 hover:text-white font-devanagari shadow-[0_8px_30px_rgba(0,0,0,0.7)] max-w-xl text-center leading-relaxed transition-all cursor-pointer active:scale-95"
              >
                {NOSTALGIC_QUOTES_LONGDRIVE[quoteIndex]}
              </motion.button>
            </AnimatePresence>

            {/* Custom Tooltip */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/quote:opacity-100 transition-all duration-200 translate-y-0 group-hover/quote:translate-y-1 scale-95 group-hover/quote:scale-100 z-50">
              Click for Next Memory
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
