'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Countdown from '@/components/Countdown';
import CoverCard from '@/components/CoverCard';
import TrackItem from '@/components/TrackItem';
import FullEpHiglight from '@/components/FullEpHiglight';
import CartFloatingBar from '@/components/CartFloatingBar';
import Footer from '@/components/Footer';
import { INITIAL_TRACKS, DEFAULT_EP_SETTINGS } from '@/lib/constants';
import { Track, EpSettings } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { Award, Music, Disc, Headphones, Sparkles, ChevronDown, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [settings, setSettings] = useState<EpSettings>(DEFAULT_EP_SETTINGS);
  const { selectFullEp } = useCart();

  useEffect(() => {
    // Buscar faixas e configurações atualizadas do Supabase se configurado
    const supabase = createClient();
    if (supabase) {
      supabase
        .from('tracks')
        .select('*')
        .order('track_number', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setTracks(data);
          }
        });

      supabase
        .from('ep_settings')
        .select('*')
        .eq('id', 1)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setSettings(data);
          }
        });
    }
  }, []);

  const scrollToTracks = () => {
    const el = document.getElementById('faixas-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEp = () => {
    const el = document.getElementById('ep-completo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090f] text-white selection:bg-[#7c52ff]/30 selection:text-[#a77fff]">
      <Header />

      {/* Luz ambiente de topo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#7c52ff]/12 via-[#e8517a]/05 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-32 flex flex-col gap-8">
        {/* HERO SECTION: Design Editorial com Apresentação Visual & Metadata */}
        <section className="pt-4 sm:pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Coluna Esquerda: Informações Principais & Ações Rápidas */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {/* Badges de Lançamento */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16143a] border border-[#7c52ff]/30 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#e8517a] animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#a77fff] uppercase tracking-widest">
                    Acesso Antecipado Oficial
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8c76b]/15 text-[#ffe49e] border border-[#e8c76b]/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e8c76b]" /> Edição Especial Limitada
                </span>
              </div>

              {/* Título & Tagline */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#a77fff]">
                  {settings.produtora} Apresenta
                </span>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  {settings.title}
                </h1>
                <p className="text-sm sm:text-base text-[#b5b0d5] leading-relaxed max-w-xl mt-1">
                  {settings.tagline}
                </p>
              </div>

              {/* Specs Rápidos do Projeto */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#b5b0d5]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16143a]/80 border border-[#7c52ff]/20">
                  <Disc className="w-3.5 h-3.5 text-[#e8517a]" />
                  <span className="font-bold text-white">9 Faixas Inéditas</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16143a]/80 border border-[#7c52ff]/20">
                  <Headphones className="w-3.5 h-3.5 text-[#a77fff]" />
                  <span className="font-bold text-white">Master Valvulada</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16143a]/80 border border-[#7c52ff]/20">
                  <Zap className="w-3.5 h-3.5 text-[#22d4a6]" />
                  <span className="font-bold text-white">Prévias em HD</span>
                </div>
              </div>

              {/* Ações Rápidas do Hero */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToTracks}
                  className="px-5 py-3 rounded-full bg-gradient-to-r from-[#e8517a] to-[#7c52ff] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(232,81,122,0.35)] active:scale-95 transition-all cursor-pointer"
                >
                  <Music className="w-4 h-4" />
                  Ouvir Faixas & Pré-Comprar
                </button>

                <button
                  type="button"
                  onClick={scrollToEp}
                  className="px-5 py-3 rounded-full bg-[#16143a] hover:bg-[#1c1a42] text-white hover:text-[#ffe49e] border border-[#7c52ff]/30 hover:border-[#e8c76b]/50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#e8c76b]" />
                  Passe EP Completo · 4.000 Kz
                </button>
              </div>
            </div>

            {/* Coluna Direita: Capa de Vinil 3D Interativa */}
            <div className="md:col-span-5 flex justify-center">
              <CoverCard coverUrl={settings.cover_url} title={settings.title} />
            </div>
          </div>
        </section>

        {/* SEÇÃO DO CRONOGRAMA OFICIAL & CONTAGEM REGRESSIVA */}
        <section id="cronograma-section" className="scroll-mt-24">
          <Countdown targetDate={settings.release_at} />
        </section>

        {/* SEÇÃO: ALINHAMENTO DAS FAIXAS (TRACKLIST) */}
        <section id="faixas-section" className="flex flex-col scroll-mt-24 pt-2">
          {/* Header da Tracklist */}
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5 pb-3 border-b border-[#7c52ff]/15">
            <div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#e8517a]" />
                <span className="text-[11px] font-extrabold text-[#a77fff] uppercase tracking-[0.2em]">
                  Alinhamento do Álbum
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                Faixas do EP BERSAL SESSION I
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#16143a] border border-[#7c52ff]/20 text-[#b5b0d5] font-semibold">
                9 Faixas · 500 Kz / cada
              </span>
              <span className="px-3 py-1 rounded-full bg-[#22d4a6]/10 border border-[#22d4a6]/25 text-[#22d4a6] font-semibold hidden sm:inline">
                30s Prévias Disponíveis
              </span>
            </div>
          </div>

          {/* Lista de Faixas */}
          <div className="flex flex-col gap-3">
            {tracks.map((track) => (
              <TrackItem key={track.id || track.track_number} track={track} />
            ))}
          </div>
        </section>

        {/* SEÇÃO: PASSE VIP EP COMPLETO */}
        <div id="ep-completo-section" className="scroll-mt-24">
          <FullEpHiglight />
        </div>

        {/* SEÇÃO: PILARES DE QUALIDADE E CONFIANÇA BERSAL STUDIOS */}
        <section className="my-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#141232]/80 border border-[#7c52ff]/20 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#1c1a42] border border-[#7c52ff]/30 flex items-center justify-center text-[#a77fff]">
                <Award className="w-5 h-5 text-[#e8c76b]" />
              </div>
              <h4 className="text-sm font-extrabold text-white">
                Masterização Valvulada
              </h4>
              <p className="text-xs text-[#b5b0d5] leading-relaxed">
                Processamento sonoro com conversores e prés de alta gama, conferindo calor e textura analógica inconfundíveis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141232]/80 border border-[#7c52ff]/20 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#1c1a42] border border-[#7c52ff]/30 flex items-center justify-center text-[#a77fff]">
                <ShieldCheck className="w-5 h-5 text-[#22d4a6]" />
              </div>
              <h4 className="text-sm font-extrabold text-white">
                Pagamento Multicaixa Express
              </h4>
              <p className="text-xs text-[#b5b0d5] leading-relaxed">
                Transações 100% locais em Kwanzas via MCX (941 160 814) ou Referência com verificação e liberação protegida.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141232]/80 border border-[#7c52ff]/20 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#1c1a42] border border-[#7c52ff]/30 flex items-center justify-center text-[#a77fff]">
                <Zap className="w-5 h-5 text-[#e8517a]" />
              </div>
              <h4 className="text-sm font-extrabold text-white">
                Download Direto Sem Limites
              </h4>
              <p className="text-xs text-[#b5b0d5] leading-relaxed">
                No dia de estreia você recebe link prioritário permanente para download em qualquer dispositivo.
              </p>
            </div>
          </div>
        </section>
      </main>

      <CartFloatingBar />
      <Footer />
    </div>
  );
}

