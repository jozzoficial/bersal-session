'use client';

import React from 'react';
import { Disc, MessageCircle, ShieldCheck } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { DEFAULT_PAYMENT } from '@/lib/constants';

export default function Footer() {
  const whatsappUrl = `https://wa.me/244${DEFAULT_PAYMENT.multicaixa_express}?text=${encodeURIComponent('Olá Bersal Studios! Gostaria de tirar dúvidas sobre a pré-venda do EP BERSAL SESSION I.')}`;

  return (
    <footer className="w-full mt-auto py-10 px-4 sm:px-6 border-t border-[#7c52ff]/12 bg-[#0a091a] text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#a77fff]" />
          <span className="text-xs font-extrabold text-white tracking-widest uppercase">
            Bersal Studios
          </span>
        </div>
        <p className="text-xs text-[#6a6690]">
          Produzido e Masterizado em Luanda, Angola · Distribuição Digital Direta
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 my-2 text-xs">
          <span className="flex items-center gap-1.5 text-[#22d4a6]">
            <ShieldCheck className="w-3.5 h-3.5" /> Confirmação Manual Oficial
          </span>
          <span className="w-1 h-1 rounded-full bg-[#7c52ff]/40" />
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#7c9fff] hover:text-white transition-colors"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            Facebook
          </a>
          <span className="w-1 h-1 rounded-full bg-[#7c52ff]/40" />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#e8517a] hover:text-white transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            Instagram
          </a>
          <span className="w-1 h-1 rounded-full bg-[#7c52ff]/40" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#22d4a6] hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Suporte WhatsApp
          </a>
        </div>

        <p className="text-[11px] text-[#4a4470] mt-1">
          © {new Date().getFullYear()} Bersal Studios. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
