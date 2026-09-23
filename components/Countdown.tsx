'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Radio, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface CountdownProps {
  targetDate?: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 37,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    // Definir targetDate: se passado usar, caso contrário 30 de Outubro de 2026 às 20:00 GMT+1
    const target = targetDate
      ? new Date(targetDate).getTime()
      : new Date('2026-10-30T20:00:00+01:00').getTime();

    const calculateTime = () => {
      const now = Date.now();
      const distance = target - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="w-full my-6 flex flex-col gap-4">
      {/* Container Principal do Cronômetro */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#16143a] via-[#12102a] to-[#09090f] border border-[#7c52ff]/25 p-5 sm:p-6 shadow-[0_12px_36px_rgba(124,82,255,0.12)]">
        {/* Glow de fundo */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#7c52ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#e8517a]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Bloco: Título do Cronograma e Status em tempo real */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 pb-4 border-b border-[#7c52ff]/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c1a42] border border-[#7c52ff]/30 flex items-center justify-center text-[#a77fff]">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a77fff]">
                Cronograma de Lançamento
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Contagem Regressiva para a Estreia
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22d4a6]/10 border border-[#22d4a6]/25 text-[#22d4a6] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22d4a6] animate-pulse" />
              Fase 01 Ativa
            </span>
          </div>
        </div>

        {/* HUD dos Números (Cards Digitais com Estilo Studio) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {/* Dias */}
          <div className="relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#09090f]/80 border border-[#7c52ff]/25 shadow-inner group">
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#7c52ff] to-transparent" />
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {pad(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#a77fff] tracking-wider uppercase mt-1">
              Dias
            </span>
          </div>

          {/* Horas */}
          <div className="relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#09090f]/80 border border-[#7c52ff]/25 shadow-inner group">
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#7c52ff] to-transparent" />
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#a77fff] tracking-wider uppercase mt-1">
              Horas
            </span>
          </div>

          {/* Minutos */}
          <div className="relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#09090f]/80 border border-[#7c52ff]/25 shadow-inner group">
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#7c52ff] to-transparent" />
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#a77fff] tracking-wider uppercase mt-1">
              Min
            </span>
          </div>

          {/* Segundos */}
          <div className="relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-[#09090f]/80 border border-[#e8517a]/40 shadow-inner group">
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#e8517a] to-transparent" />
            <span className="text-2xl sm:text-4xl font-extrabold text-[#e8517a] font-mono tracking-tight animate-pulse">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#e8517a]/90 tracking-wider uppercase mt-1">
              Seg
            </span>
          </div>
        </div>

        {/* Sub-barra: Data Oficial de Lançamento */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#7c52ff]/10 text-xs text-[#b5b0d5]">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#e8c76b]" />
            <strong className="text-white">Data de Estreia:</strong> 30 de Outubro de 2026 · 20:00 (GMT+1)
          </span>
          <span className="text-[11px] text-[#a77fff] font-semibold">
            ✦ Envio Automático aos Compradores
          </span>
        </div>
      </div>

      {/* Linha do Tempo das Fases de Lançamento (Cronograma Visual Profissional) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#12102a]/90 border border-[#7c52ff]/20 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#a77fff]" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#a77fff]">
              Fases do Cronograma Oficial
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#6a6690]">
            3 Etapas Estruturadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Fase 1 */}
          <div className="relative p-3.5 rounded-xl bg-[#16143a] border border-[#22d4a6]/40 flex flex-col justify-between gap-2 shadow-[0_0_15px_rgba(34,212,166,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#22d4a6] tracking-wider uppercase bg-[#22d4a6]/15 px-2 py-0.5 rounded-full border border-[#22d4a6]/30">
                Fase 01 · Atual
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d4a6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22d4a6]"></span>
              </span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Pré-Venda & Prévias VIP
              </h4>
              <p className="text-[11px] text-[#b5b0d5] mt-1 leading-relaxed">
                Audição de prévias em HD e venda com desconto exclusivo de lançamento (4.000 Kz).
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#22d4a6] pt-1 border-t border-[#22d4a6]/15 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Em Andamento
            </div>
          </div>

          {/* Fase 2 */}
          <div className="relative p-3.5 rounded-xl bg-[#16143a]/70 border border-[#7c52ff]/25 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#a77fff] tracking-wider uppercase bg-[#7c52ff]/15 px-2 py-0.5 rounded-full border border-[#7c52ff]/30">
                Fase 02 · 12 Outubro
              </span>
              <Clock className="w-3.5 h-3.5 text-[#a77fff]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Liberação dos Masters
              </h4>
              <p className="text-[11px] text-[#b5b0d5] mt-1 leading-relaxed">
                Publicação do single preview do projeto Bersal Session I.
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#a77fff] pt-1 border-t border-[#7c52ff]/15 font-semibold">
              20:00 (GMT+1) · Entrega Imediata
            </div>
          </div>

          {/* Fase 3 */}
          <div className="relative p-3.5 rounded-xl bg-[#16143a]/40 border border-[#7c52ff]/15 flex flex-col justify-between gap-2 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#6a6690] tracking-wider uppercase bg-[#1c1a42] px-2 py-0.5 rounded-full border border-[#7c52ff]/15">
                Fase 03 · Novembro
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#6a6690]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white/90">
                Distribuição Global
              </h4>
              <p className="text-[11px] text-[#6a6690] mt-1 leading-relaxed">
                Estreia pública nas maiores plataformas digitais de streaming (Spotify, Apple Music, YouTube).
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#6a6690] pt-1 border-t border-[#7c52ff]/10 font-semibold">
              Distribuição Mundial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

