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
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopAllSynthesizedPreviews();
    };
  }, []);

  const togglePlay = (trackNumber: number, previewUrl?: string) => {
    // Se já estiver tocando esta mesma faixa, pausa
    if (activeTrackNumber === trackNumber && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (synthControllerRef.current) {
        synthControllerRef.current.stop();
        synthControllerRef.current = null;
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsPlaying(false);
      return;
    }

    // Para qualquer outra faixa ativa antes de começar a nova
    stopPlayback();

    setActiveTrackNumber(trackNumber);
    setIsPlaying(true);
    setCurrentTime(0);

    // Tentar tocar arquivo de áudio real se url for válido e não-demo
    if (previewUrl && previewUrl.startsWith('http')) {
      if (audioRef.current) {
        audioRef.current.src = previewUrl;
        audioRef.current.onended = () => {
          stopPlayback();
        };
        audioRef.current.onerror = () => {
          startSynthPlayback(trackNumber);
        };
        audioRef.current
          .play()
          .then(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = setInterval(() => {
              if (audioRef.current) {
                const cur = audioRef.current.currentTime;
                setCurrentTime(cur);
                if (cur >= duration) {
                  stopPlayback();
                }
              }
            }, 250);
          })
          .catch(() => {
            startSynthPlayback(trackNumber);
          });
      }
    } else {
      // Usar o sintetizador realista diretamente
      startSynthPlayback(trackNumber);
    }
  };

  const pause = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (synthControllerRef.current) {
        synthControllerRef.current.stop();
        synthControllerRef.current = null;
      }
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsPlaying(false);
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
