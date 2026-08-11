'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerControllerProps {
  videoId: string;
  isPlaying: boolean;
  onPlayerReady?: (player: any) => void;
  onStateChange?: (stateCode: number, target: any) => void;
  onTimeUpdate?: (current: number, duration: number) => void;
  onError?: (errorCode: number) => void;
}

export default function YouTubePlayerController({
  videoId,
  isPlaying,
  onPlayerReady,
  onStateChange,
  onTimeUpdate,
  onError
}: YouTubePlayerControllerProps) {
  const playerRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const readyRef = useRef<boolean>(false);
  const currentVideoIdRef = useRef<string>(videoId);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    currentVideoIdRef.current = videoId;
    isPlayingRef.current = isPlaying;
  }, [videoId, isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (playerRef.current) return;

      try {
        playerRef.current = new window.YT.Player('yt-player-instance', {
          height: '100%',
          width: '100%',
          videoId: currentVideoIdRef.current,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              readyRef.current = true;
              if (onPlayerReady) onPlayerReady(event.target);
            },
            onStateChange: (event: any) => {
              if (onStateChange) onStateChange(event.data, event.target);
            },
            onError: (event: any) => {
              console.warn('YT Error code:', event.data, 'for video:', currentVideoIdRef.current);
              if (onError) onError(event.data);
            }
          }
        });
      } catch (err) {
        console.warn('Error initializing YT Player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle track change
  useEffect(() => {
    if (readyRef.current && playerRef.current && videoId) {
      try {
        if (isPlayingRef.current) {
          playerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: 0
          });
        } else {
          playerRef.current.cueVideoById({
            videoId: videoId,
            startSeconds: 0
          });
        }
      } catch (e) {
        console.warn('Error changing video:', e);
      }
    }
  }, [videoId]);

  // Sync play/pause
  useEffect(() => {
    if (readyRef.current && playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      try {
        const state = playerRef.current.getPlayerState();
        if (isPlaying && state !== window.YT?.PlayerState?.PLAYING && state !== window.YT?.PlayerState?.BUFFERING) {
          playerRef.current.playVideo();
        } else if (!isPlaying && state === window.YT?.PlayerState?.PLAYING) {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.warn('Error syncing play/pause:', e);
      }
    }
  }, [isPlaying]);

  // Time & duration update loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const current = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || 0;
            if (onTimeUpdate) onTimeUpdate(current, dur);
          } catch (e) {}
        }
      }, 400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onTimeUpdate]);

  return (
    <div
      className="fixed bottom-0 right-0 w-24 h-16 pointer-events-none opacity-0 z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      <div id="yt-player-instance" className="w-full h-full" />
    </div>
  );
}
