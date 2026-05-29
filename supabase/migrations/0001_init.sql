-- ===========================================================================
-- O2 Pitch Engine — schema inicial (Lovable Cloud / Supabase)
-- Colunas espelham EXATAMENTE os campos de src/domain/schemas.ts para que o
-- .parse() (zod) do frontend continue passando sem mapeamento extra.
-- ===========================================================================

-- ---------- story_sections (narrativa versionada) ----------
create table if not exists public.story_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  body_md text not null,
  variant text not null default 'book' check (variant in ('teaser','book','both')),
  order_idx int not null,
  updated_at timestamptz default now(),
  unique (slug, variant)
);

-- ---------- deck_config (config de linha única) ----------
create table if not exists public.deck_config (
  id uuid primary key default gen_random_uuid(),
  ask_amount_brl numeric,
  use_of_funds jsonb,
  valuation_pre_brl numeric,
  cap_table jsonb,
  tam_sam_som jsonb,
  contact jsonb,
  updated_at timestamptz default now()
);

-- ---------- deck_snapshots (versões geradas) ----------
create table if not exists public.deck_snapshots (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('teaser','book')),
  trigger text not null check (trigger in ('manual','scheduled')),
  oxy_payload jsonb not null,
  bp_payload jsonb not null,
  story_payload jsonb not null,
  config_payload jsonb not null,
  meta jsonb not null,
  pdf_path text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- ===========================================================================
-- RLS — tudo restrito a usuários autenticados.
-- ===========================================================================
alter table public.story_sections  enable row level security;
alter table public.deck_config      enable row level security;
alter table public.deck_snapshots   enable row level security;

-- story_sections: leitura/escrita para authenticated
create policy "story_sections rw" on public.story_sections
  for all to authenticated using (true) with check (true);

-- deck_config: leitura/escrita para authenticated
create policy "deck_config rw" on public.deck_config
  for all to authenticated using (true) with check (true);

-- deck_snapshots: authenticated lê tudo e insere; sem update/delete por padrão
create policy "deck_snapshots select" on public.deck_snapshots
  for select to authenticated using (true);
create policy "deck_snapshots insert" on public.deck_snapshots
  for insert to authenticated with check (true);
create policy "deck_snapshots delete own" on public.deck_snapshots
  for delete to authenticated using (auth.uid() = created_by);

-- ===========================================================================
-- SEED — mesmos valores de src/domain/fixtures.ts
-- ===========================================================================
insert into public.story_sections (slug, title, body_md, variant, order_idx) values
  ('problem',   'Problema', 'PMEs brasileiras tomam decisões financeiras no escuro: dados presos no ERP, planilhas desatualizadas e zero projeção confiável. O resultado é caixa mal gerido e crescimento sem direção.', 'both', 1),
  ('solution',  'Solução',  'A O2 conecta o ERP do cliente (Oxy) ao motor de projeção (BP) e entrega gestão financeira viva — realizado, projeção e consultoria num só lugar. Quatro BUs cobrindo do dado à decisão.', 'both', 2),
  ('market',    'Mercado',  'São 6,4 milhões de PMEs ativas no Brasil carentes de inteligência financeira. TAM de R$ 48 bi em gestão financeira e ERP; SAM endereçável de R$ 9,6 bi no recorte de média empresa.', 'book', 3),
  ('traction',  'Tração',   'ARR de R$ 12,2 mi crescendo 68% YoY, com NRR de 118% e Rule of 40 em 58. Operação já lucrativa (EBITDA 20%), sustentando o crescimento com geração de caixa.', 'book', 4),
  ('ask',       'Ask',      'Captação de R$ 12 mi a um valuation pré de R$ 85 mi para acelerar produto, GTM e expansão de BUs rumo a R$ 98 mi de receita em 2030.', 'both', 5),
  ('roadmap',   'Roadmap',  '2026: consolidar SaaS e BaaS. 2027–2028: escalar GTM e abrir novos verticais. 2029–2030: liderança em inteligência financeira para a média empresa brasileira.', 'book', 6)
on conflict (slug, variant) do nothing;

insert into public.deck_config (ask_amount_brl, use_of_funds, valuation_pre_brl, cap_table, tam_sam_som, contact) values (
  12000000,
  '[{"label":"Produto & Engenharia","pct":40},{"label":"Go-to-market","pct":30},{"label":"Expansão de BUs","pct":20},{"label":"G&A / Reserva","pct":10}]'::jsonb,
  85000000,
  '[{"shareholder":"Fundadores","pct":78},{"shareholder":"Pool de opções (ESOP)","pct":10},{"shareholder":"Investidores-anjo","pct":12}]'::jsonb,
  '{"tam_brl":48000000000,"sam_brl":9600000000,"som_brl":480000000}'::jsonb,
  '{"name":"Time O2 Inc.","role":"Captação","email":"growth@o2inc.com.br"}'::jsonb
);
