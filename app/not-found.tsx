'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ERA_LINKS = [
  { href: '/', label: 'ट्रैक्टर वाला', desc: '90s Village Nostalgia', border: 'hover:border-emerald-400/50 hover:bg-emerald-500/10' },
  { href: '/2000s', label: 'सदाबहार 2000s', desc: 'Bollywood Romance', border: 'hover:border-rose-400/50 hover:bg-rose-500/10' },
  { href: '/truck', label: 'ट्रक वाला', desc: 'Highway Express', border: 'hover:border-amber-400/50 hover:bg-amber-500/10' },
  { href: '/dhurandhar', label: 'धुरंधर', desc: 'Action Cinema', border: 'hover:border-orange-400/50 hover:bg-orange-500/10' },
  { href: '/long-drive', label: 'लॉन्ग ड्राइव', desc: 'Late Night Road Trip', border: 'hover:border-cyan-400/50 hover:bg-cyan-500/10' },
  { href: '/lofi', label: 'लो-फाई लव', desc: 'Slowed & Reverb Love', border: 'hover:border-purple-400/50 hover:bg-purple-500/10' },
  { href: '/phonk', label: 'PHONK / FUNK', desc: 'Brazilian Drift Beats', border: 'hover:border-red-400/50 hover:bg-red-500/10' },
];

export default function NotFound(): React.JSX.Element {
  return (
    <div className="relative min-h-screen h-full w-full flex items-center justify-center p-4 sm:p-6 bg-[#0a0c0a] text-white overflow-y-auto select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic 404 Container */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full p-6 sm:p-10 rounded-3xl bg-neutral-950/85 backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-center flex flex-col items-center gap-5"
      >
        {/* Top Mini Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 font-medium shadow-inner">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>गानों का अड्डा - त्रुटि 404</span>
        </div>

        {/* Big 404 Display */}
        <div className="relative">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-white drop-shadow-[0_10px_35px_rgba(255,255,255,0.25)]">
            404
          </h1>
        </div>

        {/* Devanagari & English Message */}
        <div className="flex flex-col gap-1.5 max-w-lg">
          <h2 className="text-xl sm:text-2xl font-bold font-devanagari text-white tracking-wide">
            रास्ता भटक गए क्या, जनाब?
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
            गानों का अड्डा पर यह सुर नहीं मिला। शायद यह पेज कहीं खो गया है, या गलत रास्ता चुन लिया गया है।
          </p>
        </div>

        {/* Quick Links Grid for All 7 Eras */}
        <div className="w-full pt-3 border-t border-white/10 flex flex-col gap-2">
          <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">
            या अपने पसंदीदा संगीत अड्डे पर जाएँ:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {ERA_LINKS.map((era) => (
              <Link
                key={era.href}
                href={era.href}
                className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-200 flex flex-col justify-center ${era.border}`}
              >
                <span className="text-xs sm:text-sm font-bold font-devanagari text-white truncate">
                  {era.label}
                </span>
                <span className="text-[10px] text-white/50 font-medium truncate">
                  {era.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2 w-full flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-white/90 text-neutral-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
          >
            <span>होमपेज पर लौटें (मुख्य अड्डा)</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
