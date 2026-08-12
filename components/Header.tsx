'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeListeners } from '../hooks/useRealtimeListeners';

interface HeaderProps {
  currentEra?: '90s' | '2000s' | 'truck';
}

export default function Header({ currentEra = '90s' }: HeaderProps): React.JSX.Element {
  const [timeString, setTimeString] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const onlineCount = useRealtimeListeners();

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

  const ytMusicUrl = currentEra === 'truck'
    ? "https://music.youtube.com/playlist?list=PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4"
    : currentEra === '2000s'
    ? "https://www.youtube.com/playlist?list=PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux"
    : "https://music.youtube.com/playlist?list=PL--o-tfjAs5J7M5M5obyQPpmFnPi1a_Ev";
    
  const spotifyUrl = currentEra === 'truck'
    ? "https://open.spotify.com/search/90s%20hindi%20highway%20truck%20hits"
    : currentEra === '2000s'
    ? "https://open.spotify.com/search/2000s%20bollywood%20romance%20hits"
    : "https://open.spotify.com/search/90s%20hindi%20nostalgia%20hits";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between pointer-events-none drop-shadow-md">
      {/* Left: Real-time clock with Custom Tooltip */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 justify-start pointer-events-auto"
      >
        <div className="relative group/clock">
          <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wider font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-default">
            {timeString || '5:30 pm'}
          </span>
          <div className="pointer-events-none absolute -bottom-10 left-0 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/clock:opacity-100 transition-all duration-200 translate-y-0 group-hover/clock:translate-y-1 scale-95 group-hover/clock:scale-100 z-50">
            Local Time
            <div className="absolute -top-1 left-4 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
          </div>
        </div>

        {/* Era Navigation Pill */}
        <div className="hidden md:flex items-center p-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs">
          <Link
            href="/"
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
              currentEra === '90s'
                ? 'bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-400/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            90s गाँव
          </Link>
          <Link
            href="/2000s"
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
              currentEra === '2000s'
                ? 'bg-rose-500/30 text-rose-300 font-semibold border border-rose-400/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            2000s रोमांस
          </Link>
          <Link
            href="/truck"
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
              currentEra === 'truck'
                ? 'bg-amber-500/30 text-amber-300 font-semibold border border-amber-400/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            🚛 ट्रक वाला
          </Link>
        </div>
      </motion.div>

      {/* Center: Real active tabs presence indicator with Custom Tooltip */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="flex items-center justify-center pointer-events-auto"
      >
        <div className="relative group/online">
          <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white/95 font-medium shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:border-white/30 transition-all cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <div className="flex items-center gap-1">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={mounted ? onlineCount : 1}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block tabular-nums font-semibold text-emerald-300"
                >
                  {mounted ? onlineCount : 1}
                </motion.span>
              </AnimatePresence>
              <span>{currentEra === 'truck' ? 'on the highway' : 'online'}</span>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/online:opacity-100 transition-all duration-200 translate-y-0 group-hover/online:translate-y-1 scale-95 group-hover/online:scale-100 z-50">
            {currentEra === 'truck' ? 'Drivers on the Highway' : 'Active Listeners'}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-l border-t border-white/25" />
          </div>
        </div>
      </motion.div>

      {/* Right: Music Links & Era Switcher */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-3 sm:gap-4 justify-end pointer-events-auto"
      >
        {/* Mobile Era Switcher */}
        <div className="flex md:hidden items-center p-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px]">
          <Link
            href="/"
            className={`px-2 py-0.5 rounded-full transition-all ${
              currentEra === '90s' ? 'bg-emerald-500/30 text-emerald-300 font-semibold' : 'text-white/60'
            }`}
          >
            90s
          </Link>
          <Link
            href="/2000s"
            className={`px-2 py-0.5 rounded-full transition-all ${
              currentEra === '2000s' ? 'bg-rose-500/30 text-rose-300 font-semibold' : 'text-white/60'
            }`}
          >
            2000s
          </Link>
          <Link
            href="/truck"
            className={`px-2 py-0.5 rounded-full transition-all ${
              currentEra === 'truck' ? 'bg-amber-500/30 text-amber-300 font-semibold' : 'text-white/60'
            }`}
          >
            🚛
          </Link>
        </div>

        {/* Spotify Link */}
        <div className="relative group/spotify hidden sm:block">
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-white/80 group-hover/spotify:text-white transition-transform" viewBox="0 0 24 24" fill="currentColor">
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
        <div className="relative group/yt">
          <a
            href={ytMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-red-400 group-hover/yt:text-red-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
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
    </header>
  );
}
