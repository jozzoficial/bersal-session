'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { DEFAULT_PAYMENT, formatKz } from '@/lib/constants';
import { Order } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Copy,
  Check,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Disc,
} from 'lucide-react';

export default function CheckoutPage() {
  const { selectedTracks, isFullEp, totalKz, totalItemsCount, orderType, clearCart } =
    useCart();

  // Estados do formulário
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState('');

  // Estados do fluxo de checkout
  // step 1: Preencher dados e revisar pedido
  // step 2: Efetuar pagamento e enviar comprovativo
  // step 3: Confirmação concluída
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dados do pedido gerado
  const [orderId, setOrderId] = useState<string>('');
  const [orderCode, setOrderCode] = useState<string>('');
  const [confirmedTotalKz, setConfirmedTotalKz] = useState<number>(0);

  // Comprovativo
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // Estados de cópia
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Se o carrinho estiver vazio e ainda estiver no passo 1
  if (totalItemsCount === 0 && !isFullEp && step === 1) {
    return (
      <div className="flex flex-col min-h-screen bg-[#131315]">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 pt-28 pb-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#201f21] border border-white/10 flex items-center justify-center text-[#e8c76b] mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">O teu carrinho está vazio</h1>
          <p className="text-sm text-[#cfc5b2] mt-2 max-w-md">
            Escolhe as tuas faixas favoritas ou o EP completo na página principal para avançar para a pré-venda.
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-3 rounded-xl bg-[#e8c76b] text-[#0b0b0d] font-bold text-sm hover:brightness-105 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Ver Faixas do EP
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 1. Validar identificação e avançar para o passo do pagamento (sem gravar na BD ainda)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerWhatsapp.trim()) {
      setErrorMessage('Por favor, preenche todos os campos de identificação.');
      return;
    }

    if (!orderCode) {
      const genCode = `BS-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderCode(genCode);
    }
    setConfirmedTotalKz(totalKz);

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Upload do comprovativo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  // 3. Confirmar envio do comprovativo e registar o pedido na Base de Dados
  const handleSubmitProof = async () => {
    if (!proofFile) {
      setErrorMessage('Por favor, seleciona o ficheiro do comprovativo antes de concluir.');
      return;
    }

    setIsUploadingProof(true);
    setErrorMessage('');

    const activeOrderCode = orderCode || `BS-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(activeOrderCode);
    const finalAmount = confirmedTotalKz || totalKz;

    try {
      const supabase = createClient();
      let uploadedFileName: string | null = null;

      // A) Upload para o bucket 'comprovativos' no Supabase Storage
      if (supabase) {
        const fileExt = proofFile.name.split('.').pop() || 'pdf';
        uploadedFileName = `${activeOrderCode}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('comprovativos')
          .upload(uploadedFileName, proofFile);

        if (uploadError) {
          console.warn('Erro ao fazer upload do comprovativo para o storage:', uploadError);
        }
      }

      // B) Gravar o pedido no Supabase
      let supabaseOrderId: string | null = null;
      if (supabase) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_code: activeOrderCode,
            buyer_name: buyerName.trim(),
            buyer_email: buyerEmail.trim(),
            buyer_whatsapp: buyerWhatsapp.trim(),
            order_type: orderType,
            total_kz: finalAmount,
            proof_url: uploadedFileName || null,
            status: 'pendente',
          })
          .select('id')
          .single();

        if (orderError) {
          console.error('Erro ao registrar pedido:', orderError);
          throw new Error('Falha ao registar o pedido na base de dados.');
        }

        if (orderData) {
          supabaseOrderId = orderData.id;
          setOrderId(orderData.id);

          // Se for compra por faixas individuais, insere os order_items com URLs
          if (orderType === 'faixas' && selectedTracks.length > 0) {
            const items = selectedTracks.map((t) => ({
              order_id: orderData.id,
              track_id: t.id,
              track_title: t.title,
              download_url: t.full_file_url || t.preview_url,
              price_kz: t.price_kz,
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(items);
            if (itemsError) {
              console.warn('Erro ao inserir itens do pedido:', itemsError);
            }
          }
        }
      }

      const activeOrderId = supabaseOrderId || `local-${Date.now()}`;
      setOrderId(activeOrderId);

      // C) Salvar backup em localStorage para suporte offline/local
      try {
        const existing = JSON.parse(localStorage.getItem('bersal_orders') || '[]');
        const newLocalOrder: Order = {
          id: activeOrderId,
          order_code: activeOrderCode,
          buyer_name: buyerName.trim(),
          buyer_email: buyerEmail.trim(),
          buyer_whatsapp: buyerWhatsapp.trim(),
          order_type: orderType,
          total_kz: finalAmount,
          proof_url: uploadedFileName || proofPreview,
          status: 'pendente',
          created_at: new Date().toISOString(),
          order_items:
            orderType === 'faixas'
              ? selectedTracks.map((t, idx) => ({
                  id: `item-${Date.now()}-${idx}`,
                  order_id: activeOrderId,
                  track_id: t.id,
                  track_title: t.title,
                  download_url: t.full_file_url || t.preview_url,
                  price_kz: t.price_kz,
                  track: t,
                }))
              : undefined,
        };
        localStorage.setItem('bersal_orders', JSON.stringify([newLocalOrder, ...existing.filter((o: Order) => o.id !== activeOrderId)]));
      } catch (e) {
        console.warn('Erro ao salvar localmente:', e);
      }

      // D) Disparar efeito comemorativo
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e8c76b', '#ffe49e', '#78ffbd'],
        });
      } catch {}

      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Erro ao enviar comprovativo:', err);
      setErrorMessage(err?.message || 'Falha ao processar o comprovativo. Tente novamente.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/244${DEFAULT_PAYMENT.multicaixa_express}?text=${encodeURIComponent(
    `Olá Bersal Studios! Acabei de registrar o pedido ${orderCode || '#BS'} da pré-venda do EP BERSAL SESSION I em nome de ${buyerName}.`
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#131315]">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 pt-20 pb-28 flex flex-col">
        {/* Stepper / Indicador de Progresso */}
        <div className="pt-3 pb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#e8c76b] uppercase tracking-widest">
                Pré-Venda Oficial
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {step === 3 ? 'Pedido Concluído 🎉' : 'Finalizar Aquisição'}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1c1b1d] px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#78ffbd] animate-pulse" />
              <span className="text-[10px] font-bold text-[#cfc5b2] tracking-wider uppercase">
                SSL Seguro
              </span>
            </div>
          </div>

          {/* Barra do Stepper */}
          <div className="bg-[#1c1b1d] p-3 rounded-xl border border-white/5 flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#e8c76b]' : 'text-[#98907e]'}`}>
                <span className="w-4 h-4 rounded-full bg-[#e8c76b] text-[#0b0b0d] flex items-center justify-center text-[10px] font-bold">
                  1
                </span>{' '}
                Dados
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#e8c76b]' : 'text-[#98907e]'}`}>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step >= 2 ? 'bg-[#e8c76b] text-[#0b0b0d]' : 'bg-[#2a2a2c] text-[#cfc5b2]'
                  }`}
                >
                  2
                </span>{' '}
                Pagamento
              </span>
              <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#78ffbd]' : 'text-[#98907e]'}`}>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === 3 ? 'bg-[#2ee59d] text-[#0b0b0d]' : 'bg-[#2a2a2c] text-[#cfc5b2]'
                  }`}
                >
                  3
                </span>{' '}
                Confirmação
              </span>
            </div>
            <div className="w-full bg-[#2a2a2c] h-1.5 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#e8c76b] rounded-full transition-all duration-500"
                style={{
                  width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                }}
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center gap-2 text-xs text-[#ffdad6]">
            <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            PASSO 1: DADOS DO COMPRADOR E RESUMO DO CARRINHO
        ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* Card de Resumo dos Itens Escolhidos */}
            <div className="bg-[#1c1b1d] rounded-2xl p-5 border border-white/5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#cfc5b2] uppercase tracking-wider">
                  Itens Selecionados
                </span>
                <span className="text-[11px] font-bold text-[#78ffbd] uppercase bg-[#00623f]/20 border border-[#78ffbd]/20 px-2.5 py-0.5 rounded-full">
                  Áudio Studio Master
                </span>
              </div>

              {isFullEp ? (
                <div className="flex items-center gap-3 py-2">
                  <div className="w-14 h-14 rounded-xl bg-[#201f21] border border-[#e8c76b]/30 flex items-center justify-center text-[#e8c76b] shrink-0 shadow-md">
                    <Disc className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-extrabold text-white truncate">
                      EP COMPLETO BERSAL SESSION I
                    </h3>
                    <p className="text-xs text-[#cfc5b2]">
                      9 Faixas MP3 320kbps + Booklet Digital 4K
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/5">
                  {selectedTracks.map((track) => (
                    <div key={track.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-[#e8c76b]">
                          {track.track_number < 10 ? `0${track.track_number}` : track.track_number}
                        </span>
                        <span className="text-sm font-semibold text-white truncate">
                          {track.title}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-[#ffe49e] shrink-0">
                        {formatKz(track.price_kz)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-px w-full bg-white/10 my-1" />

              <div className="flex flex-col gap-1.5 text-xs text-[#cfc5b2]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatKz(totalKz)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Emissão Digital</span>
                  <span className="text-[#78ffbd] font-medium">0 Kz (Isento)</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/5">
                  <span className="text-base font-bold text-white">Total do Pedido</span>
                  <span className="text-xl font-extrabold text-[#ffe49e] font-mono">
                    {formatKz(totalKz)}
                  </span>
                </div>
              </div>
            </div>

            {/* Formulário de Identificação */}
            <form
              onSubmit={handleProceedToPayment}
              className="bg-[#1c1b1d] rounded-2xl p-5 border border-white/5 shadow-xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#e8c76b]" />
                <h3 className="text-base font-bold text-white">Dados para Recebimento</h3>
              </div>
              <p className="text-xs text-[#cfc5b2]">
                Indica os teus contactos para receberes os ficheiros master e as chaves de acesso antecipado.
              </p>

              <div className="flex flex-col gap-3">
                {/* Nome */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Nome Completo *
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#98907e]" />
                    <input
                      type="text"
                      required
                      placeholder="Ex.: Hamilton dos Santos"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#2a2a2c] rounded-xl text-sm text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Email para Download dos Ficheiros *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[#98907e]" />
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#2a2a2c] rounded-xl text-sm text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-white uppercase tracking-wider">
                    WhatsApp para Envio Instantâneo *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-[#2ee59d]" />
                    <input
                      type="tel"
                      required
                      placeholder="+244 9..."
                      value={buyerWhatsapp}
                      onChange={(e) => setBuyerWhatsapp(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#2a2a2c] rounded-xl text-sm text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-[#98907e]">
                    Exemplo: +244 941 160 814 ou 923 000 000
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-13 mt-2 rounded-xl bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(232,199,107,0.3)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                Avançar para Pagamento
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            PASSO 2: CANAIS DE PAGAMENTO E UPLOAD DO COMPROVATIVO
        ========================================================================= */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Botão Voltar ao Passo 1 */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setStep(1);
              }}
              className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] text-xs font-semibold text-[#cfc5b2] hover:text-white border border-white/5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#e8c76b]" />
              <span>Voltar e editar dados de contacto</span>
            </button>

            {/* Box com Dados de Pagamento */}
            <div className="bg-[#1c1b1d] rounded-2xl p-5 border border-[#e8c76b]/30 shadow-2xl relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffe49e] via-[#e8c76b] to-[#d4af37]" />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#e8c76b]" />
                  <h2 className="text-lg font-bold text-white">Canais de Pagamento (Angola)</h2>
                </div>
                <span className="text-[10px] font-extrabold text-[#e8c76b] bg-[#e8c76b]/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Oficial Bersal
                </span>
              </div>

              <p className="text-xs text-[#cfc5b2]">
                Transfere exatamente <strong className="text-[#ffe49e] font-mono">{formatKz(confirmedTotalKz || totalKz)}</strong> por um dos métodos certificados abaixo:
              </p>

              {/* Opção A: Multicaixa Express */}
              <div className="bg-[#0e0e10] rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#e8c76b] text-[#0b0b0d] flex items-center justify-center text-[10px] font-extrabold">
                      MCX
                    </span>
                    <span className="text-sm font-bold text-white">Multicaixa Express</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#78ffbd] bg-[#00623f]/20 px-2 py-0.5 rounded-full">
                    Mais Rápido
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#1c1b1d] p-3 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#98907e]">Número Destino Express</span>
                    <span className="text-lg font-mono font-extrabold text-[#ffe49e] tracking-wider">
                      {DEFAULT_PAYMENT.multicaixa_express}
                    </span>
                    <span className="text-[10px] text-[#cfc5b2]">Titular: Bersal Studios</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(DEFAULT_PAYMENT.multicaixa_express, 'mcx')}
                    className="h-10 px-3.5 rounded-lg bg-[#2a2a2c] hover:bg-[#e8c76b] hover:text-[#0b0b0d] text-[#e8c76b] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    {copiedField === 'mcx' ? (
                      <>
                        <Check className="w-4 h-4 text-[#2ee59d]" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Opção B: Pagamento por Referência */}
              <div className="bg-[#0e0e10] rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#2a2a2c] text-[#ffe49e] flex items-center justify-center text-[10px] font-extrabold border border-white/10">
                    REF
                  </span>
                  <span className="text-sm font-bold text-white">Pagamento por Referência</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Entidade */}
                  <div className="bg-[#1c1b1d] p-3 rounded-xl border border-white/5 flex flex-col justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#98907e]">Entidade</span>
                      <span className="text-base font-mono font-extrabold text-white">
                        {DEFAULT_PAYMENT.entidade}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DEFAULT_PAYMENT.entidade, 'entidade')}
                      className="h-8 w-full bg-[#2a2a2c] hover:bg-[#e8c76b] hover:text-[#0b0b0d] text-[#e8c76b] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedField === 'entidade' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  {/* Referência */}
                  <div className="bg-[#1c1b1d] p-3 rounded-xl border border-white/5 flex flex-col justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#98907e]">Referência</span>
                      <span className="text-base font-mono font-extrabold text-white">
                        {DEFAULT_PAYMENT.referencia}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DEFAULT_PAYMENT.referencia, 'referencia')}
                      className="h-8 w-full bg-[#2a2a2c] hover:bg-[#e8c76b] hover:text-[#0b0b0d] text-[#e8c76b] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedField === 'referencia' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Zona de Upload do Comprovativo */}
            <div className="bg-[#1c1b1d] rounded-2xl p-5 border border-white/5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#e8c76b]" />
                  <h3 className="text-base font-bold text-white">Subir Comprovativo</h3>
                </div>
                <span className="text-[10px] font-bold text-[#e8c76b] uppercase">
                  Passo Final
                </span>
              </div>

              <label className="cursor-pointer bg-[#201f21] hover:bg-[#2a2a2c] rounded-xl p-6 border-2 border-dashed border-white/10 hover:border-[#e8c76b]/50 flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-[0.99]">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-[#e8c76b]/10 flex items-center justify-center text-[#e8c76b] mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-white">
                  {proofFile ? 'Substituir ficheiro' : 'Toque para carregar o comprovativo'}
                </span>
                <span className="text-xs text-[#cfc5b2] max-w-xs">
                  Anexe o comprovativo da transferência (Foto, Print de tela ou PDF do app bancário)
                </span>
              </label>

              {/* Ficheiro selecionado / Preview */}
              {proofFile && (
                <div className="bg-[#201f21] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {proofPreview ? (
                      <img
                        src={proofPreview}
                        alt="Comprovativo"
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#2ee59d]/15 text-[#78ffbd] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                        {proofFile.name}
                      </span>
                      <span className="text-[10px] text-[#78ffbd]">
                        {(proofFile.size / 1024).toFixed(0)} KB • Pronto para envio
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProofFile(null);
                      setProofPreview(null);
                    }}
                    className="w-8 h-8 rounded-full bg-[#2a2a2c] text-[#cfc5b2] hover:text-[#ffb4ab] flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Botão de Envio do Comprovativo */}
              <button
                type="button"
                onClick={handleSubmitProof}
                disabled={isUploadingProof || !proofFile}
                className="w-full h-14 mt-2 rounded-xl bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(232,199,107,0.3)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isUploadingProof ? (
                  'A validar comprovativo...'
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Enviar Comprovativo e Concluir
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASSO 3: CONFIRMAÇÃO FINAL 🎉
        ========================================================================= */}
        {step === 3 && (
          <div className="bg-[#1c1b1d] rounded-2xl p-6 sm:p-8 border border-[#e8c76b]/30 shadow-2xl relative overflow-hidden flex flex-col gap-4 animate-in fade-in duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#e8c76b]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#2ee59d]/20 text-[#78ffbd] flex items-center justify-center shrink-0 border border-[#78ffbd]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Pedido Recebido com Sucesso! 🎉
                </h2>
                <span className="text-xs font-mono font-bold text-[#e8c76b] uppercase tracking-wider">
                  Código da Reserva: #{orderCode}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-1" />

            <p className="text-sm text-[#e5e1e4] leading-relaxed">
              A equipa da <strong>Bersal Studios</strong> já recebeu o teu comprovativo e está a validar a transação na conta bancária.
            </p>

            <div className="p-4 rounded-xl bg-[#201f21] border border-white/5 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#98907e]">Destinatário:</span>
                <span className="text-white font-semibold">{buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98907e]">Email:</span>
                <span className="text-white font-semibold">{buyerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98907e]">WhatsApp:</span>
                <span className="text-white font-semibold">{buyerWhatsapp}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-[#98907e]">Valor Total:</span>
                <span className="text-[#ffe49e] font-mono font-bold">{formatKz(confirmedTotalKz || totalKz)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#e8c76b]/20 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#e8c76b] shrink-0" />
              <p className="text-xs text-[#cfc5b2]">
                Assim que o pagamento for confirmado pelo dono no painel, vais receber o teu acesso direto por <strong>email</strong> e no <strong>WhatsApp</strong>!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 rounded-xl bg-[#00623f] hover:bg-[#005234] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#78ffbd]" /> Notificar pelo WhatsApp
              </a>
              <Link
                href="/"
                className="flex-1 h-12 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
