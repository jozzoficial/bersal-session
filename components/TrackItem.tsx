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
          ? 'bg-[#1c1a42] border-[#7c52ff]/35 shadow-[0_8px_24px_rgba(124,82,255,0.15)]'
          : 'bg-[#16143a] border-[#7c52ff]/14 hover:border-[#7c52ff]/30 shadow-md'
      }`}
    >
      {/* Badge de Destaque se for a faixa foco */}
      {track.is_featured && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#e8517a] to-[#7c52ff] text-white text-[10px] uppercase tracking-wider font-extrabold shadow-sm">
            <Star className="w-3 h-3 fill-current" /> Faixa Foco
          </div>
          <span className="text-[10px] font-bold text-[#a77fff] uppercase tracking-widest">
            Mais Aguardada
          </span>
        </div>
      )}

      {/* Linha Superior: Número, Título, Duração e Preço */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-xl font-extrabold text-[#7c52ff]/60 font-mono select-none pt-0.5">
            {track.track_number < 10 ? `0${track.track_number}` : track.track_number}
          </span>
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {track.title}
            </h3>
            {track.description && (
              <p className="text-xs text-[#b5b0d5] line-clamp-1 mt-0.5">
                {track.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-base font-extrabold text-[#e8c76b] font-mono">
            {formatKz(track.price_kz)}
          </span>
          <span className="text-[11px] font-medium text-[#6a6690]">
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
              ? 'bg-gradient-to-br from-[#e8517a] to-[#7c52ff] text-white ring-2 ring-[#e8517a]/40 shadow-[0_0_18px_rgba(232,81,122,0.4)]'
              : 'bg-[#1c1a42] text-[#a77fff] hover:bg-[#231f50] hover:text-white border border-[#7c52ff]/25 hover:border-[#7c52ff]/50'
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
          <div className="w-full h-1.5 rounded-full bg-[#7c52ff]/15 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#7c52ff] to-[#e8517a] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#6a6690]">
            <span className="font-mono text-[#a77fff] font-semibold">
              0:{currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds} / 0:30
            </span>
            <span className="uppercase tracking-wider font-semibold text-[#b5b0d5]">
              Prévia HD
            </span>
          </div>
        </div>

        {/* Botão Adicionar/Remover */}
        <button
          type="button"
          onClick={() => toggleTrack(track)}
          className={`min-h-[44px] px-4 rounded-full font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
            isSelected
              ? 'bg-gradient-to-r from-[#e8517a] to-[#7c52ff] text-white shadow-[0_0_16px_rgba(232,81,122,0.35)]'
              : 'bg-[#1c1a42] hover:bg-[#231f50] text-[#b5b0d5] hover:text-white border border-[#7c52ff]/20 hover:border-[#7c52ff]/40'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              <span>Adicionado</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-[#a77fff]" />
              <span>Adicionar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
