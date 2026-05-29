/* ===========================================================================
   Cliente Supabase (Lovable Cloud).
   Dual-mode: se as envs não existirem (dev local sem backend), o app continua
   no modo mock (fixtures + localStorage). Quando o Lovable Cloud injeta
   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY, o app passa a usar o banco real.
   =========================================================================== */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url!, anonKey!)
  : null;
