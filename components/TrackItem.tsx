'use client';

import React from 'react';
import { Play, Pause, Plus, Check, Star, Radio } from 'lucide-react';
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
      ? Math.min(100, (currentTime / (duration || 30)) * 100)
      : 0;

  const currentSeconds =
    activeTrackNumber === track.track_number ? Math.floor(currentTime) : 0;

  // Separar artista e título se houver formato "Artista : Titulo"
  let artistName = '';
  let songTitle = track.title;
  if (track.title.includes(':')) {
    const parts = track.title.split(':');
    artistName = parts[0].trim();
    songTitle = parts.slice(1).join(':').trim();
  }

  return (
    <div
      className={`group flex flex-col p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isCurrentPlaying
          ? 'bg-gradient-to-r from-[#1c1a42] to-[#16143a] border-[#e8517a]/50 shadow-[0_10px_30px_rgba(232,81,122,0.18)]'
          : track.is_featured
          ? 'bg-[#1a1740] border-[#7c52ff]/35 shadow-[0_8px_24px_rgba(124,82,255,0.12)]'
          : 'bg-[#141232]/85 hover:bg-[#18163c] border-[#7c52ff]/15 hover:border-[#7c52ff]/35 shadow-sm'
      }`}
    >
      {/* Luz ambiente de destaque se estiver tocando */}
      {isCurrentPlaying && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#e8517a]/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Badge de Destaque se for a faixa foco */}
      {track.is_featured && (
        <div className="flex items-center justify-between mb-2 pb-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#e8517a] to-[#7c52ff] text-white text-[10px] uppercase tracking-wider font-extrabold shadow-sm">
            <Star className="w-3 h-3 fill-current" /> Faixa Foco
          </div>
          <span className="text-[10px] font-bold text-[#a77fff] uppercase tracking-widest">
            Mais Aguardada
          </span>
        </div>
      )}

      {/* Linha Superior: Número, Artista/Título, Duração e Preço */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          {/* Número da faixa estilizado */}
          <div className="flex flex-col items-center justify-center shrink-0 w-8 pt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#7c52ff]/50 font-mono select-none group-hover:text-[#a77fff] transition-colors">
              {track.track_number < 10 ? `0${track.track_number}` : track.track_number}
            </span>
            {isCurrentPlaying && (
              <div className="flex items-end gap-0.5 h-3 mt-1">
                <span className="w-0.5 bg-[#e8517a] waveform-bar h-full" />
                <span className="w-0.5 bg-[#7c52ff] waveform-bar h-3/4" />
                <span className="w-0.5 bg-[#e8c76b] waveform-bar h-full" />
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            {artistName && (
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a77fff] truncate">
                {artistName}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold text-white truncate tracking-tight">
              {songTitle}
            </h3>
            {track.description && (
              <p className="text-xs text-[#b5b0d5] line-clamp-1 mt-0.5">
                {track.description}
              </p>
            )}
          </div>
        </div>

        {/* Preço e Duração */}
        <div className="flex flex-col items-end shrink-0 pl-2">
          <span className="text-base sm:text-lg font-black text-[#e8c76b] font-mono tracking-tight">
            {formatKz(track.price_kz)}
          </span>
          <span className="text-[11px] font-medium text-[#6a6690]">
            {formatTime(track.duration_seconds)}
          </span>
        </div>
      </div>

      {/* Linha Inferior: Player & Adicionar ao Carrinho */}
      <div className="flex items-center gap-3 sm:gap-4 mt-3.5 pt-2 border-t border-white/[0.04]">
        {/* Botão Play/Pause */}
        <button
          type="button"
          onClick={() => togglePlay(track.track_number, track.preview_url)}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer ${
            isCurrentPlaying
              ? 'bg-gradient-to-br from-[#e8517a] to-[#7c52ff] text-white ring-4 ring-[#e8517a]/25 shadow-[0_0_20px_rgba(232,81,122,0.45)]'
              : 'bg-[#1c1a42] text-[#a77fff] hover:bg-[#252254] hover:text-white border border-[#7c52ff]/30 hover:border-[#7c52ff]/60'
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
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <div className="w-full h-2 rounded-full bg-[#09090f] relative overflow-hidden border border-[#7c52ff]/20">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                isCurrentPlaying
                  ? 'bg-gradient-to-r from-[#7c52ff] via-[#e8517a] to-[#e8c76b]'
                  : 'bg-transparent'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-mono text-[#a77fff] font-bold">
              0:{currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds} / 0:30
            </span>
            <span className="uppercase tracking-widest font-bold text-[#6a6690] flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#22d4a6]" /> Prévia HD Valvulada
            </span>
          </div>
        </div>

        {/* Botão Adicionar/Remover do Carrinho */}
        <button
          type="button"
          onClick={() => toggleTrack(track)}
          className={`min-h-[42px] px-3.5 sm:px-4 rounded-full font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer ${
            isSelected
              ? 'bg-gradient-to-r from-[#e8517a] to-[#7c52ff] text-white shadow-[0_0_16px_rgba(232,81,122,0.35)]'
              : 'bg-[#1c1a42] hover:bg-[#252254] text-[#b5b0d5] hover:text-white border border-[#7c52ff]/25 hover:border-[#7c52ff]/50'
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

