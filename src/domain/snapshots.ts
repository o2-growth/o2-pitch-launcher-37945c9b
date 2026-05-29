/* ===========================================================================
   Arquivo de snapshots (versionamento) — dual-mode.
   - mock local: localStorage.
   - Lovable Cloud: tabela deck_snapshots.
   As funções são async em ambos os modos (assinatura única para o frontend).
   =========================================================================== */
import { deckSnapshotSchema, CONTRACT_VERSION, type DeckSnapshot } from './schemas';
import type { OxyKpiPayload, BpProjectionPayload, StoryPayload, DeckConfig } from './schemas';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const KEY = 'o2-snapshots';
export const APP_VERSION = '0.5.0';
export const TOKENS_HASH = 'o2-ds-v1';

type Sources = { oxy: OxyKpiPayload; bp: BpProjectionPayload; story: StoryPayload; config: DeckConfig };

const SNAP_COLS = 'id,kind,trigger,oxy_payload,bp_payload,story_payload,config_payload,meta,pdf_path,created_at';

function readLocal(): DeckSnapshot[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as unknown[])
      .map((s) => deckSnapshotSchema.safeParse(s))
      .filter((r): r is { success: true; data: DeckSnapshot } => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

export async function listSnapshots(): Promise<DeckSnapshot[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('deck_snapshots')
      .select(SNAP_COLS)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? [])
      .map((s) => deckSnapshotSchema.safeParse(s))
      .filter((r): r is { success: true; data: DeckSnapshot } => r.success)
      .map((r) => r.data);
  }
  return readLocal().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createSnapshot(
  kind: DeckSnapshot['kind'],
  trigger: DeckSnapshot['trigger'],
  src: Sources,
): Promise<DeckSnapshot> {
  const base = {
    kind,
    trigger,
    oxy_payload: src.oxy,
    bp_payload: src.bp,
    story_payload: src.story,
    config_payload: src.config,
    meta: { contract_version: CONTRACT_VERSION, app_version: APP_VERSION, tokens_hash: TOKENS_HASH },
    pdf_path: null,
  };

  if (isSupabaseEnabled && supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('deck_snapshots')
      .insert({ ...base, created_by: userData.user?.id ?? null })
      .select(SNAP_COLS)
      .single();
    if (error) throw error;
    return deckSnapshotSchema.parse(data);
  }

  const snap = deckSnapshotSchema.parse({ ...base, id: crypto.randomUUID(), created_at: new Date().toISOString() });
  const all = readLocal();
  all.unshift(snap);
  localStorage.setItem(KEY, JSON.stringify(all));
  return snap;
}

export async function deleteSnapshot(id: string): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from('deck_snapshots').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(readLocal().filter((s) => s.id !== id)));
}
