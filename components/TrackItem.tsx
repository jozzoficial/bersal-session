'use client';

import React from 'react';
import { Play, Pause, Plus, Check, Star } from 'lucide-react';
import { Track } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useAudio } from '@/context/AudioContext';
import { formatKz, formatTime } from '@/lib/constants';

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  const { selectedTracks, isFullEp, toggleTrack } = useCart();
  const { activeTrackNumber, isPlaying, currentTime, duration, togglePlay } = useAudio();

  const isCurrentPlaying = activeTrackNumber === track.track_number && isPlaying;
  const isSelected = !isFullEp && selectedTracks.some((t) => t.id === track.id);

  const progressPercent =
    activeTrackNumber === track.track_number
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  const currentSeconds =
    activeTrackNumber === track.track_number ? Math.floor(currentTime) : 0;

  return (
    <div
      className={`flex flex-col p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
        track.is_featured
          ? 'bg-[#201f21] border-[#e8c76b]/35 shadow-[0_8px_24px_rgba(232,199,107,0.08)]'
          : 'bg-[#1c1b1d] border-white/5 hover:border-white/15 shadow-md'
      }`}
    >
      {/* Badge de Destaque se for a faixa foco */}
      {track.is_featured && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8c76b] text-[#0b0b0d] text-[10px] uppercase tracking-wider font-extrabold shadow-sm">
            <Star className="w-3 h-3 fill-current" /> Faixa Foco
          </div>
          <span className="text-[10px] font-bold text-[#e8c76b] uppercase tracking-widest">
            Mais Aguardada
          </span>
        </div>
      )}

      {/* Linha Superior: Número, Título, Duração e Preço */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-xl font-extrabold text-[#ffe49e] font-mono select-none pt-0.5">
            {track.track_number < 10 ? `0${track.track_number}` : track.track_number}
          </span>
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-white truncate group-hover:text-[#ffe49e] transition-colors">
              {track.title}
            </h3>
            {track.description && (
              <p className="text-xs text-[#cfc5b2] line-clamp-1 mt-0.5">
                {track.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-base font-extrabold text-[#e8c76b] font-mono">
            {formatKz(track.price_kz)}
          </span>
          <span className="text-[11px] font-medium text-[#98907e]">
            {formatTime(track.duration_seconds)}
          </span>
        </div>
      </div>

      {/* Linha do Player & Adicionar ao Carrinho */}
      <div className="flex items-center gap-3 mt-3 pt-1">
        {/* Botão Play/Pause */}
        <button
          type="button"
          onClick={() => togglePlay(track.track_number, track.preview_url)}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 ${
            isCurrentPlaying
              ? 'bg-[#e8c76b] text-[#0b0b0d] ring-2 ring-[#e8c76b]/50 shadow-[0_0_15px_rgba(232,199,107,0.4)]'
              : 'bg-[#2a2a2c] text-[#ffe49e] hover:bg-[#353437] hover:text-[#e8c76b]'
          }`}
          title={isCurrentPlaying ? 'Pausar prévia' : 'Ouvir prévia de 30s'}
        >
          {isCurrentPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Barra de Progresso da Prévia */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="w-full h-2 rounded-full bg-[#2a2a2c] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#ffe49e] to-[#e8c76b] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#98907e]">
            <span className="font-mono text-[#e8c76b] font-semibold">
              0:{currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds} / 0:30
            </span>
            <span className="uppercase tracking-wider font-semibold text-[#cfc5b2]">
              Prévia HD
            </span>
          </div>
        </div>

        {/* Botão Adicionar/Remover */}
        <button
          type="button"
          onClick={() => toggleTrack(track)}
          className={`min-h-[44px] px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
            isSelected
              ? 'bg-[#e8c76b] text-[#0b0b0d] shadow-[0_0_12px_rgba(232,199,107,0.3)]'
              : 'bg-[#2a2a2c] hover:bg-[#353437] text-white hover:text-[#ffe49e]'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 text-[#0b0b0d]" />
              <span>Adicionado</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-[#e8c76b]" />
              <span>Adicionar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
