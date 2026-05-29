/* ===========================================================================
   O2 Pitch Engine — Fixtures (mock realista)
   ---------------------------------------------------------------------------
   Números ancorados no P&L histórico e tickets reais do Projeto BP
   (historicalData.ts / modelData.ts). NÃO são dados live — servem para validar
   a ideia visualmente. Trocar por fetch das APIs Oxy/BP quando disponíveis;
   o formato já obedece aos schemas em schemas.ts.
   =========================================================================== */
import type {
  OxyKpiPayload,
  BpProjectionPayload,
  StoryPayload,
  DeckConfig,
} from './schemas';

export const oxyFixture: OxyKpiPayload = {
  as_of: '2026-03-31',
  currency: 'BRL',
  revenue_12m_brl: 11_800_000,
  revenue_last_month_brl: 1_124_000,
  revenue_yoy_pct: 68,
  gross_margin_pct: 62,
  ebitda_12m_brl: 2_360_000,
  ebitda_margin_pct: 20,
  cash_brl: 3_200_000,
  burn_monthly_brl: 180_000, // positivo = geração de caixa
  runway_months: null,       // operação lucrativa
  arr_brl: 12_160_000,
  net_revenue_retention_pct: 118,
  ltv_cac: 4.2,
  rule_of_40: 58,
  arr_ladder_12m: [
    { period: '2025-04', arr_brl: 7_820_000 },
    { period: '2025-05', arr_brl: 8_240_000 },
    { period: '2025-06', arr_brl: 8_710_000 },
    { period: '2025-07', arr_brl: 9_180_000 },
    { period: '2025-08', arr_brl: 9_640_000 },
    { period: '2025-09', arr_brl: 10_050_000 },
    { period: '2025-10', arr_brl: 10_520_000 },
    { period: '2025-11', arr_brl: 10_910_000 },
    { period: '2025-12', arr_brl: 11_240_000 },
    { period: '2026-01', arr_brl: 11_590_000 },
    { period: '2026-02', arr_brl: 11_880_000 },
    { period: '2026-03', arr_brl: 12_160_000 },
  ],
  business_units: [
    { key: 'caas',      name: 'CaaS — Consultoria',  mrr_brl: 520_000, arr_brl: 6_240_000, active_clients: 168, churn_3m_pct: 2.1, avg_ticket_brl: 9_210 },
    { key: 'saas',      name: 'SaaS — Oxy + Gênio',  mrr_brl: 380_000, arr_brl: 4_560_000, active_clients: 226, churn_3m_pct: 3.4, avg_ticket_brl: 1_680 },
    { key: 'education', name: 'Education — Dono CFO', mrr_brl: 95_000,  arr_brl: 1_140_000, active_clients: 240, churn_3m_pct: 5.0, avg_ticket_brl: 397 },
    { key: 'baas',      name: 'BaaS — Banking',       mrr_brl: 18_000,  arr_brl: 216_000,   active_clients: 80,  churn_3m_pct: 1.5, avg_ticket_brl: 229 },
  ],
};

export const bpFixture: BpProjectionPayload = {
  scenario: 'BASE',
  assumptions_snapshot_id: 'bp-base-2026-03',
  horizon_years: 5,
  pnl: [
    { year: 2026, revenue_brl: 14_200_000, cogs_brl: 5_400_000,  gross_margin_pct: 62, opex_brl: 6_240_000,  ebitda_brl: 2_560_000,  ebitda_margin_pct: 18 },
    { year: 2027, revenue_brl: 26_000_000, cogs_brl: 9_620_000,  gross_margin_pct: 63, opex_brl: 10_140_000, ebitda_brl: 6_240_000,  ebitda_margin_pct: 24 },
    { year: 2028, revenue_brl: 44_000_000, cogs_brl: 15_840_000, gross_margin_pct: 64, opex_brl: 16_280_000, ebitda_brl: 11_880_000, ebitda_margin_pct: 27 },
    { year: 2029, revenue_brl: 68_000_000, cogs_brl: 23_800_000, gross_margin_pct: 65, opex_brl: 23_800_000, ebitda_brl: 20_400_000, ebitda_margin_pct: 30 },
    { year: 2030, revenue_brl: 98_000_000, cogs_brl: 33_320_000, gross_margin_pct: 66, opex_brl: 33_320_000, ebitda_brl: 31_360_000, ebitda_margin_pct: 32 },
  ],
  cashflow: [
    { year: 2026, fco_brl: 1_900_000,  fci_brl: -2_400_000, fcf_brl: -500_000,   ending_cash_brl: 2_700_000 },
    { year: 2027, fco_brl: 5_100_000,  fci_brl: -3_200_000, fcf_brl: 1_900_000,  ending_cash_brl: 4_600_000 },
    { year: 2028, fco_brl: 10_200_000, fci_brl: -4_800_000, fcf_brl: 5_400_000,  ending_cash_brl: 10_000_000 },
    { year: 2029, fco_brl: 17_800_000, fci_brl: -6_400_000, fcf_brl: 11_400_000, ending_cash_brl: 21_400_000 },
    { year: 2030, fco_brl: 27_600_000, fci_brl: -8_200_000, fcf_brl: 19_400_000, ending_cash_brl: 40_800_000 },
  ],
  saas_metrics: [
    { year: 2026, mrr_eop_brl: 1_180_000, arr_eop_brl: 14_160_000, rule_of_40: 58 },
    { year: 2027, mrr_eop_brl: 2_167_000, arr_eop_brl: 26_000_000, rule_of_40: 67 },
    { year: 2028, mrr_eop_brl: 3_667_000, arr_eop_brl: 44_000_000, rule_of_40: 69 },
    { year: 2029, mrr_eop_brl: 5_667_000, arr_eop_brl: 68_000_000, rule_of_40: 65 },
    { year: 2030, mrr_eop_brl: 8_167_000, arr_eop_brl: 98_000_000, rule_of_40: 60 },
  ],
  valuation_pre_brl: 85_000_000,
};

export const configFixture: DeckConfig = {
  ask_amount_brl: 12_000_000,
  use_of_funds: [
    { label: 'Produto & Engenharia', pct: 40 },
    { label: 'Go-to-market', pct: 30 },
    { label: 'Expansão de BUs', pct: 20 },
    { label: 'G&A / Reserva', pct: 10 },
  ],
  valuation_pre_brl: 85_000_000,
  cap_table: [
    { shareholder: 'Fundadores', pct: 78 },
    { shareholder: 'Pool de opções (ESOP)', pct: 10 },
    { shareholder: 'Investidores-anjo', pct: 12 },
  ],
  tam_sam_som: {
    tam_brl: 48_000_000_000, // gestão financeira/ERP para PMEs no Brasil
    sam_brl: 9_600_000_000,
    som_brl: 480_000_000,
  },
  contact: {
    name: 'Time O2 Inc.',
    role: 'Captação',
    email: 'growth@o2inc.com.br',
  },
};

export const storyFixture: StoryPayload = {
  sections: [
    {
      slug: 'problem',
      title: 'Problema',
      variant: 'both',
      order_idx: 1,
      body_md:
        'PMEs brasileiras tomam decisões financeiras no escuro: dados presos no ERP, planilhas desatualizadas e zero projeção confiável. O resultado é caixa mal gerido e crescimento sem direção.',
    },
    {
      slug: 'solution',
      title: 'Solução',
      variant: 'both',
      order_idx: 2,
      body_md:
        'A O2 conecta o ERP do cliente (Oxy) ao motor de projeção (BP) e entrega gestão financeira viva — realizado, projeção e consultoria num só lugar. Quatro BUs cobrindo do dado à decisão.',
    },
    {
      slug: 'market',
      title: 'Mercado',
      variant: 'book',
      order_idx: 3,
      body_md:
        'São 6,4 milhões de PMEs ativas no Brasil carentes de inteligência financeira. TAM de R$ 48 bi em gestão financeira e ERP; SAM endereçável de R$ 9,6 bi no recorte de média empresa.',
    },
    {
      slug: 'traction',
      title: 'Tração',
      variant: 'book',
      order_idx: 4,
      body_md:
        'ARR de R$ 12,2 mi crescendo 68% YoY, com NRR de 118% e Rule of 40 em 58. Operação já lucrativa (EBITDA 20%), sustentando o crescimento com geração de caixa.',
    },
    {
      slug: 'ask',
      title: 'Ask',
      variant: 'both',
      order_idx: 5,
      body_md:
        'Captação de R$ 12 mi a um valuation pré de R$ 85 mi para acelerar produto, GTM e expansão de BUs rumo a R$ 98 mi de receita em 2030.',
    },
    {
      slug: 'roadmap',
      title: 'Roadmap',
      variant: 'book',
      order_idx: 6,
      body_md:
        '2026: consolidar SaaS e BaaS. 2027–2028: escalar GTM e abrir novos verticais. 2029–2030: liderança em inteligência financeira para a média empresa brasileira.',
    },
  ],
};
