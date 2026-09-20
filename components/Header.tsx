'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disc, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { totalItemsCount, totalKz } = useCart();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e10]/85 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#e8c76b]/20 flex items-center justify-center text-[#e8c76b] group-hover:border-[#e8c76b]/60 transition-all shadow-[0_0_15px_rgba(232,199,107,0.15)] overflow-hidden">
            <img src="/img/logo.jpeg" alt="Bersal Studios Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#e8c76b] uppercase tracking-widest leading-none">
              Bersal Studios
            </span>
            <span className="text-base font-extrabold text-white tracking-tight group-hover:text-[#ffe49e] transition-colors">
              BERSAL SESSION I
            </span>
          </div>
        </Link>

        {/* Ações / Navegação */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Carrinho / Checkout */}
          <Link
            href="/comprar"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1c1b1d] hover:bg-[#2a2a2c] text-[#e5e1e4] hover:text-[#ffe49e] border border-white/5 transition-all text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-[#e8c76b]" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#e8c76b] text-[#0b0b0d] text-[10px] font-bold flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Link Admin */}
          <Link
            href="/admin"
            className={`p-2 rounded-xl border transition-all ${
              isAdmin
                ? 'bg-[#e8c76b] text-[#0b0b0d] border-[#e8c76b]'
                : 'bg-[#1c1b1d] text-[#cfc5b2] hover:text-[#ffe49e] border-white/5 hover:bg-[#2a2a2c]'
            }`}
            title="Painel Administrativo"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
