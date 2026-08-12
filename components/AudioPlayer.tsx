'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';
import { Song } from '../data/songs';

export type RepeatMode = 'off' | 'all' | 'one';

interface AudioPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  togglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onOpenPlaylist: () => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: RepeatMode;
  toggleRepeat: () => void;
}

export default function AudioPlayer({
  currentSong,
  isPlaying,
  togglePlay,
  onPrevious,
  onNext,
  currentTime,
  duration,
  onSeek,
  onOpenPlaylist,
}: AudioPlayerProps): React.JSX.Element {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTime, setDragTime] = useState<number>(0);

  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const displayCurrentTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration > 0 ? Math.min(100, (displayCurrentTime / duration) * 100) : 0;

  const calculateSeekTime = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
    if (!progressBarRef.current || !duration) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clickPosition = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));
    return percentage * duration;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const seekToTime = calculateSeekTime(e);
    onSeek(seekToTime);
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const seekToTime = calculateSeekTime(e);
    setDragTime(seekToTime);
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const seekToTime = calculateSeekTime(e);
      setDragTime(seekToTime);
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const seekToTime = calculateSeekTime(e);
      onSeek(seekToTime);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, duration, onSeek]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-10 z-30 w-[92%] sm:w-auto max-w-[460px] p-2 sm:p-2.5 pr-4 rounded-full bg-black/45 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-3 text-white transition-all duration-300 hover:border-white/35 hover:bg-black/60"
    >
      {/* Spinning Vinyl Cover with Custom Glass Tooltip */}
      <div 
        onClick={togglePlay}
        className="relative group/vinyl cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/30 group-hover/vinyl:border-white/70 shadow-lg relative bg-neutral-900 flex items-center justify-center transition-all ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <img
            src={currentSong?.cover || "https://img.youtube.com/vi/6C34aCdjJtM/mqdefault.jpg"}
            alt={currentSong?.title || "90s Song"}
            className="w-full h-full object-cover rounded-full"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 m-auto w-3 h-3 bg-neutral-950 rounded-full border border-white/40 shadow-inner group-hover/vinyl:scale-110 transition-transform" />
        </div>

        {/* Bigger Sleek Glass Tooltip */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/vinyl:opacity-100 transition-all duration-200 translate-y-0 group-hover/vinyl:-translate-y-1 scale-95 group-hover/vinyl:scale-100 z-50">
          {isPlaying ? 'Pause' : 'Play'}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-r border-b border-white/25" />
        </div>
      </div>

      {/* Main Track Info & Slider */}
      <div className="flex flex-col min-w-0 flex-1 justify-center gap-1">
        <div className="flex items-center justify-between gap-2">
          {/* Song Title & Artist with Full Name Tooltip */}
          <div className="relative group/info flex flex-col min-w-0 cursor-default">
            <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[200px] md:max-w-[240px] transition-colors group-hover/info:text-emerald-300">
              {currentSong?.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-white/70 truncate max-w-[140px] sm:max-w-[200px] md:max-w-[240px]">
              {currentSong?.artist}
            </p>

            {/* Full Song Details Glass Tooltip */}
            <div className="pointer-events-none absolute -top-16 left-0 px-3.5 py-2 rounded-2xl bg-neutral-950/95 backdrop-blur-2xl border border-white/25 text-xs text-white shadow-[0_12px_32px_rgba(0,0,0,0.85)] opacity-0 group-hover/info:opacity-100 transition-all duration-200 translate-y-0 group-hover/info:-translate-y-1 scale-95 group-hover/info:scale-100 z-50 min-w-[200px] max-w-[320px] whitespace-normal">
              <div className="font-bold text-white leading-tight mb-0.5">{currentSong?.title}</div>
              <div className="text-[11px] text-white/70 leading-tight">{currentSong?.artist}</div>
              <div className="absolute -bottom-1 left-6 w-2 h-2 rotate-45 bg-neutral-950/95 border-r border-b border-white/25" />
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-white/60 font-mono tracking-tight shrink-0">
            <span>{formatTime(displayCurrentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Interactive Scrubbable Progress Bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          className="relative w-full h-2.5 flex items-center cursor-pointer group py-1"
        >
          <div className="w-full h-1.5 bg-white/20 group-hover:bg-white/35 rounded-full overflow-hidden relative transition-all">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-white rounded-full relative transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-transform scale-0 group-hover:scale-100 pointer-events-none"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
      </div>

      {/* Playback Controls with Bigger Custom Glass Tooltips */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Previous Button */}
        <div className="relative group/btn">
          <button
            type="button"
            onClick={onPrevious}
            className="p-2 text-white/75 hover:text-white hover:bg-white/15 rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <SkipBack className="w-4 h-4 fill-current text-white" />
          </button>
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-0 group-hover/btn:-translate-y-1 scale-95 group-hover/btn:scale-100 z-50">
            Previous
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-r border-b border-white/25" />
          </div>
        </div>

        {/* Play/Pause Central Button */}
        <div className="relative group/btn">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={togglePlay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_16px_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black ml-0.5" />
            )}
          </motion.button>
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-0 group-hover/btn:-translate-y-1 scale-95 group-hover/btn:scale-100 z-50">
            {isPlaying ? 'Pause' : 'Play'}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-r border-b border-white/25" />
          </div>
        </div>

        {/* Next Button */}
        <div className="relative group/btn">
          <button
            type="button"
            onClick={onNext}
            className="p-2 text-white/75 hover:text-white hover:bg-white/15 rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <SkipForward className="w-4 h-4 fill-current text-white" />
          </button>
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-0 group-hover/btn:-translate-y-1 scale-95 group-hover/btn:scale-100 z-50">
            Next
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-r border-b border-white/25" />
          </div>
        </div>

        {/* Playlist Drawer Button */}
        <div className="relative group/btn">
          <button
            type="button"
            onClick={onOpenPlaylist}
            className="p-2 text-white/75 hover:text-white hover:bg-white/15 rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <ListMusic className="w-4 h-4 text-white" />
          </button>
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/25 text-xs font-medium text-white tracking-wide whitespace-nowrap shadow-[0_8px_20px_rgba(0,0,0,0.7)] opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-0 group-hover/btn:-translate-y-1 scale-95 group-hover/btn:scale-100 z-50">
            Playlist
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 border-r border-b border-white/25" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
