/* ===========================================================================
   O2 Pitch Engine — Contratos de dados (zod)
   ---------------------------------------------------------------------------
   Estes schemas são o CONTRATO entre as 3 fontes de verdade e a engine de PDF.
   Hoje os dados vêm de fixtures (src/domain/fixtures.ts). Quando as APIs reais
   da Oxy e do BP forem plugadas, basta o fetch devolver um objeto que passe
   por estes schemas — nada mais no app muda. Versão do contrato em CONTRACT_VERSION.
   =========================================================================== */
import { z } from 'zod';

export const CONTRACT_VERSION = '1.0.0';

/* ----------------------------- 4.1 OXY (realizado) ----------------------- */

export const oxyBuSchema = z.object({
  key: z.enum(['caas', 'saas', 'education', 'baas']),
  name: z.string(),
  mrr_brl: z.number(),
  arr_brl: z.number(),
  active_clients: z.number(),
  churn_3m_pct: z.number(),
  avg_ticket_brl: z.number(),
});

export const oxyArrPointSchema = z.object({
  period: z.string(), // 'YYYY-MM'
  arr_brl: z.number(),
});

export const oxyKpiPayloadSchema = z.object({
  as_of: z.string(),            // data do snapshot 'YYYY-MM-DD'
  currency: z.literal('BRL'),
  // KPIs base
  revenue_12m_brl: z.number(),
  revenue_last_month_brl: z.number(),
  revenue_yoy_pct: z.number(),
  gross_margin_pct: z.number(),
  ebitda_12m_brl: z.number(),
  ebitda_margin_pct: z.number(),
  cash_brl: z.number(),
  burn_monthly_brl: z.number(),     // negativo = queima; positivo = geração
  runway_months: z.number().nullable(),
  // Tração
  arr_brl: z.number(),
  net_revenue_retention_pct: z.number(),
  ltv_cac: z.number().nullable(),
  rule_of_40: z.number(),
  // Detalhe
  arr_ladder_12m: z.array(oxyArrPointSchema),
  business_units: z.array(oxyBuSchema),
});
export type OxyKpiPayload = z.infer<typeof oxyKpiPayloadSchema>;

/* --------------------------- 4.2 BP (projeções) -------------------------- */

export const bpPnlYearSchema = z.object({
  year: z.number(),
  revenue_brl: z.number(),
  cogs_brl: z.number(),
  gross_margin_pct: z.number(),
  opex_brl: z.number(),
  ebitda_brl: z.number(),
  ebitda_margin_pct: z.number(),
});

export const bpCashflowYearSchema = z.object({
  year: z.number(),
  fco_brl: z.number(),   // fluxo de caixa operacional
  fci_brl: z.number(),   // investimento
  fcf_brl: z.number(),   // fluxo de caixa livre
  ending_cash_brl: z.number(),
});

export const bpSaasYearSchema = z.object({
  year: z.number(),
  mrr_eop_brl: z.number(),
  arr_eop_brl: z.number(),
  rule_of_40: z.number(),
});

export const bpProjectionPayloadSchema = z.object({
  scenario: z.literal('BASE'),
  assumptions_snapshot_id: z.string(),
  horizon_years: z.number(),
  pnl: z.array(bpPnlYearSchema),
  cashflow: z.array(bpCashflowYearSchema),
  saas_metrics: z.array(bpSaasYearSchema),
  valuation_pre_brl: z.number(),
});
export type BpProjectionPayload = z.infer<typeof bpProjectionPayloadSchema>;

/* --------------------------- 4.3 Storytelling ---------------------------- */

export const storyVariant = z.enum(['teaser', 'book', 'both']);

export const storySectionSchema = z.object({
  slug: z.string(),          // 'problem' | 'solution' | 'market' | 'ask' | ...
  title: z.string(),
  body_md: z.string(),
  variant: storyVariant,
  order_idx: z.number(),
});
export type StorySection = z.infer<typeof storySectionSchema>;

export const storyPayloadSchema = z.object({
  sections: z.array(storySectionSchema),
});
export type StoryPayload = z.infer<typeof storyPayloadSchema>;

/* ----------------------------- Deck config ------------------------------- */

export const deckConfigSchema = z.object({
  ask_amount_brl: z.number(),
  use_of_funds: z.array(z.object({ label: z.string(), pct: z.number() })),
  valuation_pre_brl: z.number(),
  cap_table: z.array(z.object({ shareholder: z.string(), pct: z.number() })),
  tam_sam_som: z.object({
    tam_brl: z.number(),
    sam_brl: z.number(),
    som_brl: z.number(),
  }),
  contact: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string().optional(),
  }),
});
export type DeckConfig = z.infer<typeof deckConfigSchema>;

/* -------------------------- Snapshot consolidado ------------------------- */

export const deckSnapshotSchema = z.object({
  id: z.string(),
  kind: z.enum(['teaser', 'book']),
  trigger: z.enum(['manual', 'scheduled']),
  oxy_payload: oxyKpiPayloadSchema,
  bp_payload: bpProjectionPayloadSchema,
  story_payload: storyPayloadSchema,
  config_payload: deckConfigSchema,
  meta: z.object({
    contract_version: z.string(),
    app_version: z.string(),
    tokens_hash: z.string(),
  }),
  pdf_path: z.string().nullable(),
  created_at: z.string(),
});
export type DeckSnapshot = z.infer<typeof deckSnapshotSchema>;
