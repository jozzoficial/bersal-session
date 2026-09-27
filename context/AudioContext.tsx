'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playSynthesizedPreview, stopAllSynthesizedPreviews } from '@/lib/audioSynth';

interface AudioContextType {
  activeTrackNumber: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  togglePlay: (trackNumber: number, previewUrl?: string) => void;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeTrackNumber, setActiveTrackNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const duration = 30; // 30 segundos de prévia por especificação

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthControllerRef = useRef<{ stop: () => void } | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayback = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }
    if (synthControllerRef.current) {
      synthControllerRef.current.stop();
      synthControllerRef.current = null;
    }
    stopAllSynthesizedPreviews();
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveTrackNumber(null);
  };

  const startSynthPlayback = (trackNumber: number) => {
    synthControllerRef.current = playSynthesizedPreview(trackNumber, () => {
      stopPlayback();
    }) || null;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration - 0.2) {
          stopPlayback();
          return 0;
        }
        return Number((prev + 0.25).toFixed(2));
      });
    }, 250);
  };

  // Resolução da URL da prévia com prioridade para ficheiros MP3 locais
  const resolveAudioUrl = (trackNumber: number, url?: string): string => {
    // Se a URL for do GitHub releases, redirecionamos para o ficheiro local compatível com iOS
    if (!url || url.includes('github.com/jozzoficial/bersal-session/releases') || url.includes('track5_preview')) {
      return `/audio/previews/track-${trackNumber}.mp3`;
    }
    return url;
  };

  const togglePlay = (trackNumber: number, previewUrl?: string) => {
    const audio = audioRef.current;

    // Se já estiver a reproduzir esta mesma faixa, pausa
    if (activeTrackNumber === trackNumber && isPlaying) {
      if (audio) {
        try {
          audio.pause();
        } catch {}
      }
      if (synthControllerRef.current) {
        synthControllerRef.current.stop();
        synthControllerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    // Se estiver a reproduzir outra faixa, pára primeiro
    if (audio) {
      try {
        audio.pause();
      } catch {}
    }
    if (synthControllerRef.current) {
      synthControllerRef.current.stop();
      synthControllerRef.current = null;
    }
    stopAllSynthesizedPreviews();
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setActiveTrackNumber(trackNumber);
    setIsPlaying(true);
    setCurrentTime(0);

    const targetUrl = resolveAudioUrl(trackNumber, previewUrl);

    if (audio) {
      // Configurar propriedades essenciais para iOS Safari / WebKit
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';
      audio.src = targetUrl;
      audio.currentTime = 0;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reprodução nativa iniciada com sucesso
          })
          .catch((err) => {
            console.warn('Falha no áudio nativo, tentando fallback:', err);
            // Fallback sintético caso o dispositivo bloqueie ficheiros de áudio
            startSynthPlayback(trackNumber);
          });
      }
    } else {
      startSynthPlayback(trackNumber);
    }
  };

  const pause = () => {
    if (isPlaying) {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
      }
      if (synthControllerRef.current) {
        synthControllerRef.current.stop();
        synthControllerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && isPlaying) {
      const cur = audioRef.current.currentTime;
      setCurrentTime(cur);
      if (cur >= duration) {
        stopPlayback();
      }
    }
  };

  const handleEnded = () => {
    stopPlayback();
  };

  const handleError = () => {
    if (activeTrackNumber && isPlaying) {
      startSynthPlayback(activeTrackNumber);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activeTrackNumber,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        pause,
      }}
    >
      {/* Elemento de áudio HTML5 montado no DOM para compatibilidade total com iOS Safari */}
      <audio
        ref={audioRef}
        playsInline
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        style={{ display: 'none' }}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio deve ser usado dentro de um AudioProvider');
  }
  return context;
}
