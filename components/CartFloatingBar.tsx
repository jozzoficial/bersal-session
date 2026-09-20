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
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-[#0e0e10]/95 backdrop-blur-xl border-t border-[#e8c76b]/20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#e8c76b] text-[#0b0b0d] flex items-center justify-center font-extrabold shadow-sm shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-[#cfc5b2] truncate">
              {isFullEp
                ? 'EP Completo (6 faixas + bônus)'
                : `${totalItemsCount} ${totalItemsCount === 1 ? 'faixa selecionada' : 'faixas selecionadas'}`}
            </span>
            <span className="text-lg font-extrabold text-[#ffe49e] font-mono leading-tight">
              {formatKz(totalKz)}
            </span>
          </div>
        </div>

        <Link
          href="/comprar"
          className="min-h-[48px] px-6 rounded-xl bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(232,199,107,0.3)] hover:brightness-105 active:scale-95 transition-all shrink-0"
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
