'use client';

import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

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
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    // Se não passar targetDate, usar 5 dias e 18 horas a partir da primeira montagem
    const target = targetDate
      ? new Date(targetDate).getTime()
      : Date.now() + (4 * 24 + 18) * 3600 * 1000 + 42 * 60 * 1000 + 15 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = target - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[#b5b0d5] uppercase tracking-widest flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5 text-[#a77fff]" /> Lançamento Oficial Em:
        </span>
        <span className="text-[11px] font-bold text-[#22d4a6] uppercase tracking-wider bg-[#22d4a6]/10 px-2 py-0.5 rounded-full border border-[#22d4a6]/25">
          Fase 1 Aberta
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Dias */}
        <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-[#16143a] border border-[#7c52ff]/20 shadow-lg">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#a77fff] font-mono">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#6a6690] tracking-wider uppercase mt-0.5">
            Dias
          </span>
        </div>

        {/* Horas */}
        <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-[#16143a] border border-[#7c52ff]/20 shadow-lg">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#a77fff] font-mono">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#6a6690] tracking-wider uppercase mt-0.5">
            Horas
          </span>
        </div>

        {/* Min */}
        <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-[#16143a] border border-[#7c52ff]/20 shadow-lg">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#a77fff] font-mono">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#6a6690] tracking-wider uppercase mt-0.5">
            Min
          </span>
        </div>

        {/* Seg */}
        <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-[#1c1a42] border border-[#e8517a]/30 shadow-lg">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#e8517a] font-mono animate-pulse">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#e8517a]/70 tracking-wider uppercase mt-0.5">
            Seg
          </span>
        </div>
      </div>
    </div>
  );
}
