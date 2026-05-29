import { useEffect, useState } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { loadAllSources } from '../domain/dataSource';
import type { OxyKpiPayload, BpProjectionPayload } from '../domain/schemas';
import { brl, pct, num } from '../lib/format';

export function Dashboard() {
  const [oxy, setOxy] = useState<OxyKpiPayload | null>(null);
  const [bp, setBp] = useState<BpProjectionPayload | null>(null);

  useEffect(() => {
    loadAllSources().then(({ oxy, bp }) => { setOxy(oxy); setBp(bp); });
  }, []);

  if (!oxy || !bp) {
    return <div className="container-wide" style={{ padding: '120px 0', color: 'var(--fg-subtle)' }}>Carregando fontes…</div>;
  }

  const maxRev = Math.max(...bp.pnl.map((y) => y.revenue_brl));

  return (
    <>
      <header className="page-head">
        <div className="container-wide">
          <div className="crumbs">
            <span>O2 Pitch Engine</span><span className="sep">/</span><span>01 Dashboard</span>
          </div>
          <Eyebrow accent>Executive Overview · {oxy.as_of}</Eyebrow>
          <h1>Dados vivos<br />da O2</h1>
          <p className="lede">
            Realizado (Oxy) + projeção (BP) consolidados. É daqui que o Teaser e o Book são gerados,
            sem retrabalho manual e sem número desatualizado.
          </p>
        </div>
      </header>

      {/* KPIs Oxy */}
      <section className="block">
        <div className="container-wide">
          <div className="section-head">
            <div>
              <Eyebrow>Oxy · Realizado 12 meses</Eyebrow>
              <h2>Indicadores</h2>
            </div>
            <span className="pill">Fonte: Oxy</span>
          </div>

          <div className="auto-grid-240">
            <Kpi label="ARR" value={brl(oxy.arr_brl, { compact: true })} delta={`${pct(oxy.revenue_yoy_pct, true)} YoY`} up foot="Receita recorrente anualizada" />
            <Kpi label="Receita 12m" value={brl(oxy.revenue_12m_brl, { compact: true })} foot={`Último mês ${brl(oxy.revenue_last_month_brl, { compact: true })}`} />
            <Kpi label="Margem Bruta" value={pct(oxy.gross_margin_pct)} foot={`EBITDA ${pct(oxy.ebitda_margin_pct)}`} />
            <Kpi label="Rule of 40" value={num(oxy.rule_of_40)} up={oxy.rule_of_40 >= 40} foot="Crescimento + margem" />
            <Kpi label="NRR" value={pct(oxy.net_revenue_retention_pct)} up foot="Net Revenue Retention" />
            <Kpi label="LTV : CAC" value={oxy.ltv_cac ? `${oxy.ltv_cac.toFixed(1)}x` : '—'} up foot="Eficiência de aquisição" />
            <Kpi label="Caixa" value={brl(oxy.cash_brl, { compact: true })} foot={oxy.runway_months ? `Runway ${oxy.runway_months}m` : 'Operação lucrativa'} />
            <Kpi label="Geração de caixa" value={`${brl(oxy.burn_monthly_brl, { compact: true })}/mês`} up foot="Fluxo operacional" />
          </div>
        </div>
      </section>

      {/* BUs */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div className="section-head">
            <div>
              <Eyebrow>Oxy · Por unidade de negócio</Eyebrow>
              <h2>Business Units</h2>
            </div>
          </div>
          <div className="auto-grid-280">
            {oxy.business_units.map((bu) => (
              <div key={bu.key} className="bu-card">
                <span className="bu-name">{bu.name}</span>
                <div className="bu-row"><span className="k">MRR</span><span className="v">{brl(bu.mrr_brl, { compact: true })}</span></div>
                <div className="bu-row"><span className="k">ARR</span><span className="v">{brl(bu.arr_brl, { compact: true })}</span></div>
                <div className="bu-row"><span className="k">Clientes</span><span className="v">{num(bu.active_clients)}</span></div>
                <div className="bu-row"><span className="k">Churn 3m</span><span className="v">{pct(bu.churn_3m_pct)}</span></div>
                <div className="bu-row"><span className="k">Ticket médio</span><span className="v">{brl(bu.avg_ticket_brl)}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BP projection */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div className="section-head">
            <div>
              <Eyebrow accent>BP · Projeção cenário BASE</Eyebrow>
              <h2>Receita até 2030</h2>
            </div>
            <span className="pill">Fonte: BP</span>
          </div>

          <div className="card">
            <div className="bars">
              {bp.pnl.map((y) => (
                <div key={y.year} className="bar-col">
                  <span className="bar-val">{brl(y.revenue_brl, { compact: true })}</span>
                  <div className="bar" style={{ height: `${(y.revenue_brl / maxRev) * 100}%` }} />
                  <span className="bar-label">{y.year}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-muted)' }}>
              <span>EBITDA 2030: <strong style={{ color: 'var(--fg)' }}>{brl(bp.pnl.at(-1)!.ebitda_brl, { compact: true })}</strong> ({pct(bp.pnl.at(-1)!.ebitda_margin_pct)})</span>
              <span>ARR EOP 2030: <strong style={{ color: 'var(--fg)' }}>{brl(bp.saas_metrics.at(-1)!.arr_eop_brl, { compact: true })}</strong></span>
              <span>Valuation pré: <strong style={{ color: 'var(--accent)' }}>{brl(bp.valuation_pre_brl, { compact: true })}</strong></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Kpi({ label, value, delta, up, down, foot }: {
  label: string; value: string; delta?: string; up?: boolean; down?: boolean; foot?: string;
}) {
  return (
    <div className="kpi">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      {delta && <span className={`kpi-delta ${up ? 'up' : down ? 'down' : ''}`}>{delta}</span>}
      {foot && <span className="kpi-foot">{foot}</span>}
    </div>
  );
}
