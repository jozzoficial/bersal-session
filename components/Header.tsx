'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, ShoppingBag, Camera } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#16143a] border border-[#7c52ff]/25 flex items-center justify-center overflow-hidden group-hover:border-[#7c52ff]/60 group-hover:shadow-[0_0_16px_rgba(124,82,255,0.3)] transition-all">
            <img src="/img/logo.jpeg" alt="Bersal Studios Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#a77fff] uppercase tracking-widest leading-none">
              Bersal Studios
            </span>
            <span className="text-[15px] font-extrabold text-white tracking-tight group-hover:text-[#e8517a] transition-colors">
              BERSAL SESSION I
            </span>
          </div>
        </Link>

        {/* Ações / Navegação */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Botão Carrinho */}
          <Link
            href="/comprar"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#16143a] hover:bg-[#1c1a42] text-[#b5b0d5] hover:text-white border border-[#7c52ff]/20 hover:border-[#7c52ff]/50 transition-all text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-[#a77fff]" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#e8517a] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(232,81,122,0.5)]">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Galeria */}
          <Link
            href="/galeria"
            className="hidden sm:flex p-2 rounded-full border bg-[#16143a] text-[#b5b0d5] hover:text-white border-[#7c52ff]/20 hover:border-[#7c52ff]/50 hover:bg-[#1c1a42] transition-all"
            title="Galeria de Imagens"
          >
            <Camera className="w-4 h-4" />
          </Link>

          {/* Redes Sociais */}
          <a
            href="https://www.facebook.com/profile.php?id=61553376871678"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-full border bg-[#16143a] text-[#b5b0d5] hover:text-[#7c9fff] border-[#7c52ff]/20 hover:border-[#7c9fff]/50 hover:bg-[#1c1a42] transition-all"
            title="Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-full border bg-[#16143a] text-[#b5b0d5] hover:text-[#e8517a] border-[#7c52ff]/20 hover:border-[#e8517a]/50 hover:bg-[#1c1a42] transition-all"
            title="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* Link Admin */}
          <Link
            href="/admin"
            className={`p-2 rounded-full border transition-all ${
              isAdmin
                ? 'bg-[#e8517a] text-white border-[#e8517a] shadow-[0_0_12px_rgba(232,81,122,0.4)]'
                : 'bg-[#16143a] text-[#b5b0d5] hover:text-white border-[#7c52ff]/20 hover:border-[#7c52ff]/50 hover:bg-[#1c1a42]'
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
