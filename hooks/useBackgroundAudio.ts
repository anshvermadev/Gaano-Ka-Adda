'use client';

import { useEffect, useRef } from 'react';
import { Song } from '../data/songs';

interface BackgroundAudioOptions {
  isPlaying: boolean;
  currentSong?: Song;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (time: number) => void;
}

export function useBackgroundAudio({
  isPlaying,
  currentSong,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
}: BackgroundAudioOptions) {
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize silent audio anchor for background playback on mobile / tab switch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 44-byte silent WAV data URI
    const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    const audio = new Audio(silentWav);
    audio.loop = true;
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    silentAudioRef.current = audio;

    return () => {
      audio.pause();
      silentAudioRef.current = null;
    };
  }, []);

  // Manage silent audio anchor state to keep OS media thread active in background
  useEffect(() => {
    const audio = silentAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Will resume after user interaction
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // MediaSession API Integration (Lock Screen, Notification Center, Background Controls)
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentSong) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'गानों का अड्डा (Gaano Ka Adda)',
        artwork: [
          { src: currentSong.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '384x384', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      if (onPlay) navigator.mediaSession.setActionHandler('play', onPlay);
      if (onPause) navigator.mediaSession.setActionHandler('pause', onPause);
      if (onNext) navigator.mediaSession.setActionHandler('nexttrack', onNext);
      if (onPrevious) navigator.mediaSession.setActionHandler('previoustrack', onPrevious);
      if (onSeek) {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) onSeek(details.seekTime);
        });
      }
    } catch (err) {
      console.warn('MediaSession initialization error:', err);
    }
  }, [currentSong, onPlay, onPause, onNext, onPrevious, onSeek]);
}
