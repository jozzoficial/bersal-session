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
import { Award, Music, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [settings, setSettings] = useState<EpSettings>(DEFAULT_EP_SETTINGS);

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

  return (
    <div className="flex flex-col min-h-screen bg-[#131315]">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-32 flex flex-col">
        {/* Topo / Badges */}
        <section className="flex flex-col pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1b1d] border border-white/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#e8c76b] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#e8c76b] uppercase tracking-widest">
                Versão Digital · Acesso Antecipado
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#cfc5b2] uppercase tracking-wider">
              Edição Limitada
            </span>
          </div>

          <div className="flex flex-col gap-1 my-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8c76b]">
              {settings.produtora} Apresenta
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {settings.title}
            </h1>
            <p className="text-sm sm:text-base text-[#cfc5b2] mt-1 leading-relaxed max-w-xl">
              {settings.tagline}
            </p>
          </div>

          {/* Contagem Decrescente */}
          <Countdown targetDate={settings.release_at} />

          {/* Capa do EP com Destaque */}
          <div className="my-4">
            <CoverCard coverUrl={settings.cover_url} title={settings.title} />
          </div>
        </section>

        {/* Lista de Faixas */}
        <section className="flex flex-col py-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold text-[#e8c76b] uppercase tracking-widest">
                Alinhamento
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <Music className="w-6 h-6 text-[#e8c76b]" /> Faixas do EP
              </h2>
            </div>
            <span className="text-xs text-[#98907e]">Prévia de 30s</span>
          </div>

          <div className="flex flex-col gap-3">
            {tracks.map((track) => (
              <TrackItem key={track.id || track.track_number} track={track} />
            ))}
          </div>
        </section>

        {/* Bloco de Destaque: EP Completo a 3.500 Kz */}
        <FullEpHiglight />

        {/* Selo de Garantia de Qualidade Analógica */}
        <section className="my-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1b1d] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2a2a2c] flex items-center justify-center text-[#e8c76b] shrink-0 border border-white/5">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#e8c76b] uppercase tracking-widest">
                Selo de Qualidade Sonora Bersal Studios
              </span>
              <p className="text-xs text-[#cfc5b2] mt-0.5 leading-relaxed">
                Gravado e masterizado com pré-amplificadores valvulados e conversores analógico-digitais de nível profissional em Luanda.
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
