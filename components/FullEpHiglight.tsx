'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Disc, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatKz } from '@/lib/constants';

export default function FullEpHiglight() {
  const router = useRouter();
  const { isFullEp, selectFullEp, fullEpPriceKz } = useCart();

  const handleBuy = () => {
    selectFullEp();
    router.push('/comprar');
  };

  return (
    <section className="relative flex flex-col p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#201f21] via-[#1c1b1d] to-[#0e0e10] border border-[#e8c76b]/35 shadow-[0_20px_50px_rgba(232,199,107,0.12)] overflow-hidden my-6">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#e8c76b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#e8c76b] flex items-center justify-center text-[#0b0b0d] shadow-sm">
            <Disc className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-extrabold text-[#e8c76b] uppercase tracking-widest">
            Oferta Exclusiva de Pré-Venda
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#2ee59d]/15 text-[#78ffbd] border border-[#2ee59d]/30 text-[11px] font-bold">
          Edição Completa VIP
        </span>
      </div>

      {/* Título & Descrição */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-1">
        EP COMPLETO BERSAL SESSION I
      </h2>
      <p className="text-sm text-[#cfc5b2] mt-2 leading-relaxed">
        Garante acesso antecipado a todas as 6 faixas em formato WAV (Lossless Studio Master 24-bit / 96kHz) e MP3 320kbps, além do booklet conceitual 4K e stems instrumentais exclusivas.
      </p>

      {/* Benefícios Inclusos */}
      <div className="flex flex-col gap-2.5 my-5 p-4 rounded-xl bg-[#141418] border border-white/5">
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#e8c76b] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Todas as 6 faixas em WAV Lossless 24-bit Master
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#e8c76b] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Booklet digital e artwork conceitual em alta definição 4K
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#e8c76b] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Acesso prioritário antes do lançamento nas plataformas de streaming
          </span>
        </div>
      </div>

      {/* Bloco de Preço */}
      <div className="flex items-baseline justify-between pt-1 mb-5">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#98907e] uppercase tracking-wider">
            Valor do Pacote
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ffe49e] font-mono">
              {formatKz(fullEpPriceKz)}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#78ffbd] uppercase tracking-wider">
          Chave Digital Instantânea
        </span>
      </div>

      {/* Botão de Compra do EP Completo */}
      <button
        type="button"
        onClick={handleBuy}
        className="w-full min-h-[56px] px-6 rounded-xl bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(232,199,107,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5 text-[#0b0b0d]" />
        {isFullEp ? 'EP Completo Selecionado — Ir para Checkout' : 'Comprar EP Completo — 3.500 Kz'}
      </button>

      <p className="text-[11px] text-center text-[#98907e] mt-3">
        Pagamento seguro e direto via Multicaixa Express (941 160 814) ou Referência Bancária
      </p>
    </section>
  );
}
