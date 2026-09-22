'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatKz } from '@/lib/constants';

export default function CartFloatingBar() {
  const { totalItemsCount, totalKz, isFullEp } = useCart();

  if (totalItemsCount === 0 && !isFullEp) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-[#09090f]/96 backdrop-blur-xl border-t border-[#7c52ff]/18 shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8517a] to-[#7c52ff] text-white flex items-center justify-center font-extrabold shadow-[0_0_16px_rgba(232,81,122,0.35)] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-[#b5b0d5] truncate">
              {isFullEp
                ? 'EP Completo (9 faixas + booklet + stems)'
                : `${totalItemsCount} ${totalItemsCount === 1 ? 'faixa selecionada' : 'faixas selecionadas'}`}
            </span>
            <span className="text-lg font-extrabold text-[#e8c76b] font-mono leading-tight">
              {formatKz(totalKz)}
            </span>
          </div>
        </div>

        <Link
          href="/comprar"
          className="min-h-[48px] px-6 rounded-full bg-gradient-to-r from-[#e8517a] to-[#7c52ff] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_24px_rgba(232,81,122,0.35)] hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
