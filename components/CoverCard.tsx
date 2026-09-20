'use client';

import React from 'react';
import Image from 'next/image';
import { Disc, Sparkles, Volume2 } from 'lucide-react';
import { DEFAULT_EP_SETTINGS } from '@/lib/constants';

interface CoverCardProps {
  coverUrl?: string;
  title?: string;
}

export default function CoverCard({ coverUrl, title }: CoverCardProps) {
  const url = coverUrl || DEFAULT_EP_SETTINGS.cover_url || '';

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto rounded-2xl overflow-hidden bg-[#1c1b1d] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
      {/* Imagem da Capa */}
      <img
        src={url}
        alt={title || 'Capa Oficial BERSAL SESSION I - Bersal Studios'}
        className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradientes e Vinhetas */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent opacity-80 pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

      {/* Badge Superior: Qualidade de Áudio */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e0e10]/85 backdrop-blur-md border border-white/10 shadow-lg">
        <Volume2 className="w-3.5 h-3.5 text-[#e8c76b]" />
        <span className="text-[11px] font-bold text-white tracking-wider">
          96kHz / 24-bit Master
        </span>
      </div>

      {/* Badge Superior Direito: Edição Limitada */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e8c76b]/15 backdrop-blur-md border border-[#e8c76b]/30">
        <Sparkles className="w-3 h-3 text-[#e8c76b]" />
        <span className="text-[10px] font-bold text-[#ffe49e] uppercase tracking-wider">
          Fita Analógica
        </span>
      </div>

      {/* Barra Inferior em Glassmorphism com Detalhes */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-[#201f21]/90 backdrop-blur-md border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8c76b]">
            Gravação Valvulada
          </span>
          <span className="text-sm font-extrabold text-white">
            9 Faixas Exclusivas
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#e8c76b] flex items-center justify-center text-[#0b0b0d] shadow-md group-hover:rotate-45 transition-transform">
          <Disc className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
