'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckCircle2,
  Send,
  Eye,
  Phone,
  Mail,
  X,
  FileText,
  DollarSign,
  Hourglass,
  Disc,
  Music,
  ExternalLink,
  MessageCircle,
  Camera,
  Upload,
  Trash2,
  Plus,
  Image as ImageIcon,
  Copy,
  Download,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus, GalleryImage } from '@/lib/types';
import { INITIAL_TRACKS, DEFAULT_EP_SETTINGS, formatKz, findTrackByIdOrNumber } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export interface DeliveryItem {
  track_number?: number;
  title: string;
  download_url: string;
}

export function getOrderDeliveryItems(order: Order): DeliveryItem[] {
  if (order.order_type === 'ep_completo') {
    return INITIAL_TRACKS.map((t) => ({
      track_number: t.track_number,
      title: t.title,
      download_url: t.full_file_url || t.preview_url,
    }));
  }

  if (order.order_items && order.order_items.length > 0) {
    return order.order_items.map((item) => {
      // Procura primeiro pelo UUID do Supabase ou ID do track
      const found =
        findTrackByIdOrNumber(item.track_id) ||
        (item.track?.track_number ? findTrackByIdOrNumber(item.track.track_number) : undefined) ||
        (item.track_title ? findTrackByIdOrNumber(item.track_title) : undefined);

      const trackNumber =
        found?.track_number ||
        item.track?.track_number;

      const title =
        found?.title ||
        item.track_title ||
        item.track?.title ||
        (trackNumber ? `Faixa 0${trackNumber}` : `Faixa`);

      const downloadUrl =
        found?.full_file_url ||
        item.download_url ||
        item.track?.full_file_url ||
        found?.preview_url ||
        '';

      return {
        track_number: trackNumber,
        title,
        download_url: downloadUrl,
      };
    });
  }

  return [
    {
      track_number: 1,
      title: INITIAL_TRACKS[0].title,
      download_url: INITIAL_TRACKS[0].full_file_url || '',
    },
  ];
}

export function getDeliveryMessage(order: Order, items: DeliveryItem[]): string {
  const isEp = order.order_type === 'ep_completo';
  const tracksList = items
    .map(
      (item) =>
        `🎵 ${item.track_number ? `0${item.track_number}`.slice(-2) + ' · ' : ''}${item.title}\n🔗 ${item.download_url}`
    )
    .join('\n\n');

  const zipLine =
    isEp && DEFAULT_EP_SETTINGS.full_ep_zip_url
      ? `\n📦 Pacote Completo (ZIP com 9 faixas + Encarte 4K):\n🔗 ${DEFAULT_EP_SETTINGS.full_ep_zip_url}\n`
      : '';

  return (
    `Olá ${order.buyer_name}! 🎉\n\n` +
    `Aqui é da produção da Bersal Studios.\n` +
    `Confirmamos com sucesso o teu pagamento de ${formatKz(order.total_kz)} para o pedido #${order.order_code || order.id.slice(0, 8)} (${isEp ? 'EP COMPLETO BERSAL SESSION I' : 'Faixas Selecionadas'}).\n\n` +
    `Seguem os teus links oficiais para download Master em alta resolução (MP3 320kbps):\n\n` +
    `${tracksList}\n` +
    `${zipLine}\n` +
    `✦ Como baixar: Clica no link de cada faixa para descarregar diretamente para o teu telemóvel ou computador.\n\n` +
    `Muito obrigado por apoiares a música independente!\n` +
    `Bersal Studios · Uíge, Angola`
  );
}

export function getProofFullUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const supabase = createClient();
  if (supabase) {
    const { data } = supabase.storage.from('comprovativos').getPublicUrl(url);
    if (data?.publicUrl) return data.publicUrl;
  }
  return url;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'galeria'>('pedidos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState<Order | null>(null);
  const [copiedDeliveryMessage, setCopiedDeliveryMessage] = useState(false);
  const [copiedTrackUrl, setCopiedTrackUrl] = useState<string | null>(null);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar pedidos reais do Supabase (com fallback e mesclagem de pedidos locais)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    let localOrders: Order[] = [];
    try {
      const stored = localStorage.getItem('bersal_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localOrders = parsed;
        }
      }
    } catch {}

    const supabase = createClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              price_kz,
              track_id,
              track_title,
              download_url
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const supabaseIds = new Set(data.map((d: { id: string }) => d.id));
          const uniqueLocal = localOrders.filter((o) => !supabaseIds.has(o.id));
          setOrders([...(data as unknown as Order[]), ...uniqueLocal]);
        } else {
          setOrders(localOrders);
        }
      } catch {
        setOrders(localOrders);
      }
    } else {
      setOrders(localOrders);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchOrders();
    });

    // Sincronização em tempo real via Supabase Realtime
    const supabase = createClient();
    if (supabase) {
      const channel = supabase
        .channel('admin-orders-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Carregar imagens da galeria
  useEffect(() => {
    if (activeTab !== 'galeria') return;

    let isMounted = true;
    const supabase = createClient();
    if (supabase) {
      supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (isMounted) {
            if (!error && data) {
              setGalleryImages(data as GalleryImage[]);
            }
            setGalleryLoading(false);
          }
        });
    } else {
      queueMicrotask(() => {
        if (isMounted) setGalleryLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Upload de imagem para a galeria
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    if (!supabase) { setUploading(false); return; }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      alert('Erro ao fazer upload: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    const { data: insertData, error: insertError } = await supabase
      .from('gallery_images')
      .insert({ image_url: imageUrl, description: newDescription || null })
      .select()
      .single();

    if (!insertError && insertData) {
      setGalleryImages((prev) => [insertData as GalleryImage, ...prev]);
      setNewDescription('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
  };

  // Eliminar imagem da galeria
  const handleDeleteImage = async (img: GalleryImage) => {
    if (!confirm('Tens a certeza que queres eliminar esta imagem?')) return;
    const supabase = createClient();
    if (!supabase) return;

    // Extrair nome do ficheiro a partir da URL
    const urlParts = img.image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage.from('gallery').remove([fileName]);
    await supabase.from('gallery_images').delete().eq('id', img.id);
    setGalleryImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  // Ações de transição de status (persiste em Supabase e localStorage)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const supabase = createClient();
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === 'confirmado') {
      updates.confirmed_at = new Date().toISOString();
    } else if (newStatus === 'entregue') {
      updates.delivered_at = new Date().toISOString();
    }

    if (supabase && !orderId.startsWith('ord-') && !orderId.startsWith('local-')) {
      try {
        await supabase.from('orders').update(updates).eq('id', orderId);
      } catch (e) {
        console.warn('Erro ao atualizar status no Supabase:', e);
      }
    }

    // Atualiza também em localStorage
    try {
      const stored = localStorage.getItem('bersal_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((o: Order) =>
          o.id === orderId ? { ...o, ...updates } : o
        );
        localStorage.setItem('bersal_orders', JSON.stringify(updated));
      }
    } catch {}

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

      {/* Tabs: Pedidos | Galeria */}
      <section className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('pedidos')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'pedidos'
              ? 'bg-[#e8c76b] text-[#0b0b0d] shadow-md'
              : 'bg-[#1c1b1d] text-[#cfc5b2] hover:bg-[#2a2a2c] border border-white/5'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Gestão de Pedidos
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('galeria');
            setGalleryLoading(true);
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'galeria'
              ? 'bg-[#e8c76b] text-[#0b0b0d] shadow-md'
              : 'bg-[#1c1b1d] text-[#cfc5b2] hover:bg-[#2a2a2c] border border-white/5'
          }`}
        >
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4" /> Gestão de Galeria
          </span>
        </button>
      </section>

      {activeTab === 'pedidos' && (<>
      {/* Barra de Filtros e Busca */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filtros por status */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${filter === 'all'
              ? 'bg-[#e8c76b] text-[#0b0b0d]'
              : 'bg-[#1c1b1d] text-[#cfc5b2] hover:bg-[#2a2a2c]'
              }`}
          >
            Todos ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendente')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${filter === 'pendente'
              ? 'bg-[#e8c76b] text-[#0b0b0d]'
              : 'bg-[#1c1b1d] text-[#e8c76b] hover:bg-[#2a2a2c]'
              }`}
          >
            Pendentes ({totalPendentes})
          </button>
          <button
            type="button"
            onClick={() => setFilter('confirmado')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${filter === 'confirmado'
              ? 'bg-[#2ee59d] text-[#0b0b0d]'
              : 'bg-[#1c1b1d] text-[#78ffbd] hover:bg-[#2a2a2c]'
              }`}
          >
            Confirmados ({totalConfirmados})
          </button>
          <button
            type="button"
            onClick={() => setFilter('entregue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${filter === 'entregue'
              ? 'bg-[#38bdf8] text-[#0b0b0d]'
              : 'bg-[#1c1b1d] text-[#38bdf8] hover:bg-[#2a2a2c]'
              }`}
          >
            Entregues ({totalEntregues})
          </button>
        </div>

        {/* Input de Busca e Botão de Atualizar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98907e]" />
            <input
              type="text"
              placeholder="Buscar por comprador, ref ou whatsapp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-[#1c1b1d] rounded-xl text-xs text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
            />
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={ordersLoading}
            className="h-10 px-3.5 rounded-xl bg-[#1c1b1d] hover:bg-[#2a2a2c] text-[#e8c76b] border border-white/5 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            title="Recarregar pedidos em tempo real"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </section>

      {/* Lista de Pedidos */}
      <section className="flex flex-col gap-3">
        {ordersLoading ? (
          <div className="p-16 text-center bg-[#1c1b1d] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#e8c76b] animate-spin" />
            <p className="text-xs text-[#cfc5b2]">A sincronizar pedidos com o Supabase...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-[#1c1b1d] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#201f21] border border-white/5 flex items-center justify-center text-[#98907e] mb-1 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Nenhum pedido encontrado</h3>
            <p className="text-xs text-[#98907e] max-w-sm">
              {orders.length === 0
                ? 'Ainda não há pedidos registados. Quando os ouvintes efetuarem compras na pré-venda, eles aparecerão aqui em tempo real.'
                : 'Nenhum pedido corresponde aos filtros ou pesquisa selecionada.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const cleanPhone = order.buyer_whatsapp.replace(/\D/g, '');
            const deliveryItems = getOrderDeliveryItems(order);
            const deliveryMessage = getDeliveryMessage(order, deliveryItems);
            const whatsappDirectLink = `https://wa.me/${cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`}?text=${encodeURIComponent(
              deliveryMessage
            )}`;

            return (
              <article
                key={order.id}
                className="bg-[#1c1b1d] rounded-2xl p-4 sm:p-5 border border-white/5 shadow-md flex flex-col gap-3.5 hover:border-white/10 transition-all"
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
                <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-[#201f21] border border-white/5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      {order.order_type === 'ep_completo' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#e8c76b]/20 text-[#e8c76b] text-[10px] font-extrabold uppercase tracking-wider border border-[#e8c76b]/30">
                            EP COMPLETO
                          </span>
                          <span className="text-xs font-bold text-white">
                            Todas as 9 Faixas Master + Encarte 4K
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#7c52ff]/20 text-[#b599ff] text-[10px] font-extrabold uppercase tracking-wider border border-[#7c52ff]/30">
                            {deliveryItems.length} {deliveryItems.length === 1 ? 'FAIXA SELECIONADA' : 'FAIXAS SELECIONADAS'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {order.proof_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedProofUrl(getProofFullUrl(order.proof_url))}
                          className="h-8 px-3 rounded-lg bg-[#2a2a2c] hover:bg-[#353437] text-[#e8c76b] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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

                  {/* Lista detalhada das músicas compradas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/5">
                    {deliveryItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#181719] border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded flex items-center justify-center bg-[#2a2a2c] text-[10px] font-mono font-bold text-[#e8c76b] shrink-0">
                            {item.track_number ? `0${item.track_number}`.slice(-2) : '♪'}
                          </span>
                          <span className="font-semibold text-white truncate text-xs">
                            {item.title}
                          </span>
                        </div>
                        {item.download_url && (
                          <a
                            href={item.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-[11px] text-[#2ee59d] hover:underline shrink-0 font-medium"
                          >
                            Link Ativo
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Central de Ações & Entrega de Faixas */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-white/5">
                  {/* Botão de Envio de Faixas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryOrder(order)}
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#e8517a] to-[#7c52ff] hover:brightness-110 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{order.status === 'entregue' ? 'Reenviar / Ver Ficheiros' : 'Mandar Faixas ao Cliente'}</span>
                    </button>

                    <a
                      href={whatsappDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (order.status !== 'entregue') {
                          updateOrderStatus(order.id, 'entregue');
                        }
                      }}
                      className="h-9 px-3.5 rounded-xl bg-[#00623f]/30 hover:bg-[#00623f]/60 text-[#78ffbd] border border-[#2ee59d]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Abre WhatsApp com mensagem completa e links das faixas"
                    >
                      <MessageCircle className="w-4 h-4 text-[#2ee59d]" />
                      <span className="hidden sm:inline">WhatsApp Direto</span>
                    </a>
                  </div>

                  {/* Botões de Transição de Estado */}
                  <div className="flex items-center gap-2">
                    {order.status === 'pendente' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'confirmado')}
                        className="h-9 px-4 rounded-xl bg-[#e8c76b] hover:bg-[#f3dc8f] text-[#0b0b0d] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Pagamento</span>
                      </button>
                    )}

                    {order.status === 'confirmado' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDeliveryOrder(order)}
                        className="h-9 px-4 rounded-xl bg-[#2ee59d] hover:bg-[#78ffbd] text-[#0b0b0d] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Entregar Agora</span>
                      </button>
                    )}

                    {order.status === 'entregue' && (
                      <span className="text-xs font-semibold text-[#38bdf8] flex items-center gap-1.5 px-3 py-1.5 bg-[#38bdf8]/10 rounded-xl border border-[#38bdf8]/20">
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
      </>)}

      {activeTab === 'galeria' && (
        <section className="flex flex-col gap-5">
          {/* Upload de Nova Imagem */}
          <div className="bg-[#1c1b1d] rounded-2xl p-5 border border-white/5 shadow-md flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#e8c76b]" /> Adicionar Nova Foto
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Descrição da foto (opcional)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="flex-1 h-10 px-4 bg-[#201f21] rounded-xl text-xs text-white placeholder:text-[#98907e] border border-white/5 focus:border-[#e8c76b] focus:outline-none transition-all"
              />
              <label className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                uploading
                  ? 'bg-[#2a2a2c] text-[#98907e] cursor-wait'
                  : 'bg-gradient-to-r from-[#f3dc8f] via-[#e8c76b] to-[#d4af37] text-[#0b0b0d] hover:brightness-105 active:scale-95'
              }`}>
                <Upload className="w-4 h-4" />
                {uploading ? 'A enviar...' : 'Escolher e Enviar Foto'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Lista de Imagens */}
          {galleryLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="w-8 h-8 rounded-full border-2 border-[#e8c76b] border-t-transparent animate-spin" />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#1c1b1d] rounded-2xl border border-white/5">
              <ImageIcon className="w-12 h-12 text-[#98907e] mb-3" />
              <p className="text-sm text-[#cfc5b2]">Nenhuma imagem na galeria. Adiciona a primeira acima!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-[#1c1b1d] border border-white/5 shadow-md aspect-square">
                  <img src={img.image_url} alt={img.description || 'Galeria'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-lg active:scale-90"
                      title="Eliminar imagem"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {img.description && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-white font-medium">{img.description}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 text-[10px] text-white/60 bg-black/50 px-2 py-0.5 rounded-full">
                    {new Date(img.created_at).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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

      {/* Modal / Central de Envio de Faixas para o Usuário */}
      {selectedDeliveryOrder && (() => {
        const cleanPhone = selectedDeliveryOrder.buyer_whatsapp.replace(/\D/g, '');
        const items = getOrderDeliveryItems(selectedDeliveryOrder);
        const fullMessage = getDeliveryMessage(selectedDeliveryOrder, items);
        const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`}?text=${encodeURIComponent(fullMessage)}`;
        const mailtoUrl = `mailto:${selectedDeliveryOrder.buyer_email}?subject=${encodeURIComponent(
          `Bersal Studios — Teus Ficheiros Master do EP BERSAL SESSION I (#${selectedDeliveryOrder.order_code || selectedDeliveryOrder.id.slice(0, 8)})`
        )}&body=${encodeURIComponent(fullMessage)}`;

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#181628] rounded-2xl border border-[#7c52ff]/30 max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#7c52ff]/20 bg-[#121020]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8517a] to-[#7c52ff] flex items-center justify-center text-white shadow-md">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      Central de Envio de Faixas
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#e8c76b]/15 text-[#ffe49e] border border-[#e8c76b]/30">
                        #{selectedDeliveryOrder.order_code || selectedDeliveryOrder.id.slice(0, 8)}
                      </span>
                    </h3>
                    <p className="text-xs text-[#b5b0d5]">
                      Destinatário: <strong className="text-white">{selectedDeliveryOrder.buyer_name}</strong> ({selectedDeliveryOrder.buyer_whatsapp})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDeliveryOrder(null)}
                  className="w-8 h-8 rounded-full bg-[#201f35] text-[#b5b0d5] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corpo do Modal com Scroll */}
              <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 text-xs text-[#cfc5b2]">
                {/* Resumo do Pedido */}
                <div className="p-3.5 rounded-xl bg-[#0f0e1c] border border-[#7c52ff]/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-[#e8c76b]" />
                    <span className="text-white font-bold">
                      {selectedDeliveryOrder.order_type === 'ep_completo'
                        ? 'Pacote Completo (Todas as 9 Faixas Master + Encarte 4K)'
                        : `Faixas Selecionadas (${items.length} faixa(s))`
                      }
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#e8c76b] font-mono">
                    {formatKz(selectedDeliveryOrder.total_kz)}
                  </span>
                </div>

                {/* Lista de Ficheiros Master Prontos para Download */}
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a77fff] block mb-2">
                    Ficheiros Master GitHub Releases ({items.length}):
                  </span>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#201d3a] border border-[#7c52ff]/15"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Music className="w-3.5 h-3.5 text-[#e8517a] shrink-0" />
                          <span className="font-bold text-white truncate text-xs">
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Testar / Baixar */}
                          <a
                            href={item.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-[#2a264a] hover:bg-[#34305c] text-[#a77fff] hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
                            title="Descarregar ficheiro para testar"
                          >
                            <Download className="w-3 h-3" />
                            <span>Baixar</span>
                          </a>

                          {/* Copiar Link */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.download_url);
                              setCopiedTrackUrl(item.download_url);
                              setTimeout(() => setCopiedTrackUrl(null), 2000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#2a264a] hover:bg-[#34305c] text-[#cfc5b2] hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
                            title="Copiar link direto"
                          >
                            {copiedTrackUrl === item.download_url ? (
                              <Check className="w-3 h-3 text-[#2ee59d]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedTrackUrl === item.download_url ? 'Copiado' : 'Link'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visualização da Mensagem de Entrega Formatada */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a77fff]">
                      Mensagem de Entrega Formatada:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(fullMessage);
                        setCopiedDeliveryMessage(true);
                        setTimeout(() => setCopiedDeliveryMessage(false), 2500);
                      }}
                      className="text-[11px] text-[#e8c76b] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedDeliveryMessage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2ee59d]" />
                          <span>Mensagem Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Tudo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3 bg-[#0a0914] rounded-xl border border-[#7c52ff]/20 text-[11px] text-[#b5b0d5] whitespace-pre-wrap font-sans max-h-40 overflow-y-auto leading-relaxed select-all">
                    {fullMessage}
                  </pre>
                </div>
              </div>

              {/* Ações Inferiores de Entrega Imediata */}
              <div className="p-4 sm:p-5 border-t border-[#7c52ff]/20 bg-[#121020] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#201d3a] hover:bg-[#282448] text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Enviar via WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      updateOrderStatus(selectedDeliveryOrder.id, 'entregue');
                      setSelectedDeliveryOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#007a4d] hover:bg-[#00945d] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Enviar via WhatsApp (1-Clique)</span>
                  </a>

                  {/* Enviar via Email */}
                  <a
                    href={mailtoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      updateOrderStatus(selectedDeliveryOrder.id, 'entregue');
                      setSelectedDeliveryOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#2a264a] hover:bg-[#34305c] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#a77fff]" />
                    <span>E-mail</span>
                  </a>

                  {/* Marcar como Entregue sem abrir links */}
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedDeliveryOrder.id, 'entregue');
                      setSelectedDeliveryOrder(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#2ee59d] hover:bg-[#78ffbd] text-[#0b0b0d] font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Entrega</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
