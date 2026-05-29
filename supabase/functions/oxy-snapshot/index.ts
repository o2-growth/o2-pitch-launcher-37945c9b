// ===========================================================================
// Edge Function: oxy-snapshot
// Fonte "realizado". HOJE devolve o mock (mesmo oxyFixture do frontend).
// AMANHÃ: descomente o bloco fetch e configure os Secrets OXY_API_URL / OXY_API_KEY
// no Lovable Cloud. A saída DEVE continuar batendo com oxyKpiPayloadSchema.
// ===========================================================================
import { corsHeaders } from '../_shared/cors.ts';

const OXY_MOCK = {
  as_of: '2026-03-31',
  currency: 'BRL',
  revenue_12m_brl: 11800000,
  revenue_last_month_brl: 1124000,
  revenue_yoy_pct: 68,
  gross_margin_pct: 62,
  ebitda_12m_brl: 2360000,
  ebitda_margin_pct: 20,
  cash_brl: 3200000,
  burn_monthly_brl: 180000,
  runway_months: null,
  arr_brl: 12160000,
  net_revenue_retention_pct: 118,
  ltv_cac: 4.2,
  rule_of_40: 58,
  arr_ladder_12m: [
    { period: '2025-04', arr_brl: 7820000 }, { period: '2025-05', arr_brl: 8240000 },
    { period: '2025-06', arr_brl: 8710000 }, { period: '2025-07', arr_brl: 9180000 },
    { period: '2025-08', arr_brl: 9640000 }, { period: '2025-09', arr_brl: 10050000 },
    { period: '2025-10', arr_brl: 10520000 }, { period: '2025-11', arr_brl: 10910000 },
    { period: '2025-12', arr_brl: 11240000 }, { period: '2026-01', arr_brl: 11590000 },
    { period: '2026-02', arr_brl: 11880000 }, { period: '2026-03', arr_brl: 12160000 },
  ],
  business_units: [
    { key: 'caas', name: 'CaaS — Consultoria', mrr_brl: 520000, arr_brl: 6240000, active_clients: 168, churn_3m_pct: 2.1, avg_ticket_brl: 9210 },
    { key: 'saas', name: 'SaaS — Oxy + Gênio', mrr_brl: 380000, arr_brl: 4560000, active_clients: 226, churn_3m_pct: 3.4, avg_ticket_brl: 1680 },
    { key: 'education', name: 'Education — Dono CFO', mrr_brl: 95000, arr_brl: 1140000, active_clients: 240, churn_3m_pct: 5.0, avg_ticket_brl: 397 },
    { key: 'baas', name: 'BaaS — Banking', mrr_brl: 18000, arr_brl: 216000, active_clients: 80, churn_3m_pct: 1.5, avg_ticket_brl: 229 },
  ],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let payload = OXY_MOCK;

    // === INTEGRAÇÃO REAL (ativar quando a API da Oxy existir) ===
    // const apiUrl = Deno.env.get('OXY_API_URL');
    // const apiKey = Deno.env.get('OXY_API_KEY');
    // if (apiUrl && apiKey) {
    //   const res = await fetch(`${apiUrl}/snapshot`, {
    //     headers: { Authorization: `Bearer ${apiKey}` },
    //   });
    //   if (!res.ok) throw new Error(`Oxy API ${res.status}`);
    //   payload = await res.json(); // deve obedecer oxyKpiPayloadSchema
    // }

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
