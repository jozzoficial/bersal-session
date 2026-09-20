-- ==============================================================================
-- BERSAL SESSION I — Esquema do Banco de Dados (Supabase / PostgreSQL)
-- ==============================================================================

create extension if not exists "pgcrypto";

-- 1. Faixas do EP, cada uma com o seu próprio preço
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  track_number int not null,
  duration_seconds int not null,
  preview_url text not null,       -- ficheiro de 30s no Supabase Storage
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
  tagline text default 'Uma imersão sonora exclusiva entre a alma do afro-house e texturas cinemáticas gravadas em alta resolução valvulada.',
  cover_url text,
  full_ep_price_kz numeric not null default 4000,
  release_at timestamptz not null,
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
  order_type text not null
    check (order_type in ('faixas', 'ep_completo')),
  total_kz numeric not null,
  proof_url text,
  status text not null default 'pendente'
    check (status in ('pendente', 'confirmado', 'entregue')),
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  delivered_at timestamptz
);

-- 4. Faixas incluídas num pedido do tipo 'faixas'
-- (para 'ep_completo' esta tabela fica vazia — está implícito que é o álbum completo)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  track_id uuid not null references tracks(id),
  price_kz numeric not null
);

-- ==============================================================================
-- DADOS INICIAIS (SEED)
-- ==============================================================================

insert into ep_settings (
  id, title, produtora, tagline, cover_url, full_ep_price_kz, release_at,
  payment_multicaixa_express, payment_entidade, payment_referencia
) values (
  1, 
  'BERSAL SESSION I', 
  'Bersal Studios', 
  'Uma imersão sonora exclusiva entre a alma do afro-house e texturas cinemáticas gravadas em alta resolução valvulada.',
  'https://lh3.googleusercontent.com/aida/AEtjO1V5xlQjCaeihxIEaV0_jV7YLS0ahButBQ-K6RhDaaLRtlbW8POPAaeWJibotYFrSHA7WB0x7gXnaLZ-1HpfWT8Z7QuS0NuBzzoYnpP6F0IBXeDXxZPpX8cxwEd1788RZmdZIkoiETm5js57BHdVTcLAHRKnwiHSRm3XPkSwyJp2wohQqKOqQooR5vLHUL3xX_2UwJbymRaIaL0D9uS8lmr8WQljBth7YbPEixxDBkNesulY1E5AoGBPpJo',
  4000,
  now() + interval '5 days 18 hours',
  '941160814', 
  '10116', 
  '941160814'
) on conflict (id) do update set
  title = excluded.title,
  produtora = excluded.produtora,
  tagline = excluded.tagline,
  cover_url = excluded.cover_url,
  full_ep_price_kz = excluded.full_ep_price_kz,
  payment_multicaixa_express = excluded.payment_multicaixa_express,
  payment_entidade = excluded.payment_entidade,
  payment_referencia = excluded.payment_referencia;

-- Seed das 6 faixas do EP oficial
insert into tracks (track_number, title, duration_seconds, preview_url, price_kz, description, is_featured)
values
  (1, 'Intro: Frequência Noturna', 225, '/audio/track1_preview.mp3', 500, 'Arranjo atmosférico sintético e texturas analógicas', false),
  (2, 'Ecos de Luanda (feat. Yuri M.)', 252, '/audio/track2_preview.mp3', 500, 'Afro-house percussivo e vocais em kimbundu', false),
  (3, 'Ouro Líquido', 238, '/audio/track3_preview.mp3', 500, 'Linha de baixo Moog, batidas profundas e trompetes', true),
  (4, 'Voo Noturno', 270, '/audio/track4_preview.mp3', 500, 'Sintetizadores espaciais e groove lento e envolvente', false),
  (5, 'Sessão 04:00 AM', 200, '/audio/track5_preview.mp3', 500, 'Improvisação pura de estúdio gravada em take único', false),
  (6, 'Outro: Amanhecer em Sintonia', 170, '/audio/track6_preview.mp3', 500, 'Fechamento orquestral com guitarras semi-acústicas', false)
on conflict do nothing;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table tracks enable row level security;
alter table ep_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- 1. tracks: leitura pública, edição só para admin autenticado
create policy "tracks_select_public" on tracks for select using (true);
create policy "tracks_admin_all" on tracks for all using (auth.role() = 'authenticated');

-- 2. ep_settings: leitura pública, edição só para admin autenticado
create policy "ep_settings_select_public" on ep_settings for select using (true);
create policy "ep_settings_admin_all" on ep_settings for all using (auth.role() = 'authenticated');

-- 3. orders: inserção pública (qualquer comprador pode registrar um pedido)
create policy "orders_insert_public" on orders for insert with check (true);
-- Leitura e atualização de pedidos só para admin autenticado
create policy "orders_admin_select" on orders for select using (auth.role() = 'authenticated');
create policy "orders_admin_update" on orders for update using (auth.role() = 'authenticated');

-- 4. order_items: inserção pública
create policy "order_items_insert_public" on order_items for insert with check (true);
create policy "order_items_admin_select" on order_items for select using (auth.role() = 'authenticated');

-- ==============================================================================
-- STORAGE BUCKETS (Configuração via SQL no Supabase Storage)
-- ==============================================================================
-- Buckets:
-- 1. 'previews' (público: leitura livre de áudio 30s)
-- 2. 'comprovativos' (privado: upload público de comprovativo, leitura restrita a autenticados)

insert into storage.buckets (id, name, public) 
values 
  ('previews', 'previews', true),
  ('comprovativos', 'comprovativos', false)
on conflict (id) do nothing;

-- Storage Policies
create policy "previews_public_read" on storage.objects 
  for select using (bucket_id = 'previews');

create policy "comprovativos_public_insert" on storage.objects 
  for insert with check (bucket_id = 'comprovativos');

create policy "comprovativos_admin_read" on storage.objects 
  for select using (bucket_id = 'comprovativos' and auth.role() = 'authenticated');
