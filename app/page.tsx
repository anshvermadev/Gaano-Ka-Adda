'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import AudioPlayer, { RepeatMode } from '../components/AudioPlayer';
import PlaylistDrawer from '../components/PlaylistDrawer';
import YouTubePlayerController from '../components/YouTubePlayerController';
import AmbientAtmosphere from '../components/AmbientAtmosphere';
import { SONGS, Song } from '../data/songs';

export default function Home(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isTractorRevving, setIsTractorRevving] = useState<boolean>(false);

  const isShuffleRef = useRef<boolean>(isShuffle);
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  const currentIndexRef = useRef<number>(currentIndex);
  const ytPlayerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
    repeatModeRef.current = repeatMode;
    currentIndexRef.current = currentIndex;
  }, [isShuffle, repeatMode, currentIndex]);

  const currentSong: Song = SONGS[currentIndex] || SONGS[0];

  const getRandomIndex = (currIdx: number): number => {
    if (SONGS.length <= 1) return 0;
    let nextIdx = currIdx;
    while (nextIdx === currIdx) {
      nextIdx = Math.floor(Math.random() * SONGS.length);
    }
    return nextIdx;
  };

  const initAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const triggerTractorEngine = () => {
    initAudioContext();
    setIsTractorRevving(true);
    setTimeout(() => setIsTractorRevving(false), 3200);

    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(55, now + 2.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.1);
    } catch (e) {
      console.warn('Tractor audio synthesis error:', e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 't' || e.key === 'T') {
        triggerTractorEngine();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleYTPlayerReady = useCallback((player: any) => {
    ytPlayerRef.current = player;
  }, []);

  const handleYTStateChange = useCallback((stateCode: number) => {
    if (stateCode === 1) {
      setIsPlaying(true);
    } else if (stateCode === 2) {
      setIsPlaying(false);
    } else if (stateCode === 0) {
      if (repeatModeRef.current === 'one') {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
        }
        setIsPlaying(true);
      } else if (isShuffleRef.current) {
        const nextIdx = getRandomIndex(currentIndexRef.current);
        setCurrentIndex(nextIdx);
        setIsPlaying(true);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.loadVideoById(SONGS[nextIdx].videoId);
        }
      } else {
        const nextIdx = (currentIndexRef.current + 1) % SONGS.length;
        setCurrentIndex(nextIdx);
        setIsPlaying(true);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.loadVideoById(SONGS[nextIdx].videoId);
        }
      }
    }
  }, []);

  const handleYTTimeUpdate = useCallback((current: number, dur: number) => {
    setCurrentTime(current);
    if (dur > 0) setDuration(dur);
  }, []);

  const handleYTError = useCallback((errorCode: number) => {
    console.warn('Skipping unplayable track, YT error code:', errorCode);
    const nextIdx = isShuffleRef.current
      ? getRandomIndex(currentIndexRef.current)
      : (currentIndexRef.current + 1) % SONGS.length;
    setCurrentIndex(nextIdx);
  }, []);

  const togglePlay = () => {
    initAudioContext();
    if (!ytPlayerRef.current) return;
    try {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Play/Pause error:', e);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(newTime, true);
    }
  };

  const handlePrevious = () => {
    initAudioContext();
    let prevIdx: number;
    if (currentTime > 4) {
      handleSeek(0);
      return;
    }
    if (isShuffle) {
      prevIdx = getRandomIndex(currentIndex);
    } else {
      prevIdx = (currentIndex - 1 + SONGS.length) % SONGS.length;
    }
    setCurrentIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS[prevIdx].videoId);
      } catch (e) {}
    }
  };

  const handleNext = () => {
    initAudioContext();
    let nextIdx: number;
    if (isShuffle) {
      nextIdx = getRandomIndex(currentIndex);
    } else {
      nextIdx = (currentIndex + 1) % SONGS.length;
    }
    setCurrentIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS[nextIdx].videoId);
      } catch (e) {}
    }
  };

  const handleSelectSong = (index: number) => {
    initAudioContext();
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS[index].videoId);
      } catch (e) {}
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#12180e] select-none">
      <AmbientAtmosphere isTractorRevving={isTractorRevving} />

      <YouTubePlayerController
        videoId={currentSong.videoId}
        isPlaying={isPlaying}
        onPlayerReady={handleYTPlayerReady}
        onStateChange={handleYTStateChange}
        onTimeUpdate={handleYTTimeUpdate}
        onError={handleYTError}
      />

      <Header />

      <HeroBanner
        onTractorClick={triggerTractorEngine}
        isTractorRevving={isTractorRevving}
      />

      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        isShuffle={isShuffle}
        toggleShuffle={() => setIsShuffle((prev) => !prev)}
        repeatMode={repeatMode}
        toggleRepeat={() =>
          setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
        }
      />

      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentIndex={currentIndex}
        onSelectSong={handleSelectSong}
        isPlaying={isPlaying}
      />

      <div 
        onClick={triggerTractorEngine}
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-10 z-30 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-xs text-white/70 hover:text-white hover:bg-black/50 transition-all cursor-pointer hidden md:flex items-center gap-2"
      >
        <span>Click tractor or press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded">T</kbd> to rev engine</span>
      </div>
    </main>
  );
}
