'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Radio, Disc, ExternalLink, Search } from 'lucide-react';
import { SONGS, Song } from '../data/songs';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onSelectSong: (index: number) => void;
  isPlaying: boolean;
}

export default function PlaylistDrawer({
  isOpen,
  onClose,
  currentIndex,
  onSelectSong,
  isPlaying
}: PlaylistDrawerProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const activeItemRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ytMusicUrl = "https://music.youtube.com/playlist?list=PL--o-tfjAs5J7M5M5obyQPpmFnPi1a_Ev";

  // Auto-scroll to active playing song when drawer opens or when song changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex]);

  const handleClearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const filteredSongs: Song[] = SONGS.filter((song) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-10 z-50 w-[92%] sm:w-[420px] max-w-lg p-4 sm:p-5 rounded-3xl bg-neutral-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold tracking-wide">ट्रैक्टर वाला Playlist</h3>
                  <p className="text-[11px] text-white/50">{SONGS.length} Classic 90s Songs</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* YT Music Link Tooltip */}
                <div className="relative group/drawer-yt">
                  <a
                    href={ytMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white/70 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95"
                  >
                    <span>YT Music</span>
                    <ExternalLink className="w-3 h-3 text-white" />
                  </a>
                  <div className="pointer-events-none absolute -bottom-9 right-0 px-2.5 py-0.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/25 text-[11px] font-medium text-white whitespace-nowrap shadow-lg opacity-0 group-hover/drawer-yt:opacity-100 transition-all duration-150 scale-95 group-hover/drawer-yt:scale-100 z-50">
                    Open in YT Music
                    <div className="absolute -top-1 right-3 w-1.5 h-1.5 rotate-45 bg-black/90 border-l border-t border-white/25" />
                  </div>
                </div>

                {/* Close Drawer Button Tooltip */}
                <div className="relative group/drawer-close">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/15 transition-all cursor-pointer active:scale-90"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="pointer-events-none absolute -bottom-9 right-0 px-2.5 py-0.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/25 text-[11px] font-medium text-white whitespace-nowrap shadow-lg opacity-0 group-hover/drawer-close:opacity-100 transition-all duration-150 scale-95 group-hover/drawer-close:scale-100 z-50">
                    Close Playlist
                    <div className="absolute -top-1 right-2.5 w-1.5 h-1.5 rotate-45 bg-black/90 border-l border-t border-white/25" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Input with Clear Button & Tooltip */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search song or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              {searchTerm.length > 0 && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 group/clear">
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="pointer-events-none absolute -top-8 right-0 px-2 py-0.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/25 text-[10px] font-medium text-white whitespace-nowrap shadow-lg opacity-0 group-hover/clear:opacity-100 transition-all duration-150 scale-95 group-hover/clear:scale-100 z-50">
                    Clear
                    <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 rotate-45 bg-black/90 border-r border-b border-white/25" />
                  </div>
                </div>
              )}
            </div>

            {/* Song List with Auto-Scroll */}
            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
              {filteredSongs.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  No songs matching "{searchTerm}"
                </div>
              ) : (
                filteredSongs.map((song) => {
                  const originalIndex = SONGS.findIndex((s) => s.id === song.id);
                  const isActive = originalIndex === currentIndex;

                  return (
                    <div
                      key={song.id}
                      ref={isActive ? activeItemRef : null}
                      onClick={() => {
                        onSelectSong(originalIndex);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-900/50 to-neutral-800 border border-emerald-400/40 text-white'
                          : 'hover:bg-white/5 border border-transparent text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-xs font-mono w-4 text-right shrink-0 ${isActive ? 'text-emerald-400 font-bold' : 'text-white/30'}`}>
                          {originalIndex + 1}
                        </span>

                        {/* Cover Thumbnail */}
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-neutral-800">
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80";
                            }}
                          />
                          {isActive && isPlaying && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Disc className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                          )}
                        </div>

                        {/* Song Details */}
                        <div className="flex flex-col min-w-0">
                          <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                            {song.title}
                          </h4>
                          <p className={`text-[11px] truncate ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isActive && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3.5">
                            <span className="w-0.5 bg-emerald-400 animate-pulse" style={{ height: '60%' }} />
                            <span className="w-0.5 bg-emerald-400 animate-pulse" style={{ height: '100%' }} />
                            <span className="w-0.5 bg-emerald-400 animate-pulse" style={{ height: '40%' }} />
                          </div>
                        ) : isActive ? (
                          <Pause className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Play className="w-3.5 h-3.5 opacity-25 text-white" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
