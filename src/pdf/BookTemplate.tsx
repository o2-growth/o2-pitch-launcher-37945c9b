/* ===========================================================================
   Book — pitch deck completo. A4 PAISAGEM, ~15 slides. Mesma identidade O2.
   Casa Oxy (realizado) + BP (projeção) + Story + DeckConfig.
   =========================================================================== */
import { Document, Page, View, Text, StyleSheet, Svg, Circle, Rect, Line } from '@react-pdf/renderer';
import { o2, registerO2Fonts } from './tokens';
import type { OxyKpiPayload, BpProjectionPayload, StoryPayload, DeckConfig } from '../domain/schemas';
import { brl, pct, num, monthLabel } from '../lib/format';
import type { ReactNode } from 'react';

registerO2Fonts();

const s = StyleSheet.create({
  page: { backgroundColor: o2.bg, color: o2.fg, fontFamily: o2.fontBody, paddingTop: 40, paddingBottom: 44, paddingHorizontal: 48, fontSize: 9 },
  // header (eyebrow + title)
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  eyebrowLine: { width: 16, height: 1, backgroundColor: o2.accent },
  eyebrow: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1.6, color: o2.accent, textTransform: 'uppercase' },
  title: { fontFamily: o2.fontDisplay, fontSize: 30, color: o2.fg, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1 },
  slideBody: { flex: 1, marginTop: 22 },
  // footer
  footer: { position: 'absolute', left: 48, right: 48, bottom: 24, flexDirection: 'row', justifyContent: 'space-between',
            borderTop: `1px solid ${o2.border}`, paddingTop: 9 },
  footText: { fontFamily: o2.fontMono, fontSize: 7, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  // generic text
  body: { fontFamily: o2.fontBody, fontSize: 11, color: o2.fgMuted, lineHeight: 1.5 },
  bodyLg: { fontFamily: o2.fontBody, fontSize: 13, color: o2.fgMuted, lineHeight: 1.55, maxWidth: 560 },
  label: { fontFamily: o2.fontMono, fontSize: 7, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  mono: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1, color: o2.fgMuted, textTransform: 'uppercase' },
  // cover
  coverPage: { backgroundColor: o2.bg, color: o2.fg, fontFamily: o2.fontBody, padding: 56, justifyContent: 'center' },
  coverBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 30 },
  coverBrand: { fontFamily: o2.fontMono, fontSize: 11, letterSpacing: 3, color: o2.fgMuted, textTransform: 'uppercase' },
  coverHeadline: { fontFamily: o2.fontDisplay, fontSize: 72, color: o2.fg, textTransform: 'uppercase', lineHeight: 0.96, letterSpacing: 0.5 },
  coverSub: { fontFamily: o2.fontBody, fontSize: 14, color: o2.fgMuted, marginTop: 20, lineHeight: 1.45, maxWidth: 560 },
  coverMetaRow: { flexDirection: 'row', gap: 10, marginTop: 38, alignItems: 'center' },
  coverTag: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 2, color: o2.accent, textTransform: 'uppercase',
              border: `1px solid ${o2.accent}`, borderRadius: o2.radius, paddingVertical: 6, paddingHorizontal: 11 },
  coverDate: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 2, color: o2.fgSubtle, textTransform: 'uppercase' },
  // cards / grid
  card: { backgroundColor: o2.bgElev, border: `1px solid ${o2.border}`, borderRadius: o2.radiusLg, padding: 16 },
  row: { flexDirection: 'row', gap: 12 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  col: { flex: 1 },
  cardLabel: { fontFamily: o2.fontMono, fontSize: 7, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  cardValue: { fontFamily: o2.fontDisplay, fontSize: 26, color: o2.fg, textTransform: 'uppercase', marginTop: 6 },
  cardFoot: { fontFamily: o2.fontMono, fontSize: 7, color: o2.accent, marginTop: 5, letterSpacing: 0.5 },
  // bullets
  bullet: { flexDirection: 'row', gap: 10, marginBottom: 14, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: o2.accent, marginTop: 5 },
  bulletTitle: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase', marginBottom: 3 },
  bulletText: { fontFamily: o2.fontBody, fontSize: 12, color: o2.fg, lineHeight: 1.4 },
  // chart bars
  bars: { flexDirection: 'row', alignItems: 'flex-end', flex: 1, gap: 6, marginTop: 12 },
  barCol: { flex: 1, alignItems: 'center' },
  barVal: { fontFamily: o2.fontMono, fontSize: 6.5, color: o2.fgMuted, marginBottom: 3 },
  bar: { width: '70%', backgroundColor: o2.accent, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontFamily: o2.fontMono, fontSize: 6.5, color: o2.fgSubtle, marginTop: 4 },
  // table
  tHead: { flexDirection: 'row', borderBottom: `1px solid ${o2.borderStrong}`, paddingBottom: 7, marginBottom: 2 },
  tRow: { flexDirection: 'row', borderBottom: `1px solid ${o2.border}`, paddingVertical: 9 },
  th: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  td: { fontFamily: o2.fontMono, fontSize: 10, color: o2.fg },
  tdMuted: { fontFamily: o2.fontMono, fontSize: 10, color: o2.fgMuted },
  // legend (cap table)
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendSwatch: { width: 11, height: 11, borderRadius: 3 },
  legendText: { fontFamily: o2.fontBody, fontSize: 10, color: o2.fg },
  legendPct: { fontFamily: o2.fontMono, fontSize: 9, color: o2.fgMuted },
  // horizontal bars (use of funds)
  hbarRow: { marginBottom: 14 },
  hbarHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  hbarLabel: { fontFamily: o2.fontBody, fontSize: 11, color: o2.fg },
  hbarPct: { fontFamily: o2.fontMono, fontSize: 9, color: o2.accent },
  hbarTrack: { height: 12, backgroundColor: o2.bgElev2, borderRadius: 6, overflow: 'hidden' },
  hbarFill: { height: 12, backgroundColor: o2.accent, borderRadius: 6 },
  // ask hero
  askHero: { backgroundColor: o2.accentSoft, border: `1px solid ${o2.accent}`, borderRadius: o2.radiusLg, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  askLabel: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1.2, color: o2.accent, textTransform: 'uppercase' },
  askValue: { fontFamily: o2.fontDisplay, fontSize: 40, color: o2.fg, textTransform: 'uppercase', marginTop: 4 },
  askMeta: { fontFamily: o2.fontBody, fontSize: 10, color: o2.fgMuted, textAlign: 'right', lineHeight: 1.5 },
  // contact
  contactPage: { backgroundColor: o2.bg, color: o2.fg, fontFamily: o2.fontBody, padding: 56, justifyContent: 'center' },
  contactName: { fontFamily: o2.fontDisplay, fontSize: 48, color: o2.fg, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24 },
  contactRole: { fontFamily: o2.fontMono, fontSize: 10, letterSpacing: 2, color: o2.fgMuted, textTransform: 'uppercase', marginTop: 12 },
  contactEmail: { fontFamily: o2.fontMono, fontSize: 14, color: o2.accent, marginTop: 8, letterSpacing: 0.5 },
  contactNda: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 2, color: o2.fgSubtle, textTransform: 'uppercase', marginTop: 40 },
});

const DASH = '—';

type Props = { oxy: OxyKpiPayload; bp: BpProjectionPayload; story: StoryPayload; config: DeckConfig };

/* ----------------------------- Símbolo de anéis ------------------------- */
function Rings({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 360 360">
      <Circle cx="180" cy="180" r="170" fill="none" stroke={o2.accent} strokeWidth="6" strokeDasharray="2 8" opacity={0.5} />
      <Circle cx="180" cy="180" r="150" fill="none" stroke={o2.accent} strokeWidth="8" strokeDasharray="4 12" opacity={0.7} />
      <Circle cx="180" cy="180" r="46" fill={o2.accent} />
    </Svg>
  );
}

/* ----------------------------- Slide wrapper ---------------------------- */
function Slide({ n, eyebrow, title, children }: { n: number; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <Page size="A4" orientation="landscape" style={s.page}>
      <View style={s.eyebrowRow}>
        <View style={s.eyebrowLine} />
        <Text style={s.eyebrow}>{eyebrow}</Text>
      </View>
      <Text style={s.title}>{title}</Text>
      <View style={s.slideBody}>{children}</View>
      <View style={s.footer}>
        <Text style={s.footText}>{String(n).padStart(2, '0')}</Text>
        <Text style={s.footText}>O2 Inc. · Confidencial</Text>
      </View>
    </Page>
  );
}

/* ----------------------------- helpers ---------------------------------- */
function Stat({ label, value, foot }: { label: string; value: string; foot?: string }) {
  return (
    <View style={[s.card, s.col]}>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={s.cardValue}>{value}</Text>
      {foot ? <Text style={s.cardFoot}>{foot}</Text> : null}
    </View>
  );
}

function Bullet({ label, text }: { label: string; text: string }) {
  return (
    <View style={s.bullet}>
      <View style={s.bulletDot} />
      <View style={{ flex: 1 }}>
        <Text style={s.bulletTitle}>{label}</Text>
        <Text style={s.bulletText}>{text}</Text>
      </View>
    </View>
  );
}

export function BookTemplate({ oxy, bp, story, config }: Props) {
  const get = (slug: string) => story.sections.find((x) => x.slug === slug);
  const problem = get('problem');
  const solution = get('solution');
  const market = get('market');
  const roadmap = get('roadmap');

  const lastPnl = bp.pnl.at(-1);
  const monthYear = monthLabel(oxy.as_of.slice(0, 7));

  // cap table colors (derivados do acento — opacidades distintas, sem novas cores)
  const capColors = [o2.accent, o2.borderStrong, o2.fgSubtle, o2.fgMuted, o2.border];

  const maxArr = Math.max(...oxy.arr_ladder_12m.map((p) => p.arr_brl), 1);
  const maxEndCash = Math.max(...bp.cashflow.map((c) => c.ending_cash_brl), 1);

  return (
    <Document title={`O2 Book — ${monthYear}`} author="O2 Inc.">
      {/* 1 — CAPA */}
      <Page size="A4" orientation="landscape" style={s.coverPage}>
        <View style={s.coverBrandRow}>
          <Rings size={40} />
          <Text style={s.coverBrand}>O2 Inc.</Text>
        </View>
        <Text style={s.coverHeadline}>Inteligência{'\n'}financeira viva</Text>
        <Text style={s.coverSub}>
          Do dado realizado à decisão. A O2 conecta o ERP do cliente à projeção de longo prazo e
          entrega gestão financeira como serviço — em quatro unidades de negócio.
        </Text>
        <View style={s.coverMetaRow}>
          <Text style={s.coverTag}>Pitch Deck · Confidencial</Text>
          <Text style={s.coverDate}>{monthYear}</Text>
        </View>
      </Page>

      {/* 2 — SUMÁRIO EXECUTIVO */}
      <Slide n={2} eyebrow="Executive Summary" title="Sumário executivo">
        <Bullet label="ARR" text={`${brl(oxy.arr_brl, { compact: true })} de receita recorrente, crescendo ${pct(oxy.revenue_yoy_pct, true)} ano a ano.`} />
        <Bullet label="Retenção" text={`NRR de ${pct(oxy.net_revenue_retention_pct)} — a base expande sozinha, sem depender só de novos clientes.`} />
        <Bullet label="Eficiência" text={`Rule of 40 em ${num(oxy.rule_of_40)} e EBITDA de ${pct(oxy.ebitda_margin_pct)}: crescimento com lucro.`} />
        <Bullet label="Margem bruta" text={`${pct(oxy.gross_margin_pct)}${oxy.ltv_cac ? `, com LTV:CAC de ${oxy.ltv_cac.toFixed(1)}x` : ''}.`} />
        <Bullet label="Ask" text={`Captação de ${brl(config.ask_amount_brl, { compact: true })} a valuation pré de ${brl(config.valuation_pre_brl, { compact: true })}${lastPnl ? `, rumo a ${brl(lastPnl.revenue_brl, { compact: true })} em ${lastPnl.year}` : ''}.`} />
      </Slide>

      {/* 3 — PROBLEMA */}
      <Slide n={3} eyebrow="Problema" title={problem?.title ?? 'Problema'}>
        <Text style={s.bodyLg}>{problem?.body_md ?? DASH}</Text>
      </Slide>

      {/* 4 — SOLUÇÃO */}
      <Slide n={4} eyebrow="Solução" title={solution?.title ?? 'Solução'}>
        <Text style={s.bodyLg}>{solution?.body_md ?? DASH}</Text>
      </Slide>

      {/* 5 — MERCADO TAM/SAM/SOM */}
      <Slide n={5} eyebrow="Mercado" title="TAM · SAM · SOM">
        <View style={s.row}>
          <Stat label="TAM — Mercado total" value={brl(config.tam_sam_som.tam_brl, { compact: true })} foot="Gestão financeira & ERP · PMEs BR" />
          <Stat label="SAM — Endereçável" value={brl(config.tam_sam_som.sam_brl, { compact: true })} foot="Recorte de média empresa" />
          <Stat label="SOM — Obtenível" value={brl(config.tam_sam_som.som_brl, { compact: true })} foot="Captura realista de curto prazo" />
        </View>
        <View style={{ marginTop: 22 }}>
          <Text style={s.body}>{market?.body_md ?? DASH}</Text>
        </View>
      </Slide>

      {/* 6 — PRODUTO E BUs */}
      <Slide n={6} eyebrow="Produto" title="Unidades de negócio">
        <View style={s.rowWrap}>
          {oxy.business_units.length === 0 ? (
            <Text style={s.body}>{DASH}</Text>
          ) : (
            oxy.business_units.map((bu) => (
              <View key={bu.key} style={[s.card, { width: '48.5%' }]}>
                <Text style={s.cardLabel}>{bu.name}</Text>
                <View style={[s.row, { marginTop: 10 }]}>
                  <View style={s.col}>
                    <Text style={s.cardLabel}>MRR</Text>
                    <Text style={[s.cardValue, { fontSize: 18 }]}>{brl(bu.mrr_brl, { compact: true })}</Text>
                  </View>
                  <View style={s.col}>
                    <Text style={s.cardLabel}>ARR</Text>
                    <Text style={[s.cardValue, { fontSize: 18 }]}>{brl(bu.arr_brl, { compact: true })}</Text>
                  </View>
                </View>
                <Text style={[s.cardFoot, { color: o2.fgSubtle, marginTop: 9 }]}>
                  {num(bu.active_clients)} clientes · churn {pct(bu.churn_3m_pct)} · ticket {brl(bu.avg_ticket_brl)}
                </Text>
              </View>
            ))
          )}
        </View>
      </Slide>

      {/* 7 — TRAÇÃO */}
      <Slide n={7} eyebrow="Tração" title="KPIs & evolução de ARR">
        <View style={s.row}>
          <Stat label="NRR" value={pct(oxy.net_revenue_retention_pct)} />
          <Stat label="Churn (3m)" value={pct(oxy.business_units[0]?.churn_3m_pct ?? 0)} foot="média ponderada BU líder" />
          <Stat label="Rule of 40" value={num(oxy.rule_of_40)} />
          <Stat label="LTV:CAC" value={oxy.ltv_cac ? `${oxy.ltv_cac.toFixed(1)}x` : DASH} />
        </View>
        <View style={[s.card, { marginTop: 16, flex: 1 }]}>
          <Text style={s.cardLabel}>ARR · últimos 12 meses</Text>
          <View style={s.bars}>
            {oxy.arr_ladder_12m.map((p) => (
              <View key={p.period} style={s.barCol}>
                <Text style={s.barVal}>{brl(p.arr_brl, { compact: true })}</Text>
                <View style={[s.bar, { height: Math.max(6, (p.arr_brl / maxArr) * 120) }]} />
                <Text style={s.barLabel}>{monthLabel(p.period)}</Text>
              </View>
            ))}
          </View>
          <Svg width="100%" height={2} style={{ marginTop: 2 }}>
            <Line x1="0" y1="1" x2="800" y2="1" stroke={o2.border} strokeWidth="1" />
          </Svg>
        </View>
      </Slide>

      {/* 8 — PROJEÇÕES P&L 5 ANOS */}
      <Slide n={8} eyebrow="Projeções" title="P&L · 5 anos (BP base)">
        <View style={s.tHead}>
          <Text style={[s.th, { flex: 1 }]}>Ano</Text>
          <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>Receita</Text>
          <Text style={[s.th, { flex: 1.4, textAlign: 'right' }]}>Margem bruta</Text>
          <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>EBITDA</Text>
          <Text style={[s.th, { flex: 1.4, textAlign: 'right' }]}>EBITDA %</Text>
        </View>
        {bp.pnl.length === 0 ? (
          <Text style={[s.body, { marginTop: 10 }]}>{DASH}</Text>
        ) : (
          bp.pnl.map((y) => (
            <View key={y.year} style={s.tRow}>
              <Text style={[s.td, { flex: 1 }]}>{y.year}</Text>
              <Text style={[s.td, { flex: 2, textAlign: 'right' }]}>{brl(y.revenue_brl, { compact: true })}</Text>
              <Text style={[s.tdMuted, { flex: 1.4, textAlign: 'right' }]}>{pct(y.gross_margin_pct)}</Text>
              <Text style={[s.td, { flex: 2, textAlign: 'right' }]}>{brl(y.ebitda_brl, { compact: true })}</Text>
              <Text style={[s.tdMuted, { flex: 1.4, textAlign: 'right', color: o2.accent }]}>{pct(y.ebitda_margin_pct)}</Text>
            </View>
          ))
        )}
      </Slide>

      {/* 9 — CASHFLOW & CAPITAL */}
      <Slide n={9} eyebrow="Capital" title="Fluxo de caixa & saldo">
        <View style={s.tHead}>
          <Text style={[s.th, { flex: 1 }]}>Ano</Text>
          <Text style={[s.th, { flex: 1.6, textAlign: 'right' }]}>FCO</Text>
          <Text style={[s.th, { flex: 1.6, textAlign: 'right' }]}>FCI</Text>
          <Text style={[s.th, { flex: 1.6, textAlign: 'right' }]}>FCF</Text>
          <Text style={[s.th, { flex: 1.6, textAlign: 'right' }]}>Saldo final</Text>
        </View>
        {bp.cashflow.length === 0 ? (
          <Text style={[s.body, { marginTop: 10 }]}>{DASH}</Text>
        ) : (
          bp.cashflow.map((c) => (
            <View key={c.year} style={s.tRow}>
              <Text style={[s.td, { flex: 1 }]}>{c.year}</Text>
              <Text style={[s.tdMuted, { flex: 1.6, textAlign: 'right' }]}>{brl(c.fco_brl, { compact: true })}</Text>
              <Text style={[s.tdMuted, { flex: 1.6, textAlign: 'right' }]}>{brl(c.fci_brl, { compact: true })}</Text>
              <Text style={[s.tdMuted, { flex: 1.6, textAlign: 'right' }]}>{brl(c.fcf_brl, { compact: true })}</Text>
              <Text style={[s.td, { flex: 1.6, textAlign: 'right' }]}>{brl(c.ending_cash_brl, { compact: true })}</Text>
            </View>
          ))
        )}
        <View style={[s.card, { marginTop: 16, flex: 1 }]}>
          <Text style={s.cardLabel}>Saldo de caixa final por ano</Text>
          <View style={s.bars}>
            {bp.cashflow.map((c) => (
              <View key={c.year} style={s.barCol}>
                <Text style={s.barVal}>{brl(c.ending_cash_brl, { compact: true })}</Text>
                <View style={[s.bar, { height: Math.max(6, (c.ending_cash_brl / maxEndCash) * 100) }]} />
                <Text style={s.barLabel}>{c.year}</Text>
              </View>
            ))}
          </View>
        </View>
      </Slide>

      {/* 10 — UNIT ECONOMICS */}
      <Slide n={10} eyebrow="Unit Economics" title="Economia por cliente">
        <View style={s.row}>
          <Stat label="LTV:CAC" value={oxy.ltv_cac ? `${oxy.ltv_cac.toFixed(1)}x` : DASH} foot="valor vitalício sobre custo de aquisição" />
          <Stat
            label="Payback"
            value={oxy.ltv_cac && oxy.ltv_cac >= 3 ? 'Saudável' : oxy.ltv_cac ? 'Moderado' : DASH}
            foot={oxy.ltv_cac ? `CAC recuperado bem dentro do LTV (${oxy.ltv_cac.toFixed(1)}x)` : 'sem dado de CAC'}
          />
          <Stat label="NRR" value={pct(oxy.net_revenue_retention_pct)} foot="expansão líquida da base" />
          <Stat label="Margem bruta" value={pct(oxy.gross_margin_pct)} foot={`EBITDA ${pct(oxy.ebitda_margin_pct)}`} />
        </View>
        <View style={{ marginTop: 22 }}>
          <Text style={s.body}>
            A combinação de NRR acima de 100% com margem bruta de {pct(oxy.gross_margin_pct)} sustenta crescimento
            com geração de caixa: cada real adquirido se paga e a base expande organicamente.
          </Text>
        </View>
      </Slide>

      {/* 11 — TIME */}
      <Slide n={11} eyebrow="Time" title="Quem está construindo">
        <View style={[s.card, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Rings size={48} />
          <Text style={[s.cardValue, { fontSize: 28, marginTop: 18 }]}>Time O2</Text>
          <Text style={[s.body, { textAlign: 'center', maxWidth: 460, marginTop: 12 }]}>
            Fundadores e liderança técnica/comercial com histórico de execução em finanças e produto.
            As bios completas entram via configuração do deck — placeholder reservado nesta versão.
          </Text>
        </View>
      </Slide>

      {/* 12 — CAP TABLE */}
      <Slide n={12} eyebrow="Estrutura" title="Cap table">
        {config.cap_table.length === 0 ? (
          <Text style={s.body}>{DASH}</Text>
        ) : (
          <>
            <Svg width="100%" height={44} style={{ marginTop: 8, borderRadius: o2.radius, border: `1px solid ${o2.border}` }}>
              {config.cap_table.map((c, i, arr) => {
                const offset = arr.slice(0, i).reduce((acc, x) => acc + x.pct, 0);
                return (
                  <Rect
                    key={c.shareholder}
                    x={`${offset}%`}
                    y={0}
                    width={`${c.pct}%`}
                    height={44}
                    fill={capColors[i % capColors.length]}
                  />
                );
              })}
            </Svg>
            <View style={s.legendRow}>
              {config.cap_table.map((c, i) => (
                <View key={c.shareholder} style={s.legendItem}>
                  <View style={[s.legendSwatch, { backgroundColor: capColors[i % capColors.length] }]} />
                  <Text style={s.legendText}>{c.shareholder}</Text>
                  <Text style={s.legendPct}>{pct(c.pct)}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Slide>

      {/* 13 — ASK & USO DE RECURSOS */}
      <Slide n={13} eyebrow="Ask" title="Captação & uso de recursos">
        <View style={s.askHero}>
          <View>
            <Text style={s.askLabel}>Ask</Text>
            <Text style={s.askValue}>{brl(config.ask_amount_brl, { compact: true })}</Text>
          </View>
          <Text style={s.askMeta}>
            valuation pré {brl(config.valuation_pre_brl, { compact: true })}{'\n'}
            {lastPnl ? `rumo a ${brl(lastPnl.revenue_brl, { compact: true })} em ${lastPnl.year}` : ''}
          </Text>
        </View>
        <View style={{ marginTop: 22 }}>
          <Text style={[s.label, { marginBottom: 12 }]}>Uso dos recursos</Text>
          {config.use_of_funds.length === 0 ? (
            <Text style={s.body}>{DASH}</Text>
          ) : (
            config.use_of_funds.map((u) => (
              <View key={u.label} style={s.hbarRow}>
                <View style={s.hbarHead}>
                  <Text style={s.hbarLabel}>{u.label}</Text>
                  <Text style={s.hbarPct}>{pct(u.pct)}</Text>
                </View>
                <View style={s.hbarTrack}>
                  <View style={[s.hbarFill, { width: `${u.pct}%` }]} />
                </View>
              </View>
            ))
          )}
        </View>
      </Slide>

      {/* 14 — ROADMAP */}
      <Slide n={14} eyebrow="Roadmap" title={roadmap?.title ?? 'Roadmap'}>
        <Text style={s.bodyLg}>{roadmap?.body_md ?? DASH}</Text>
      </Slide>

      {/* 15 — CONTATO */}
      <Page size="A4" orientation="landscape" style={s.contactPage}>
        <View style={s.coverBrandRow}>
          <Rings size={32} />
          <Text style={s.coverBrand}>O2 Inc.</Text>
        </View>
        <Text style={s.contactName}>{config.contact.name}</Text>
        <Text style={s.contactRole}>{config.contact.role}</Text>
        <Text style={s.contactEmail}>{config.contact.email}</Text>
        {config.contact.phone ? <Text style={[s.contactEmail, { color: o2.fgMuted }]}>{config.contact.phone}</Text> : null}
        <Text style={s.contactNda}>NDA · Documento confidencial</Text>
      </Page>
    </Document>
  );
}
