export interface Track {
  id: string;
  title: string;
  track_number: number;
  duration_seconds: number;
  preview_url: string;
  price_kz: number;
  description?: string;
  is_featured?: boolean;
}

export interface EpSettings {
  id: number;
  title: string;
  produtora: string;
  tagline?: string;
  cover_url?: string;
  full_ep_price_kz: number;
  release_at: string;
  payment_multicaixa_express?: string;
  payment_entidade?: string;
  payment_referencia?: string;
}

export type OrderType = 'faixas' | 'ep_completo';
export type OrderStatus = 'pendente' | 'confirmado' | 'entregue';

export interface OrderItem {
  id: string;
  order_id: string;
  track_id: string;
  price_kz: number;
  track?: Track;
}

export interface Order {
  id: string;
  order_code?: string;
  buyer_name: string;
  buyer_email: string;
  buyer_whatsapp: string;
  order_type: OrderType;
  total_kz: number;
  proof_url?: string | null;
  status: OrderStatus;
  created_at: string;
  confirmed_at?: string | null;
  delivered_at?: string | null;
  order_items?: OrderItem[];
}
