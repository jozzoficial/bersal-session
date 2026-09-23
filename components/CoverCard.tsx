'use client';

import React from 'react';
import { Disc, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { DEFAULT_EP_SETTINGS } from '@/lib/constants';

interface CoverCardProps {
  coverUrl?: string;
  title?: string;
}

export default function CoverCard({ coverUrl, title }: CoverCardProps) {
  const url = coverUrl || DEFAULT_EP_SETTINGS.cover_url || '';

  return (
    <div className="relative w-full max-w-[440px] mx-auto py-4 pl-2 pr-6 sm:pr-10 group select-none">
      {/* Container de Profundidade 3D com Vinil Deslizando */}
      <div className="relative flex items-center justify-center">
        {/* Disco de Vinil que emerge do encarte */}
        <div className="absolute -right-3 sm:-right-8 w-[88%] aspect-square rounded-full bg-[#0d0c14] border-4 border-[#222030] shadow-[0_15px_35px_rgba(0,0,0,0.95)] flex items-center justify-center transition-all duration-700 ease-out translate-x-5 sm:translate-x-8 group-hover:translate-x-10 sm:group-hover:translate-x-14 group-hover:rotate-45 pointer-events-none z-0">
          {/* Ranhuras do vinil concêntricas */}
          <div className="absolute inset-2 rounded-full border border-white/5" />
          <div className="absolute inset-5 rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
          <div className="absolute inset-12 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/10" />
          <div className="absolute inset-20 rounded-full border border-white/5" />

          {/* Rótulo Central do Vinil */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#7c52ff] via-[#e8517a] to-[#e8c76b] p-[2px] shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#09090f] flex flex-col items-center justify-center text-center p-1">
              <span className="text-[7px] font-extrabold text-[#e8c76b] uppercase tracking-wider">
                BERSAL
              </span>
              <span className="text-[9px] font-black text-white tracking-tight">
                SESSION I
              </span>
              <span className="text-[6px] text-[#a77fff] font-mono mt-0.5">
                33⅓ RPM
              </span>
              {/* Furo central do vinil */}
              <div className="w-3 h-3 rounded-full bg-[#181622] border border-white/20 mt-1 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Capa Principal / Encarte Quadrado */}
        <div className="relative z-10 w-[88%] aspect-square rounded-2xl overflow-hidden bg-[#16143a] border border-[#7c52ff]/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group-hover:shadow-[0_25px_60px_rgba(124,82,255,0.25)] transition-all duration-500">
          {/* Imagem da Capa */}
          <img
            src={url}
            alt={title || 'Capa Oficial BERSAL SESSION I - Bersal Studios'}
            className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradientes e Vinhetas de Acabamento Analógico */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090f]/90 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

          {/* Badge Superior: Qualidade de Áudio */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09090f]/85 backdrop-blur-md border border-[#7c52ff]/30 shadow-lg">
            <Volume2 className="w-3.5 h-3.5 text-[#a77fff]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold text-white tracking-wider">
              96kHz / 24-bit Master
            </span>
          </div>

          {/* Badge Superior Direito: Edição Limitada */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e8c76b]/20 backdrop-blur-md border border-[#e8c76b]/40">
            <Sparkles className="w-3 h-3 text-[#e8c76b]" />
            <span className="text-[10px] font-bold text-[#ffe49e] uppercase tracking-wider">
              Analógico
            </span>
          </div>

          {/* Barra Inferior em Glassmorphism */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-[#12102a]/90 backdrop-blur-md border border-[#7c52ff]/25 shadow-lg">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#a77fff] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#22d4a6]" /> Gravação Valvulada
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                9 Faixas Masterizadas
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8517a] to-[#7c52ff] flex items-center justify-center text-white shadow-md group-hover:rotate-90 transition-transform duration-500">
              <Disc className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

