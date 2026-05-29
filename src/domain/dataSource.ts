/* ===========================================================================
   O2 Pitch Engine — Data source (seam mock ↔ Supabase)
   ---------------------------------------------------------------------------
   Dual-mode controlado por isSupabaseEnabled (src/lib/supabase.ts):
   - SEM backend (dev local): fixtures + localStorage (comportamento original).
   - COM Lovable Cloud: tabelas story_sections/deck_config + edge functions
     oxy-snapshot/bp-snapshot.
   Em ambos os modos a saída passa pelos schemas zod (o contrato não muda).
   =========================================================================== */
import {
  oxyKpiPayloadSchema,
  bpProjectionPayloadSchema,
  storyPayloadSchema,
  deckConfigSchema,
  type OxyKpiPayload,
  type BpProjectionPayload,
  type StoryPayload,
  type DeckConfig,
} from './schemas';
import { oxyFixture, bpFixture, storyFixture, configFixture } from './fixtures';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

/* ----------------------------- OXY ----------------------------- */
export async function getOxySnapshot(): Promise<OxyKpiPayload> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase.functions.invoke('oxy-snapshot');
    if (error) throw error;
    return oxyKpiPayloadSchema.parse(data);
  }
  return oxyKpiPayloadSchema.parse(oxyFixture);
}

/* ----------------------------- BP ------------------------------ */
export async function getBpProjection(): Promise<BpProjectionPayload> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase.functions.invoke('bp-snapshot');
    if (error) throw error;
    return bpProjectionPayloadSchema.parse(data);
  }
  return bpProjectionPayloadSchema.parse(bpFixture);
}

/* --------------------------- STORY ----------------------------- */
export async function getStory(): Promise<StoryPayload> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('story_sections')
      .select('slug,title,body_md,variant,order_idx')
      .order('order_idx', { ascending: true });
    if (error) throw error;
    return storyPayloadSchema.parse({ sections: data ?? [] });
  }
  const cached = typeof localStorage !== 'undefined' ? localStorage.getItem('o2-story') : null;
  if (cached) {
    try { return storyPayloadSchema.parse(JSON.parse(cached)); } catch { /* cache inválido */ }
  }
  return storyPayloadSchema.parse(storyFixture);
}

export async function saveStory(story: StoryPayload): Promise<StoryPayload> {
  const parsed = storyPayloadSchema.parse(story);
  if (isSupabaseEnabled && supabase) {
    const rows = parsed.sections.map((s) => ({ ...s, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('story_sections').upsert(rows, { onConflict: 'slug,variant' });
    if (error) throw error;
    return parsed;
  }
  localStorage.setItem('o2-story', JSON.stringify(parsed));
  return parsed;
}

/* --------------------------- CONFIG ---------------------------- */
export async function getDeckConfig(): Promise<DeckConfig> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('deck_config')
      .select('ask_amount_brl,use_of_funds,valuation_pre_brl,cap_table,tam_sam_som,contact')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (data) return deckConfigSchema.parse(data);
    return deckConfigSchema.parse(configFixture);
  }
  const cached = typeof localStorage !== 'undefined' ? localStorage.getItem('o2-config') : null;
  if (cached) {
    try { return deckConfigSchema.parse(JSON.parse(cached)); } catch { /* cache inválido */ }
  }
  return deckConfigSchema.parse(configFixture);
}

export async function saveDeckConfig(config: DeckConfig): Promise<DeckConfig> {
  const parsed = deckConfigSchema.parse(config);
  if (isSupabaseEnabled && supabase) {
    const row = { ...parsed, updated_at: new Date().toISOString() };
    const { data: existing } = await supabase.from('deck_config').select('id').limit(1).maybeSingle();
    const { error } = existing
      ? await supabase.from('deck_config').update(row).eq('id', existing.id)
      : await supabase.from('deck_config').insert(row);
    if (error) throw error;
    return parsed;
  }
  localStorage.setItem('o2-config', JSON.stringify(parsed));
  return parsed;
}

/* -------- reset (modo mock; em Supabase é no-op seguro) -------- */
export function resetStory() { localStorage.removeItem('o2-story'); }
export function resetDeckConfig() { localStorage.removeItem('o2-config'); }

/** Carrega as 3 fontes de uma vez (dashboard e gerador). */
export async function loadAllSources() {
  const [oxy, bp, story, config] = await Promise.all([
    getOxySnapshot(),
    getBpProjection(),
    getStory(),
    getDeckConfig(),
  ]);
  return { oxy, bp, story, config };
}
