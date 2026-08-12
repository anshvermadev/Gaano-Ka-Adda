'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroBannerLofi from '../../components/HeroBannerLofi';
import AudioPlayer, { RepeatMode } from '../../components/AudioPlayer';
import PlaylistDrawer from '../../components/PlaylistDrawer';
import YouTubePlayerController from '../../components/YouTubePlayerController';
import AmbientAtmosphere from '../../components/AmbientAtmosphere';
import { useBackgroundAudio } from '../../hooks/useBackgroundAudio';
import { SONGS_LOFI, Song } from '../../data/songs-lofi';

export default function LofiPage(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');

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

  const currentSong: Song = SONGS_LOFI[currentIndex] || SONGS_LOFI[0];

  const getRandomIndex = (currIdx: number): number => {
    if (SONGS_LOFI.length <= 1) return 0;
    let nextIdx = currIdx;
    while (nextIdx === currIdx) {
      nextIdx = Math.floor(Math.random() * SONGS_LOFI.length);
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

  const togglePlay = () => {
    initAudioContext();
    if (!ytPlayerRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    try {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
      } else {
        ytPlayerRef.current.playVideo();
      }
    } catch (e) {
      console.warn('Play/Pause error:', e);
    }
  };

  const handleSeek = (seekTime: number) => {
    setCurrentTime(seekTime);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(seekTime, true);
    }
  };

  const handlePlayNext = useCallback(() => {
    initAudioContext();
    let nextIdx: number;
    if (isShuffleRef.current) {
      nextIdx = getRandomIndex(currentIndexRef.current);
    } else {
      nextIdx = (currentIndexRef.current + 1) % SONGS_LOFI.length;
    }
    setCurrentIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS_LOFI[nextIdx].videoId);
      } catch (e) {}
    }
  }, []);

  const handlePlayPrevious = useCallback(() => {
    initAudioContext();
    let prevIdx: number;
    if (currentTime > 4) {
      handleSeek(0);
      return;
    }
    if (isShuffleRef.current) {
      prevIdx = getRandomIndex(currentIndexRef.current);
    } else {
      prevIdx = (currentIndexRef.current - 1 + SONGS_LOFI.length) % SONGS_LOFI.length;
    }
    setCurrentIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS_LOFI[prevIdx].videoId);
      } catch (e) {}
    }
  }, [currentTime]);

  const handleSelectSong = (index: number) => {
    initAudioContext();
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(SONGS_LOFI[index].videoId);
      } catch (e) {}
    }
  };

  // Background Audio Hook for continuous lock-screen / tab-switch audio
  useBackgroundAudio({
    isPlaying,
    currentSong,
    onPlay: togglePlay,
    onPause: togglePlay,
    onNext: handlePlayNext,
    onPrevious: handlePlayPrevious,
    onSeek: handleSeek,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
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
      handleSongEnded();
    }
  }, []);

  const handleTimeUpdate = useCallback((curr: number, dur: number) => {
    setCurrentTime(curr);
    if (dur && dur > 0) {
      setDuration(dur);
    }
  }, []);

  const handleYTError = useCallback((errorCode: number) => {
    console.warn('Playback error encountered:', errorCode, 'Skipping to next track...');
    if (errorCode === 100 || errorCode === 101 || errorCode === 150) {
      setTimeout(() => {
        handlePlayNext();
      }, 500);
    }
  }, [handlePlayNext]);

  const handleSongEnded = useCallback(() => {
    const mode = repeatModeRef.current;
    if (mode === 'one') {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(0);
        ytPlayerRef.current.playVideo();
      }
    } else if (mode === 'all') {
      handlePlayNext();
    } else {
      if (currentIndexRef.current === SONGS_LOFI.length - 1) {
        setIsPlaying(false);
      } else {
        handlePlayNext();
      }
    }
  }, [handlePlayNext]);

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  return (
    <main className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#0d0714] text-cream font-sans select-none flex flex-col justify-between">
      {/* Off-screen YouTube IFrame Audio Controller */}
      <YouTubePlayerController
        videoId={currentSong?.videoId || "U5ewn_HTZaM"}
        isPlaying={isPlaying}
        onPlayerReady={handleYTPlayerReady}
        onStateChange={handleYTStateChange}
        onTimeUpdate={handleTimeUpdate}
        onError={handleYTError}
      />

      {/* Ambient Particle & Dreamy Pastel Sparkle Engine */}
      <AmbientAtmosphere era="lofi" />

      {/* Global Navbar */}
      <Navbar currentEra="lofi" />

      {/* Hero Visual & Lofi Memories Banner */}
      <HeroBannerLofi />

      {/* Floating Glassmorphic Audio Player */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        onPrevious={handlePlayPrevious}
        onNext={handlePlayNext}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        isShuffle={isShuffle}
        toggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        toggleRepeat={toggleRepeat}
      />

      {/* Slide-up Searchable Lofi Playlist Drawer */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentIndex={currentIndex}
        onSelectSong={handleSelectSong}
        isPlaying={isPlaying}
        songs={SONGS_LOFI}
        title="लो-फाई लव Playlist"
        ytMusicUrl="https://www.youtube.com/playlist?list=PLi-epCWqWTgKjhTGZVkmN3OLBRQG2mt2W"
      />
    </main>
  );
}
