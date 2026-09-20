'use client';

import React from 'react';
import Link from 'next/link';
import { Disc, MessageCircle, ShieldCheck } from 'lucide-react';
import { DEFAULT_PAYMENT } from '@/lib/constants';

export default function Footer() {
  const whatsappUrl = `https://wa.me/244${DEFAULT_PAYMENT.multicaixa_express}?text=${encodeURIComponent('Olá Bersal Studios! Gostaria de tirar dúvidas sobre a pré-venda do EP BERSAL SESSION I.')}`;

  return (
    <footer className="w-full mt-auto py-10 px-4 sm:px-6 border-t border-white/5 bg-[#0e0e10] text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#e8c76b]" />
          <span className="text-xs font-extrabold text-white tracking-widest uppercase">
            Bersal Studios
          </span>
        </div>
        <p className="text-xs text-[#cfc5b2]">
          Produzido e Masterizado em Luanda, Angola · Distribuição Digital Direta
        </p>

        <div className="flex items-center gap-4 my-2 text-xs">
          <span className="flex items-center gap-1 text-[#cfc5b2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2ee59d]" /> Confirmação Manual Oficial
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#78ffbd] hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Suporte WhatsApp
          </a>
        </div>

        <p className="text-[11px] text-[#98907e] mt-1">
          © {new Date().getFullYear()} Bersal Studios. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
