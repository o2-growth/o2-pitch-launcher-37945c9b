// ===========================================================================
// Edge Function: bp-snapshot
// Fonte "projeções" (cenário BASE). HOJE devolve o mock (mesmo bpFixture).
// AMANHÃ: descomente o bloco fetch e configure o Secret BP_API_URL no Lovable.
// A saída DEVE continuar batendo com bpProjectionPayloadSchema.
// ===========================================================================
import { corsHeaders } from '../_shared/cors.ts';

const BP_MOCK = {
  scenario: 'BASE',
  assumptions_snapshot_id: 'bp-base-2026-03',
  horizon_years: 5,
  pnl: [
    { year: 2026, revenue_brl: 14200000, cogs_brl: 5400000, gross_margin_pct: 62, opex_brl: 6240000, ebitda_brl: 2560000, ebitda_margin_pct: 18 },
    { year: 2027, revenue_brl: 26000000, cogs_brl: 9620000, gross_margin_pct: 63, opex_brl: 10140000, ebitda_brl: 6240000, ebitda_margin_pct: 24 },
    { year: 2028, revenue_brl: 44000000, cogs_brl: 15840000, gross_margin_pct: 64, opex_brl: 16280000, ebitda_brl: 11880000, ebitda_margin_pct: 27 },
    { year: 2029, revenue_brl: 68000000, cogs_brl: 23800000, gross_margin_pct: 65, opex_brl: 23800000, ebitda_brl: 20400000, ebitda_margin_pct: 30 },
    { year: 2030, revenue_brl: 98000000, cogs_brl: 33320000, gross_margin_pct: 66, opex_brl: 33320000, ebitda_brl: 31360000, ebitda_margin_pct: 32 },
  ],
  cashflow: [
    { year: 2026, fco_brl: 1900000, fci_brl: -2400000, fcf_brl: -500000, ending_cash_brl: 2700000 },
    { year: 2027, fco_brl: 5100000, fci_brl: -3200000, fcf_brl: 1900000, ending_cash_brl: 4600000 },
    { year: 2028, fco_brl: 10200000, fci_brl: -4800000, fcf_brl: 5400000, ending_cash_brl: 10000000 },
    { year: 2029, fco_brl: 17800000, fci_brl: -6400000, fcf_brl: 11400000, ending_cash_brl: 21400000 },
    { year: 2030, fco_brl: 27600000, fci_brl: -8200000, fcf_brl: 19400000, ending_cash_brl: 40800000 },
  ],
  saas_metrics: [
    { year: 2026, mrr_eop_brl: 1180000, arr_eop_brl: 14160000, rule_of_40: 58 },
    { year: 2027, mrr_eop_brl: 2167000, arr_eop_brl: 26000000, rule_of_40: 67 },
    { year: 2028, mrr_eop_brl: 3667000, arr_eop_brl: 44000000, rule_of_40: 69 },
    { year: 2029, mrr_eop_brl: 5667000, arr_eop_brl: 68000000, rule_of_40: 65 },
    { year: 2030, mrr_eop_brl: 8167000, arr_eop_brl: 98000000, rule_of_40: 60 },
  ],
  valuation_pre_brl: 85000000,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let payload = BP_MOCK;

    // === INTEGRAÇÃO REAL (ativar quando a API do BP existir) ===
    // const apiUrl = Deno.env.get('BP_API_URL');
    // const apiKey = Deno.env.get('BP_API_KEY'); // se necessário
    // if (apiUrl) {
    //   const res = await fetch(`${apiUrl}/projection?scenario=BASE`, {
    //     headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    //   });
    //   if (!res.ok) throw new Error(`BP API ${res.status}`);
    //   payload = await res.json(); // deve obedecer bpProjectionPayloadSchema
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
