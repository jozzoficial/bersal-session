'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Disc, ShoppingBag, CheckCircle2 } from 'lucide-react';
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
    <section className="relative flex flex-col p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1c1a42] via-[#16143a] to-[#0e0b1e] border border-[#7c52ff]/30 shadow-[0_20px_50px_rgba(124,82,255,0.18)] overflow-hidden my-6">
      {/* Ambient glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#7c52ff]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-[#e8517a]/08 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8517a] to-[#7c52ff] flex items-center justify-center text-white shadow-sm">
            <Disc className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-extrabold text-[#a77fff] uppercase tracking-widest">
            Oferta Exclusiva de Pré-Venda
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#22d4a6]/12 text-[#22d4a6] border border-[#22d4a6]/30 text-[11px] font-bold">
          Edição Completa VIP
        </span>
      </div>

      {/* Título & Descrição */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-1">
        EP COMPLETO BERSAL SESSION I
      </h2>
      <p className="text-sm text-[#b5b0d5] mt-2 leading-relaxed">
        Garante acesso antecipado a todas as 9 faixas em formato mp3, além do booklet conceitual 4K e stems instrumentais exclusivas.
      </p>

      {/* Benefícios Inclusos */}
      <div className="flex flex-col gap-2.5 my-5 p-4 rounded-xl bg-[#09090f]/60 border border-[#7c52ff]/15">
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Todas as 9 faixas em MP3 320kbps
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Booklet digital e artwork conceitual em alta definição 4K
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-4 h-4 text-[#22d4a6] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Acesso prioritário antes do lançamento nas plataformas de streaming
          </span>
        </div>
      </div>

      {/* Bloco de Preço */}
      <div className="flex items-baseline justify-between pt-1 mb-5">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#6a6690] uppercase tracking-wider">
            Valor do Pacote
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#e8c76b] font-mono">
              {formatKz(fullEpPriceKz)}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#22d4a6] uppercase tracking-wider">
          Chave Digital Instantânea
        </span>
      </div>

      {/* Botão de Compra do EP Completo */}
      <button
        type="button"
        onClick={handleBuy}
        className="w-full min-h-[56px] px-6 rounded-full bg-gradient-to-r from-[#e8517a] via-[#c040a0] to-[#7c52ff] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_28px_rgba(232,81,122,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {isFullEp ? 'EP Completo Selecionado — Ir para Checkout' : 'Comprar EP Completo — 4.000 Kz'}
      </button>

      <p className="text-[11px] text-center text-[#6a6690] mt-3">
        Pagamento seguro e direto via Multicaixa Express (941 160 814) ou Referência Bancária
      </p>
    </section>
  );
}
