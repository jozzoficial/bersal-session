'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Phone,
  Mail,
  X,
  FileText,
  DollarSign,
  TrendingUp,
  Hourglass,
  Disc,
  Music,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatKz } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_code: 'BS-8492',
    buyer_name: 'Hamilton dos Santos',
    buyer_email: 'hamilton.santos@gmail.com',
    buyer_whatsapp: '+244923456789',
    order_type: 'ep_completo',
    total_kz: 3500,
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'pendente',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-2',
    order_code: 'BS-8490',
    buyer_name: 'Catarina Miraldina',
    buyer_email: 'catarina.m@nexus.ao',
    buyer_whatsapp: '+244944112233',
    order_type: 'faixas',
    total_kz: 500,
    proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    status: 'pendente',
    created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    order_items: [
      {
        id: 'item-1',
        order_id: 'ord-2',
        track_id: 't-3',
        price_kz: 500,
        track: {
          id: 't-3',
          track_number: 3,
          title: 'Ouro Líquido',
          duration_seconds: 238,
          preview_url: '',
          price_kz: 500,
        },
      },
    ],
  },
  {
    id: 'ord-3',
    order_code: 'BS-8488',
    buyer_name: 'Dr. Edgar Massango',
    buyer_email: 'edgar.massango@bna.ao',
    buyer_whatsapp: '+244912998877',
    order_type: 'ep_completo',
    total_kz: 3500,
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'confirmado',
    created_at: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    confirmed_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-4',
    order_code: 'BS-8480',
    buyer_name: 'Ana Paula Lourenço',
    buyer_email: 'anapaula.l@sonangol.co.ao',
    buyer_whatsapp: '+244923118899',
    order_type: 'ep_completo',
    total_kz: 3500,
    proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    status: 'entregue',
    created_at: new Date(Date.now() - 1400 * 60 * 1000).toISOString(),
    confirmed_at: new Date(Date.now() - 1200 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
  },
];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // Carregar dados reais do Supabase
  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            price_kz,
            track_id,
            tracks:track_id (
              id,
              title,
              track_number
            )
          )
        `)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setOrders(data as unknown as Order[]);
          }
        });
    }
  }, []);

  // Ações de transição de status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const supabase = createClient();
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === 'confirmado') {
      updates.confirmed_at = new Date().toISOString();
    } else if (newStatus === 'entregue') {
      updates.delivered_at = new Date().toISOString();
    }

    if (supabase && !orderId.startsWith('ord-')) {
      await supabase.from('orders').update(updates).eq('id', orderId);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  // Métricas calculadas
  const totalArrecadado = orders
    .filter((o) => o.status === 'confirmado' || o.status === 'entregue')
    .reduce((sum, o) => sum + Number(o.total_kz || 0), 0);

  const totalPendentes = orders.filter((o) => o.status === 'pendente').length;
  const totalConfirmados = orders.filter((o) => o.status === 'confirmado').length;
  const totalEntregues = orders.filter((o) => o.status === 'entregue').length;

  // Filtragem da lista
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      order.buyer_name.toLowerCase().includes(q) ||
      order.buyer_email.toLowerCase().includes(q) ||
      order.buyer_whatsapp.includes(q) ||
      (order.order_code && order.order_code.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Topo: Boas-vindas e Status */}
      <section className="bg-[#1c1b1d] rounded-2xl p-5 border border-white/5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#e8c76b]/20 flex items-center justify-center text-[#e8c76b]">
            <Disc className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Produtor Master</h1>
              <span className="w-2 h-2 rounded-full bg-[#2ee59d] animate-pulse" />
            </div>
            <span className="text-xs text-[#cfc5b2]">
              Bersal Studios · Gestão Operacional de Pré-Venda
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#98907e]">
          <span>Multicaixa: <strong>941160814</strong></span>
          <span>·</span>
          <span>Entidade: <strong>10116</strong></span>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Arrecadado */}
        <div className="bg-[#1c1b1d] rounded-2xl p-4 border border-white/5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#98907e] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Arrecadado
            </span>
            <DollarSign className="w-4 h-4 text-[#e8c76b]" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#ffe49e] font-mono">
            {formatKz(totalArrecadado)}
          </span>
          <span className="text-[10px] text-[#cfc5b2]">Confirmados e Entregues</span>
        </div>

        {/* Pendentes */}
        <div className="bg-[#1c1b1d] rounded-2xl p-4 border border-[#e8c76b]/20 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#98907e] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Pendentes
            </span>
            <Hourglass className="w-4 h-4 text-[#e8c76b] animate-pulse" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#e8c76b] font-mono">
            {totalPendentes}
          </span>
          <span className="text-[10px] text-[#cfc5b2]">Aguardam validação</span>
        </div>

        {/* Confirmados */}
        <div className="bg-[#1c1b1d] rounded-2xl p-4 border border-white/5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#98907e] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Confirmados
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2ee59d]" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#78ffbd] font-mono">
            {totalConfirmados}
          </span>
          <span className="text-[10px] text-[#cfc5b2]">Prontos para envio</span>
        </div>

        {/* Entregues */}
        <div className="bg-[#1c1b1d] rounded-2xl p-4 border border-white/5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#98907e] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Entregues
            </span>
            <Send className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#38bdf8] font-mono">
            {totalEntregues}
          </span>
          <span className="text-[10px] text-[#cfc5b2]">Processados com sucesso</span>
        </div>
      </section>

      {/* Barra de Filtros e Busca */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filtros por status */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-[#e8c76b] text-[#0b0b0d]'
                : 'bg-[#1c1b1d] text-[#cfc5b2] hover:bg-[#2a2a2c]'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendente')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'pendente'
                ? 'bg-[#e8c76b] text-[#0b0b0d]'
                : 'bg-[#1c1b1d] text-[#e8c76b] hover:bg-[#2a2a2c]'
            }`}
          >
            Pendentes ({totalPendentes})
          </button>
          <button
            type="button"
            onClick={() => setFilter('confirmado')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'confirmado'
                ? 'bg-[#2ee59d] text-[#0b0b0d]'
                : 'bg-[#1c1b1d] text-[#78ffbd] hover:bg-[#2a2a2c]'
            }`}
          >
            Confirmados ({totalConfirmados})
          </button>
          <button
            type="button"
            onClick={() => setFilter('entregue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'entregue'
                ? 'bg-[#38bdf8] text-[#0b0b0d]'
                : 'bg-[#1c1b1d] text-[#38bdf8] hover:bg-[#2a2a2c]'
            }`}
          >
            Entregues ({totalEntregues})
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98907e]" />
          <input
            type="text"
            placeholder="Buscar por comprador, ref ou whatsapp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-[#1c1b1d] rounded-xl text-xs text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
          />
        </div>
      </section>

      {/* Lista de Pedidos */}
      <section className="flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#1c1b1d] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
            <Disc className="w-10 h-10 text-[#98907e] mb-2" />
            <p className="text-sm text-[#cfc5b2]">Nenhum pedido encontrado nesta visualização.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const cleanPhone = order.buyer_whatsapp.replace(/\D/g, '');
            const whatsappDirectLink = `https://wa.me/${cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`}?text=${encodeURIComponent(
              `Olá ${order.buyer_name}! Aqui é da Bersal Studios referente ao teu pedido ${order.order_code || ''} de ${formatKz(order.total_kz)} do EP BERSAL SESSION I. Segue aqui o link dos teus ficheiros Master:`
            )}`;

            return (
              <article
                key={order.id}
                className="bg-[#1c1b1d] rounded-2xl p-4 sm:p-5 border border-white/5 shadow-md flex flex-col gap-3 hover:border-white/10 transition-all"
              >
                {/* Header do Card: Código, Horário e Status */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-[#e8c76b]">
                      {order.order_code ? `#${order.order_code}` : `#${order.id.slice(0, 8)}`}
                    </span>
                    <span className="text-[#98907e] text-xs">·</span>
                    <span className="text-[11px] text-[#98907e]">
                      {new Date(order.created_at).toLocaleDateString('pt-AO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Badge Colorido de Status */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      order.status === 'pendente'
                        ? 'bg-[#e8c76b]/15 text-[#e8c76b] border border-[#e8c76b]/30'
                        : order.status === 'confirmado'
                        ? 'bg-[#2ee59d]/15 text-[#78ffbd] border border-[#2ee59d]/30'
                        : 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'pendente'
                          ? 'bg-[#e8c76b] animate-ping'
                          : order.status === 'confirmado'
                          ? 'bg-[#2ee59d]'
                          : 'bg-[#38bdf8]'
                      }`}
                    />
                    {order.status}
                  </span>
                </div>

                {/* Corpo do Pedido: Comprador, Contactos e Valor */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {order.buyer_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#cfc5b2]">
                      <a
                        href={`tel:${order.buyer_whatsapp}`}
                        className="flex items-center gap-1 hover:text-[#e8c76b] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#2ee59d]" />
                        <span>{order.buyer_whatsapp}</span>
                      </a>
                      <a
                        href={`mailto:${order.buyer_email}`}
                        className="flex items-center gap-1 hover:text-[#e8c76b] transition-colors truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#98907e]" />
                        <span>{order.buyer_email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start shrink-0">
                    <span className="text-lg font-mono font-extrabold text-[#ffe49e]">
                      {formatKz(order.total_kz)}
                    </span>
                    <span className="text-[10px] text-[#98907e] uppercase">
                      {order.order_type === 'ep_completo' ? 'EP Completo' : 'Faixas Avulsas'}
                    </span>
                  </div>
                </div>

                {/* Itens Comprados & Comprovativo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#201f21]">
                  <div className="flex items-center gap-2 min-w-0">
                    {order.order_type === 'ep_completo' ? (
                      <>
                        <Disc className="w-4 h-4 text-[#e8c76b] shrink-0" />
                        <span className="text-xs font-semibold text-white truncate">
                          EP Completo (Todas as 6 Faixas Master + Encarte 4K)
                        </span>
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4 text-[#e8c76b] shrink-0" />
                        <span className="text-xs font-semibold text-white truncate">
                          Faixas Individuais ({order.order_items?.length || 1} selecionada(s))
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {order.proof_url ? (
                      <button
                        type="button"
                        onClick={() => setSelectedProofUrl(order.proof_url!)}
                        className="h-8 px-3 rounded-lg bg-[#2a2a2c] hover:bg-[#353437] text-[#e8c76b] text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Comprovativo</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#98907e] italic">
                        Sem comprovativo anexado
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações de Estado do Pedido */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  {/* Botão de WhatsApp direto para entrega manual */}
                  <a
                    href={whatsappDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-9 px-3 rounded-xl bg-[#00623f]/30 hover:bg-[#00623f]/60 text-[#78ffbd] border border-[#2ee59d]/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Entregar via WhatsApp</span>
                  </a>

                  {/* Botões de Transição de Estado */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {order.status === 'pendente' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'confirmado')}
                        className="flex-1 sm:flex-none h-9 px-4 rounded-xl bg-[#e8c76b] hover:bg-[#f3dc8f] text-[#0b0b0d] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Pagamento</span>
                      </button>
                    )}

                    {order.status === 'confirmado' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'entregue')}
                        className="flex-1 sm:flex-none h-9 px-4 rounded-xl bg-[#2ee59d] hover:bg-[#78ffbd] text-[#0b0b0d] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Marcar como Entregue</span>
                      </button>
                    )}

                    {order.status === 'entregue' && (
                      <span className="text-xs font-semibold text-[#38bdf8] flex items-center gap-1 px-3 py-1 bg-[#38bdf8]/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Entregue com Sucesso
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Modal de Inspeção do Comprovativo */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1d] rounded-2xl border border-white/10 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#e8c76b]" /> Comprovativo de Pagamento
              </span>
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="w-8 h-8 rounded-full bg-[#2a2a2c] text-[#cfc5b2] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#0e0e10] flex items-center justify-center max-h-[70vh] overflow-auto">
              {selectedProofUrl.endsWith('.pdf') ? (
                <div className="flex flex-col items-center gap-3 p-8 text-center">
                  <FileText className="w-16 h-16 text-[#e8c76b]" />
                  <span className="text-sm font-semibold text-white">Ficheiro PDF</span>
                  <a
                    href={selectedProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#e8c76b] text-[#0b0b0d] font-bold text-xs flex items-center gap-1.5"
                  >
                    Abrir PDF em nova aba <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={selectedProofUrl}
                  alt="Comprovativo de Pagamento"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg border border-white/10"
                />
              )}
            </div>

            <div className="p-3 bg-[#1c1b1d] border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 rounded-xl bg-[#2a2a2c] text-white text-xs font-bold hover:bg-[#353437] transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
