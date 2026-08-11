'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '../../components/Header';
import HeroBanner2000s from '../../components/HeroBanner2000s';
import AudioPlayer, { RepeatMode } from '../../components/AudioPlayer';
import PlaylistDrawer from '../../components/PlaylistDrawer';
import YouTubePlayerController from '../../components/YouTubePlayerController';
import AmbientAtmosphere from '../../components/AmbientAtmosphere';
import { useBackgroundAudio } from '../../hooks/useBackgroundAudio';
import { SONGS_2000S, Song } from '../../data/songs-2000s';

export default function Page2000s(): React.JSX.Element {
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

  useEffect(() => {
    isShuffleRef.current = isShuffle;
    repeatModeRef.current = repeatMode;
    currentIndexRef.current = currentIndex;
  }, [isShuffle, repeatMode, currentIndex]);

  const currentSong: Song = SONGS_2000S[currentIndex] || SONGS_2000S[0];

  const getRandomIndex = (currIdx: number): number => {
    if (SONGS_2000S.length <= 1) return 0;
    let nextIdx = currIdx;
    while (nextIdx === currIdx) {
      nextIdx = Math.floor(Math.random() * SONGS_2000S.length);
    }
    return nextIdx;
  };

  const togglePlay = () => {
    if (!ytPlayerRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  };

  const handleSeek = (seekTime: number) => {
    setCurrentTime(seekTime);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(seekTime, true);
    }
  };

  const handlePlayNext = useCallback(() => {
    if (isShuffleRef.current) {
      const nextIdx = getRandomIndex(currentIndexRef.current);
      setCurrentIndex(nextIdx);
    } else {
      setCurrentIndex((prev) => (prev + 1) % SONGS_2000S.length);
    }
    setIsPlaying(true);
  }, []);

  const handlePlayPrevious = useCallback(() => {
    if (isShuffleRef.current) {
      const prevIdx = getRandomIndex(currentIndexRef.current);
      setCurrentIndex(prevIdx);
    } else {
      setCurrentIndex((prev) => (prev - 1 + SONGS_2000S.length) % SONGS_2000S.length);
    }
    setIsPlaying(true);
  }, []);

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
      if (currentIndexRef.current === SONGS_2000S.length - 1) {
        setIsPlaying(false);
      } else {
        handlePlayNext();
      }
    }
  }, [handlePlayNext]);

  const handleSelectSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

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
    <main className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#0d0914] text-cream font-sans select-none flex flex-col justify-between">
      {/* Off-screen YouTube IFrame Audio Controller */}
      <YouTubePlayerController
        videoId={currentSong?.videoId || "pxl0rQ6TeXI"}
        isPlaying={isPlaying}
        onPlayerReady={handleYTPlayerReady}
        onStateChange={handleYTStateChange}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Ambient Particle & Aesthetic Engine */}
      <AmbientAtmosphere isTractorRevving={false} />

      {/* Global Header with Era Navigation */}
      <Header currentEra="2000s" />

      {/* 90s to 2000s Hero Visual & Memory Banner */}
      <HeroBanner2000s />

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

      {/* Slide-up Searchable 2000s Playlist Drawer */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentIndex={currentIndex}
        onSelectSong={handleSelectSong}
        isPlaying={isPlaying}
        songs={SONGS_2000S}
        title="सदाबहार 2000s Playlist"
        ytMusicUrl="https://www.youtube.com/playlist?list=PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux"
      />
    </main>
  );
}
