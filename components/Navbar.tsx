'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeListeners } from '../hooks/useRealtimeListeners';

export type Era = '90s' | '2000s' | 'truck' | 'dhurandhar' | 'longdrive' | 'lofi';

interface NavbarProps {
  currentEra?: Era;
}

interface NavItem {
  id: Era;
  label: string;
  subtitle: string;
  href: string;
  trackCount: string;
  activeBorder: string;
  activeText: string;
  activeBg: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: '90s',
    label: 'ट्रैक्टर वाला',
    subtitle: '90s Village Nostalgia',
    href: '/',
    trackCount: '54 Songs',
    activeBorder: 'border-emerald-400/50',
    activeText: 'text-emerald-300 font-semibold',
    activeBg: 'bg-emerald-500/25 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
  },
  {
    id: '2000s',
    label: 'सदाबहार 2000s',
    subtitle: 'Bollywood Romance Classics',
    href: '/2000s',
    trackCount: '69 Songs',
    activeBorder: 'border-rose-400/50',
    activeText: 'text-rose-300 font-semibold',
    activeBg: 'bg-rose-500/25 shadow-[0_0_16px_rgba(244,63,94,0.25)]',
  },
  {
    id: 'truck',
    label: 'ट्रक वाला',
    subtitle: 'Highway Road Trip Express',
    href: '/truck',
    trackCount: '54 Songs',
    activeBorder: 'border-amber-400/50',
    activeText: 'text-amber-300 font-semibold',
    activeBg: 'bg-amber-500/25 shadow-[0_0_16px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'dhurandhar',
    label: 'धुरंधर',
    subtitle: 'Action Cinema & High-Octane',
    href: '/dhurandhar',
    trackCount: '29 Songs',
    activeBorder: 'border-orange-400/60',
    activeText: 'text-orange-300 font-semibold',
    activeBg: 'bg-orange-500/30 shadow-[0_0_16px_rgba(249,115,22,0.3)]',
  },
  {
    id: 'longdrive',
    label: 'लॉन्ग ड्राइव',
    subtitle: 'Late Night Road Trip Anthems',
    href: '/long-drive',
    trackCount: '52 Songs',
    activeBorder: 'border-cyan-400/50',
    activeText: 'text-cyan-300 font-semibold',
    activeBg: 'bg-cyan-500/25 shadow-[0_0_16px_rgba(6,182,212,0.25)]',
  },
  {
    id: 'lofi',
    label: 'लो-फाई लव',
    subtitle: 'Slowed & Reverb Love Songs',
    href: '/lofi',
    trackCount: '30 Songs',
    activeBorder: 'border-purple-400/50',
    activeText: 'text-purple-300 font-semibold',
    activeBg: 'bg-purple-500/25 shadow-[0_0_16px_rgba(168,85,247,0.25)]',
  },
];

export default function Navbar({ currentEra = '90s' }: NavbarProps): React.JSX.Element {
  const [timeString, setTimeString] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const onlineCount = useRealtimeListeners();

  const currentItem = NAV_ITEMS.find((item) => item.id === currentEra) || NAV_ITEMS[0];

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
      setTimeString(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ytMusicUrl = currentEra === 'lofi'
    ? "https://www.youtube.com/playlist?list=PLi-epCWqWTgKjhTGZVkmN3OLBRQG2mt2W"
    : currentEra === 'longdrive'
    ? "https://www.youtube.com/playlist?list=PL2n9PsUx_VHcVgOATXGVFFP9IXjYO6wMY"
    : currentEra === 'dhurandhar'
    ? "https://www.youtube.com/playlist?list=PL6kG-M7dVg_yYYZh-oEbUCqo0lMFYbjoZ"
    : currentEra === 'truck'
    ? "https://music.youtube.com/playlist?list=PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4"
    : currentEra === '2000s'
    ? "https://www.youtube.com/playlist?list=PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux"
    : "https://music.youtube.com/playlist?list=PL--o-tfjAs5J7M5M5obyQPpmFnPi1a_Ev";
    
  const spotifyUrl = currentEra === 'lofi'
    ? "https://open.spotify.com/search/bollywood%20lofi%20slowed%20reverb"
    : currentEra === 'longdrive'
    ? "https://open.spotify.com/search/bollywood%20long%20drive%20hits"
    : currentEra === 'dhurandhar'
    ? "https://open.spotify.com/search/Dhurandhar%20The%20Revenge"
    : currentEra === 'truck'
    ? "https://open.spotify.com/search/90s%20hindi%20highway%20truck%20hits"
    : currentEra === '2000s'
    ? "https://open.spotify.com/search/2000s%20bollywood%20romance%20hits"
    : "https://open.spotify.com/search/90s%20hindi%20nostalgia%20hits";

  const getPresenceText = () => {
    switch (currentEra) {
      case 'lofi': return 'in lofi mood';
      case 'longdrive': return 'on the road';
      case 'truck': return 'on the highway';
      case 'dhurandhar': return 'in the arena';
      default: return 'online';
    }
  };

  const getPresenceTooltip = () => {
    switch (currentEra) {
      case 'lofi': return 'Listeners in Lofi Mood';
      case 'longdrive': return 'Road Trippers on the Road';
      case 'truck': return 'Drivers on the Highway';
      case 'dhurandhar': return 'Dhurandhar Arena Listeners';
      default: return 'Active Listeners';
    }
  };

  const getBadgeGlowColor = () => {
    switch (currentEra) {
      case 'lofi': return 'bg-purple-500 shadow-[0_0_8px_#a855f7]';
      case 'longdrive': return 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]';
      case 'dhurandhar': return 'bg-orange-500 shadow-[0_0_8px_#f97316]';
      case 'truck': return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
      default: return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
    }
  };

  const getBadgePingColor = () => {
    switch (currentEra) {
      case 'lofi': return 'bg-purple-400';
      case 'longdrive': return 'bg-cyan-400';
      case 'dhurandhar': return 'bg-orange-400';
      case 'truck': return 'bg-amber-400';
      default: return 'bg-emerald-400';
    }
  };

  const getBadgeTextColor = () => {
    switch (currentEra) {
      case 'lofi': return 'text-purple-300';
      case 'longdrive': return 'text-cyan-300';
      case 'dhurandhar': return 'text-orange-300';
      case 'truck': return 'text-amber-300';
      default: return 'text-emerald-300';
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-10 py-3 sm:py-4 flex items-center justify-between pointer-events-none drop-shadow-md">
        
        {/* 1. Left Section: Brand Logo & Clock */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 sm:gap-3 pointer-events-auto"
        >
          {/* Brand Name with Radio Pulse (Desktop) */}
          <Link
            href="/"
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white/90 hover:text-white transition-all shadow-md group"
            title="गानों का अड्डा"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="tracking-wide font-devanagari">गानों का अड्डा</span>
          </Link>

          {/* Local Time Pill */}
          <div className="relative group/clock">
            <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-xl border border-white/15 text-[11px] sm:text-xs font-medium text-white/90 font-mono tracking-wider shadow-md cursor-default">
              {timeString || '5:30 pm'}
            </div>
            <div className="pointer-events-none absolute -bottom-10 left-0 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/clock:opacity-100 transition-all duration-200 translate-y-0 group-hover/clock:translate-y-1 scale-95 group-hover/clock:scale-100 z-50">
              Local Time
              <div className="absolute -top-1 left-4 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>
        </motion.div>

        {/* 2. Center Section (Desktop): Horizontal Pill Dock */}
        <motion.div 
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="hidden md:block pointer-events-auto"
        >
          <div className="flex items-center p-1 sm:p-1.5 rounded-full bg-black/55 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentEra === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-devanagari transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? `${item.activeText} ${item.activeBg} border ${item.activeBorder}`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* 2. Center Section (Mobile): Interactive Era Selector Capsule */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex md:hidden pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-2xl border text-xs font-devanagari font-semibold transition-all shadow-md active:scale-95 ${currentItem.activeBorder} ${currentItem.activeText}`}
            title="Tap to switch page"
          >
            <span>{currentItem.label}</span>
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>

        {/* 3. Right Section: Active Listeners & Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 sm:gap-3 justify-end pointer-events-auto"
        >
          {/* Active Listeners Indicator */}
          <div className="relative group/online">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-xl border border-white/15 text-[11px] sm:text-xs text-white/95 font-medium shadow-md hover:border-white/30 transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getBadgePingColor()} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${getBadgeGlowColor()}`}></span>
              </span>
              <div className="flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={mounted ? onlineCount : 1}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.25 }}
                    className={`inline-block tabular-nums font-semibold ${getBadgeTextColor()}`}
                  >
                    {mounted ? onlineCount : 1}
                  </motion.span>
                </AnimatePresence>
                <span>{getPresenceText()}</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/online:opacity-100 transition-all duration-200 translate-y-0 group-hover/online:translate-y-1 scale-95 group-hover/online:scale-100 z-50">
              {getPresenceTooltip()}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-xl border border-white/15 text-white/90 active:scale-95 transition-all shadow-md"
            title="Open Pages Menu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Spotify Link (Desktop) */}
          <div className="relative group/spotify hidden lg:block">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-xl border border-white/15 text-xs font-medium text-white/80 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.37-.73.49-1.1.25-3.01-1.84-6.8-2.26-11.26-1.24-.42.1-.84-.16-.94-.58-.1-.42.16-.84.58-.94 4.88-1.12 9.07-.64 12.47 1.41.37.24.49.73.25 1.1zm1.48-3.29c-.3.46-.91.61-1.37.31-3.44-2.12-8.68-2.73-12.75-1.5-.52.16-1.07-.14-1.23-.66-.16-.52.14-1.07.66-1.23 4.63-1.4 10.4-.73 14.38 1.71.46.3.61.91.31 1.37zm.14-3.42c-4.13-2.45-10.96-2.68-14.9-1.48-.63.19-1.3-.17-1.49-.8-.19-.63.17-1.3.8-1.49 4.51-1.37 12.06-1.11 16.8 1.7.57.34.76 1.08.42 1.65-.34.57-1.08.76-1.65.42z"/>
              </svg>
              <span>Spotify ↗</span>
            </a>
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/spotify:opacity-100 transition-all duration-200 translate-y-0 group-hover/spotify:translate-y-1 scale-95 group-hover/spotify:scale-100 z-50">
              Open in Spotify
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>

          {/* YT Music Link */}
          <div className="relative group/yt hidden sm:block">
            <a
              href={ytMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-xl border border-white/15 text-[11px] sm:text-xs font-medium text-white/80 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-2.5-10.5v7l6-3.5-6-3.5z"/>
              </svg>
              <span className="hidden sm:inline">YT Playlist ↗</span>
            </a>
            <div className="pointer-events-none absolute -bottom-10 right-0 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/yt:opacity-100 transition-all duration-200 translate-y-0 group-hover/yt:translate-y-1 scale-95 group-hover/yt:scale-100 z-50">
              Open Full Playlist on YouTube
              <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
            </div>
          </div>

        </motion.div>
      </nav>

      {/* Full-Screen Glassmorphic Mobile Era Drawer (Scales for 5, 10, 20+ Pages) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl md:hidden"
            />

            {/* Slide-Down Sheet Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-3 left-3 right-3 z-50 p-4 rounded-3xl bg-neutral-950/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[85vh] flex flex-col justify-between md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-semibold font-devanagari text-white tracking-wide">
                    गानों का अड्डा — सभी पेज
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  title="Close Menu"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Era Cards List */}
              <div className="py-3 flex flex-col gap-2 overflow-y-auto max-h-[55vh] scrollbar-none">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentEra === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                        isActive
                          ? `${item.activeBg} border-white/30`
                          : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className={`text-base font-bold font-devanagari ${
                          isActive ? item.activeText : 'text-white/95 group-hover:text-white'
                        }`}>
                          {item.label}
                        </span>
                        <span className="text-xs text-white/60 font-medium">
                          {item.subtitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-white/75">
                          {item.trackCount}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer with External Links */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.37-.73.49-1.1.25-3.01-1.84-6.8-2.26-11.26-1.24-.42.1-.84-.16-.94-.58-.1-.42.16-.84.58-.94 4.88-1.12 9.07-.64 12.47 1.41.37.24.49.73.25 1.1zm1.48-3.29c-.3.46-.91.61-1.37.31-3.44-2.12-8.68-2.73-12.75-1.5-.52.16-1.07-.14-1.23-.66-.16-.52.14-1.07.66-1.23 4.63-1.4 10.4-.73 14.38 1.71.46.3.61.91.31 1.37zm.14-3.42c-4.13-2.45-10.96-2.68-14.9-1.48-.63.19-1.3-.17-1.49-.8-.19-.63.17-1.3.8-1.49 4.51-1.37 12.06-1.11 16.8 1.7.57.34.76 1.08.42 1.65-.34.57-1.08.76-1.65.42z"/>
                  </svg>
                  <span>Spotify</span>
                </a>

                <a
                  href={ytMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-2.5-10.5v7l6-3.5-6-3.5z"/>
                  </svg>
                  <span>YouTube Playlist</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
