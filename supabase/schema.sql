-- ==============================================================================
-- BERSAL SESSION I — Esquema do Banco de Dados (Supabase / PostgreSQL)
-- ==============================================================================

create extension if not exists "pgcrypto";

-- 1. Faixas do EP, cada uma com o seu próprio preço e links do GitHub Releases
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  track_number int not null,
  duration_seconds int not null,
  preview_url text not null,       -- Prévia de 30s (GitHub Release ou Storage)
  full_file_url text,              -- Faixa completa Master para entrega
  price_kz numeric not null default 500,
  description text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- 2. Configurações gerais do EP (linha única, id = 1)
create table if not exists ep_settings (
  id int primary key default 1,
  title text not null default 'BERSAL SESSION I',
  produtora text not null default 'Bersal Studios',
  tagline text default 'Uma imersão sonora e texturas cinemáticas gravadas em alta resolução valvulada.',
  cover_url text,
  full_ep_price_kz numeric not null default 4000,
  release_at timestamptz not null default '2026-10-30T20:00:00+01:00',
  full_ep_zip_url text default 'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/BERSAL_SESSION_I_COMPLETO.zip',
  payment_multicaixa_express text default '941160814',
  payment_entidade text default '10116',
  payment_referencia text default '941160814'
);

-- 3. Pedidos de Pré-venda
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique,
  buyer_name text not null,
  buyer_email text not null,
  buyer_whatsapp text not null,
  order_type text not null check (order_type in ('faixas', 'ep_completo')),
  total_kz numeric not null,
  proof_url text,
  status text not null default 'pendente' check (status in ('pendente', 'confirmado', 'entregue')),
  delivery_notes text,
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  delivered_at timestamptz
);

-- 4. Faixas incluídas num pedido do tipo 'faixas'
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  track_id text not null,
  track_title text,
  download_url text,
  price_kz numeric not null
);

-- ==============================================================================
-- DADOS INICIAIS (SEED)
-- ==============================================================================

insert into ep_settings (
  id, title, produtora, tagline, cover_url, full_ep_price_kz, release_at,
  full_ep_zip_url, payment_multicaixa_express, payment_entidade, payment_referencia
) values (
  1, 
  'BERSAL SESSION I', 
  'Bersal Studios', 
  'Uma imersão sonora e texturas cinemáticas gravadas em alta resolução valvulada.',
  '/img/cover.jpeg',
  4000,
  '2026-10-30T20:00:00+01:00',
  'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/BERSAL_SESSION_I_COMPLETO.zip',
  '941160814', 
  '10116', 
  '941160814'
) on conflict (id) do update set
  title = excluded.title,
  produtora = excluded.produtora,
  tagline = excluded.tagline,
  cover_url = excluded.cover_url,
  full_ep_price_kz = excluded.full_ep_price_kz,
  release_at = excluded.release_at,
  full_ep_zip_url = excluded.full_ep_zip_url,
  payment_multicaixa_express = excluded.payment_multicaixa_express,
  payment_entidade = excluded.payment_entidade,
  payment_referencia = excluded.payment_referencia;

-- Seed das 9 Faixas Reais do EP Oficial BERSAL SESSION I com links GitHub Releases
delete from tracks;
insert into tracks (track_number, title, duration_seconds, preview_url, full_file_url, price_kz, description, is_featured)
values
  (
    1, 
    'Mansony : Formato', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/1.FORMATO.-.PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/1.FORMATO.mp3', 
    500, 
    'Faixa 1', 
    false
  ),
  (
    2, 
    'Chainz & Fago : Batota', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/2.BATOTA-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/2.BATOTA.mp3', 
    500, 
    'Faixa 2', 
    false
  ),
  (
    3, 
    'Mief e The real I essei : Mbali', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/3.MBALI-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/3.MBALI.mp3', 
    500, 
    'Faixa 3', 
    false
  ),
  (
    4, 
    'Edy Correia : Contra o vento', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/4.CONTRA.O.VENTO-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/4.CONTRA.O.VENTO.mp3', 
    500, 
    'Faixa 4', 
    false
  ),
  (
    5, 
    'Vilar x Iam Boss : Ecossimba', 
    180, 
    '/audio/track5_preview.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/5.ECOSSIMBA.mp3', 
    500, 
    'Faixa 5', 
    false
  ),
  (
    6, 
    'Beezy Bhau x Danger Blackson  : Ás de copa', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/6.AS.DE.COPA-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/6.AS.DE.COPA.mp3', 
    500, 
    'Faixa 6', 
    false
  ),
  (
    7, 
    'Edy Correia x Igolias x Enny B : Habla tudo', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/7.HABLA.TUDO-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/7.HABLA.TUDO.mp3', 
    500, 
    'Faixa 7', 
    false
  ),
  (
    8, 
    'Keren dos Santos : Progulema', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/8.PROGULEMA-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/8.PROGULEMA.mp3', 
    500, 
    'Faixa 8', 
    false
  ),
  (
    9, 
    'Flappy : Bolingó', 
    180, 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/9.BOLINGO-PREVIEW.mp3', 
    'https://github.com/jozzoficial/bersal-session/releases/download/BERSAL/9.BOLINGO.mp3', 
    500, 
    'Faixa 9', 
    false
  );

-- ==============================================================================
-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table tracks enable row level security;
alter table ep_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- 1. tracks: leitura pública das faixas, edição para autenticado
drop policy if exists "tracks_select_public" on tracks;
drop policy if exists "tracks_admin_all" on tracks;
create policy "tracks_select_public" on tracks for select using (true);
create policy "tracks_admin_all" on tracks for all using (true);

-- 2. ep_settings: leitura pública, edição permitida
drop policy if exists "ep_settings_select_public" on ep_settings;
drop policy if exists "ep_settings_admin_all" on ep_settings;
create policy "ep_settings_select_public" on ep_settings for select using (true);
create policy "ep_settings_admin_all" on ep_settings for all using (true);

-- 3. orders: inserção pública, seleção e atualização para acompanhar comprovativo e entrega
drop policy if exists "orders_insert_public" on orders;
drop policy if exists "orders_select_all" on orders;
drop policy if exists "orders_update_all" on orders;
create policy "orders_insert_public" on orders for insert with check (true);
create policy "orders_select_all" on orders for select using (true);
create policy "orders_update_all" on orders for update using (true);

-- 4. order_items: inserção e seleção pública
drop policy if exists "order_items_insert_public" on order_items;
drop policy if exists "order_items_select_all" on order_items;
create policy "order_items_insert_public" on order_items for insert with check (true);
create policy "order_items_select_all" on order_items for select using (true);

-- ==============================================================================
-- STORAGE BUCKETS (Configuração via SQL no Supabase Storage)
-- ==============================================================================

insert into storage.buckets (id, name, public) 
values 
  ('previews', 'previews', true),
  ('comprovativos', 'comprovativos', true),
  ('gallery', 'gallery', true)
on conflict (id) do update set public = excluded.public;

-- Storage Policies
drop policy if exists "storage_public_select" on storage.objects;
drop policy if exists "storage_public_insert" on storage.objects;
drop policy if exists "storage_public_update" on storage.objects;
drop policy if exists "storage_public_delete" on storage.objects;

create policy "storage_public_select" on storage.objects for select using (true);
create policy "storage_public_insert" on storage.objects for insert with check (true);
create policy "storage_public_update" on storage.objects for update using (true);
create policy "storage_public_delete" on storage.objects for delete using (true);

-- ==============================================================================
-- GALERIA DE IMAGENS
-- ==============================================================================

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  description text,
  created_at timestamptz default now()
);

alter table gallery_images enable row level security;
drop policy if exists "gallery_images_select_public" on gallery_images;
drop policy if exists "gallery_images_all" on gallery_images;
create policy "gallery_images_select_public" on gallery_images for select using (true);
create policy "gallery_images_all" on gallery_images for all using (true);

