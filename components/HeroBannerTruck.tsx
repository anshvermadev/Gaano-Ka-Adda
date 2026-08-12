'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOSTALGIC_QUOTES_TRUCK } from '../data/songs-truck';

interface HeroBannerTruckProps {
  onHornClick: () => void;
  isHornPlaying: boolean;
}

export default function HeroBannerTruck({
  onHornClick,
  isHornPlaying,
}: HeroBannerTruckProps): React.JSX.Element {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_TRUCK.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES_TRUCK.length);
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none flex flex-col items-center justify-between">
      {/* Background Layer with bg.mp4 video and bg-2.webp fallback poster */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-transform duration-200 ${isHornPlaying ? 'animate-shake' : ''}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/bg-2.webp"
          className="w-full h-full object-cover object-bottom filter saturate-[1.08] contrast-[1.03] brightness-95"
        >
          <source src="/bg.mp4" type="video/mp4" />
          {/* Fallback image if video cannot be played */}
          <img
            src="/bg-2.webp"
            alt="ट्रक वाला - Indian Highway Truck Background"
            className="w-full h-full object-cover object-bottom"
          />
        </video>

        {/* Filmic Overlays & Subtle Highway Night Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,100,50,0.06)_0%,rgba(10,5,20,0.25)_70%,rgba(5,2,10,0.55)_100%)] pointer-events-none" />
      </div>

      {/* Main Title & Rotating Quote Directly Below "ट्रक वाला" */}
      <div className="relative z-20 pointer-events-none px-4 text-center flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold text-amber-300/85 mb-1 drop-shadow-md"
        >
          गानों का अड्डा • Highway Express
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-title text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-bold text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.7)] drop-shadow-[0_0_50px_rgba(255,120,60,0.25)]"
        >
          ट्रक वाला
        </motion.h1>

        {/* Rotating Shayari / Quote Pill Directly Below Title */}
        <div className="mt-3 sm:mt-4 min-h-[40px] flex items-center justify-center pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.button
              key={quoteIndex}
              type="button"
              onClick={handleNextQuote}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.45 }}
              className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 hover:border-amber-400/50 text-xs sm:text-sm md:text-base text-cream hover:text-white font-devanagari shadow-[0_8px_24px_rgba(0,0,0,0.6)] max-w-xl text-center leading-relaxed transition-all cursor-pointer active:scale-95"
              title="Click to see next quote"
            >
              {NOSTALGIC_QUOTES_TRUCK[quoteIndex]}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* Left Horn Button: "हॉर्न ओके प्लीज़ / Horn ok pleaseeee" with Tooltip */}
      <div className="absolute left-4 sm:left-10 md:left-14 top-[56%] sm:top-[58%] -translate-y-1/2 z-30 pointer-events-auto">
        <div className="relative group/horn">
          <motion.button
            type="button"
            onClick={onHornClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl cursor-pointer select-none ${
              isHornPlaying
                ? 'bg-gradient-to-r from-red-600/80 via-amber-600/70 to-red-600/80 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] text-white scale-105'
                : 'bg-black/50 hover:bg-black/70 border-white/25 hover:border-amber-400/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white'
            }`}
          >
            {/* Animated Horn Waves when Honking */}
            {isHornPlaying && (
              <span className="absolute -inset-1 rounded-full border border-amber-400 animate-ping opacity-60 pointer-events-none" />
            )}

            {/* Sound / Horn Icon */}
            <div className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-transform duration-200 ${
              isHornPlaying ? 'bg-amber-400 text-black scale-110 rotate-[-12deg]' : 'bg-white/15 text-white group-hover/horn:bg-amber-400/20 group-hover/horn:text-amber-300'
            }`}>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5-1.23L6.5 6H2v12h4.5l5 4V2zM14 8.82v6.36c1.13-.56 2-1.74 2-3.18s-.87-2.62-2-3.18z"/>
              </svg>
            </div>

            {/* Two-line Text: Hindi + English */}
            <div className="flex flex-col text-left">
              <span className="font-devanagari font-bold text-xs sm:text-sm text-white tracking-wide drop-shadow-sm group-hover/horn:text-amber-200 transition-colors">
                हॉर्न ओके प्लीज़
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-white/70 italic tracking-wider font-mono">
                Horn ok pleaseeee
              </span>
            </div>

            {/* Subtle Keycap Indicator */}
            <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/60 border border-white/15">
              [H]
            </span>
          </motion.button>

          {/* Custom Tooltip */}
          <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/horn:opacity-100 transition-all duration-200 translate-y-0 group-hover/horn:translate-y-1 scale-95 group-hover/horn:scale-100 z-50">
            Honk Truck Horn [H]
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
