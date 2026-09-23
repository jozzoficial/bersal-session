'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Disc, ShoppingBag, CheckCircle2, Sparkles, Tag, ShieldCheck } from 'lucide-react';
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
    <section className="relative flex flex-col p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c1a42] via-[#16143a] to-[#0c0a1a] border border-[#7c52ff]/35 shadow-[0_25px_60px_rgba(124,82,255,0.2)] overflow-hidden my-8">
      {/* Ambient glow orbs */}
      <div className="absolute -right-16 -top-16 w-60 h-60 bg-[#7c52ff]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-52 h-52 bg-[#e8517a]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Card / Badge de Destaque VIP */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8517a] to-[#7c52ff] flex items-center justify-center text-white shadow-md">
            <Disc className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#e8c76b] uppercase tracking-[0.2em] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#e8c76b]" /> Oferta Exclusiva de Pré-Venda
            </span>
            <span className="text-xs text-[#b5b0d5] font-semibold">
              Edição Completa VIP Limitada
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#22d4a6]/15 text-[#22d4a6] border border-[#22d4a6]/35 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
          <Tag className="w-3 h-3" /> Poupe 500 Kz
        </span>
      </div>

      {/* Título & Descrição */}
      <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mt-1">
        PASSE VIP · EP COMPLETO BERSAL SESSION I
      </h2>
      <p className="text-sm sm:text-base text-[#b5b0d5] mt-2 leading-relaxed max-w-2xl">
        Receba acesso prioritário e irrestrito a todas as 9 faixas masterizadas em alta resolução valvulada, além do booklet digital conceitual 4K e bônus de estúdio.
      </p>

      {/* Benefícios Inclusos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 p-4 sm:p-5 rounded-2xl bg-[#09090f]/75 border border-[#7c52ff]/20">
        <div className="flex items-start gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm font-semibold">
            Todas as 9 Faixas em MP3 320kbps HD
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm font-semibold">
            Encarte Digital 4K com Letras & Ficha Técnica
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm font-semibold">
            Entrega Automática no Dia de Lançamento
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm font-semibold">
            Acesso Antecipado antes do Streaming Global
          </span>
        </div>
      </div>

      {/* Bloco de Preço & Economia */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-1 mb-6 border-t border-[#7c52ff]/15">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#6a6690] uppercase tracking-wider">
            Preço Especial de Pré-Venda
          </span>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="text-3xl sm:text-5xl font-black text-[#e8c76b] font-mono tracking-tight">
              {formatKz(fullEpPriceKz)}
            </span>
            <span className="text-sm sm:text-base font-semibold text-[#6a6690] line-through font-mono">
              4.500 Kz
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#22d4a6] font-bold bg-[#22d4a6]/10 px-3 py-1.5 rounded-xl border border-[#22d4a6]/25">
          <ShieldCheck className="w-4 h-4" /> Licença Digital Oficial Bersal Studios
        </div>
      </div>

      {/* Botão de Compra do EP Completo */}
      <button
        type="button"
        onClick={handleBuy}
        className="w-full min-h-[58px] px-6 rounded-full bg-gradient-to-r from-[#e8517a] via-[#b83cb8] to-[#7c52ff] hover:from-[#f05c86] hover:to-[#8d66ff] text-white font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_6px_32px_rgba(232,81,122,0.4)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {isFullEp
          ? 'EP Completo Selecionado — Prosseguir para o Pagamento'
          : 'Garantir EP Completo em Pré-Venda · 4.000 Kz'}
      </button>

      <p className="text-[11px] text-center text-[#6a6690] mt-3">
        Pagamento seguro e imediato via Multicaixa Express ou Referência Bancária
      </p>
    </section>
  );
}

