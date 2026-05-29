/* ===========================================================================
   Teaser — 1 página A4 retrato. Casa Oxy (realizado) + BP (projeção) + Story.
   =========================================================================== */
import { Document, Page, View, Text, StyleSheet, Svg, Circle } from '@react-pdf/renderer';
import { o2, registerO2Fonts } from './tokens';
import type { OxyKpiPayload, BpProjectionPayload, StoryPayload, DeckConfig } from '../domain/schemas';
import { brl, pct, num, monthLabel } from '../lib/format';

registerO2Fonts();

const s = StyleSheet.create({
  page: { backgroundColor: o2.bg, color: o2.fg, fontFamily: o2.fontBody, padding: 40, fontSize: 9 },
  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1, color: o2.fgMuted, textTransform: 'uppercase' },
  date: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  // eyebrow
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  eyebrowLine: { width: 16, height: 1, backgroundColor: o2.accent },
  eyebrow: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1.6, color: o2.accent, textTransform: 'uppercase' },
  // headline
  headline: { fontFamily: o2.fontDisplay, fontSize: 46, color: o2.fg, textTransform: 'uppercase', lineHeight: 0.98, letterSpacing: 0.5 },
  sub: { fontFamily: o2.fontBody, fontSize: 11, color: o2.fgMuted, marginTop: 12, lineHeight: 1.4, maxWidth: 420 },
  // kpis
  kpiRow: { flexDirection: 'row', gap: 8, marginTop: 26 },
  kpi: { flex: 1, backgroundColor: o2.bgElev, border: `1px solid ${o2.border}`, borderRadius: o2.radius, padding: 12 },
  kpiLabel: { fontFamily: o2.fontMono, fontSize: 7, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
  kpiValue: { fontFamily: o2.fontDisplay, fontSize: 24, color: o2.fg, textTransform: 'uppercase', marginTop: 6 },
  kpiFoot: { fontFamily: o2.fontMono, fontSize: 7, color: o2.accent, marginTop: 4, letterSpacing: 0.5 },
  // section
  sectionTitle: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1.4, color: o2.fgSubtle, textTransform: 'uppercase', marginBottom: 6 },
  body: { fontFamily: o2.fontBody, fontSize: 9.5, color: o2.fgMuted, lineHeight: 1.45 },
  twoCol: { flexDirection: 'row', gap: 18, marginTop: 26 },
  col: { flex: 1 },
  // projection
  projWrap: { marginTop: 26, backgroundColor: o2.bgElev, border: `1px solid ${o2.border}`, borderRadius: o2.radius, padding: 16 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 14, marginTop: 10 },
  barCol: { flex: 1, alignItems: 'center' },
  barVal: { fontFamily: o2.fontMono, fontSize: 7, color: o2.fgMuted, marginBottom: 3 },
  bar: { width: 34, backgroundColor: o2.accent, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontFamily: o2.fontMono, fontSize: 7, color: o2.fgSubtle, marginTop: 4 },
  // ask
  ask: { marginTop: 26, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
         backgroundColor: o2.accentSoft, border: `1px solid ${o2.accent}`, borderRadius: o2.radius, padding: 16 },
  askLabel: { fontFamily: o2.fontMono, fontSize: 8, letterSpacing: 1.2, color: o2.accent, textTransform: 'uppercase' },
  askValue: { fontFamily: o2.fontDisplay, fontSize: 26, color: o2.fg, textTransform: 'uppercase', marginTop: 4 },
  askMeta: { fontFamily: o2.fontBody, fontSize: 9, color: o2.fgMuted, textAlign: 'right' },
  // footer
  footer: { position: 'absolute', left: 40, right: 40, bottom: 28, flexDirection: 'row', justifyContent: 'space-between',
            borderTop: `1px solid ${o2.border}`, paddingTop: 10 },
  footText: { fontFamily: o2.fontMono, fontSize: 7, letterSpacing: 1, color: o2.fgSubtle, textTransform: 'uppercase' },
});

type Props = { oxy: OxyKpiPayload; bp: BpProjectionPayload; story: StoryPayload; config: DeckConfig };

function Rings() {
  return (
    <Svg width={22} height={22} viewBox="0 0 360 360">
      <Circle cx="180" cy="180" r="170" fill="none" stroke={o2.accent} strokeWidth="6" strokeDasharray="2 8" opacity={0.5} />
      <Circle cx="180" cy="180" r="150" fill="none" stroke={o2.accent} strokeWidth="8" strokeDasharray="4 12" opacity={0.7} />
      <Circle cx="180" cy="180" r="46" fill={o2.accent} />
    </Svg>
  );
}

export function TeaserTemplate({ oxy, bp, story, config }: Props) {
  const get = (slug: string) => story.sections.find((x) => x.slug === slug && x.variant !== 'book');
  const problem = get('problem');
  const solution = get('solution');
  const proj3 = bp.pnl.slice(0, 3);
  const maxRev = Math.max(...proj3.map((y) => y.revenue_brl));

  return (
    <Document title={`O2 Teaser — ${monthLabel(oxy.as_of.slice(0, 7))}`} author="O2 Inc.">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.brand}><Rings /><Text style={s.brandName}>O2 Inc.</Text></View>
          <Text style={s.date}>{monthLabel(oxy.as_of.slice(0, 7))} · Confidencial</Text>
        </View>

        <View style={s.eyebrowRow}>
          <View style={s.eyebrowLine} /><Text style={s.eyebrow}>Executive Teaser</Text>
        </View>
        <Text style={s.headline}>Inteligência{'\n'}financeira viva</Text>
        <Text style={s.sub}>
          A O2 conecta o ERP do cliente à projeção de longo prazo e entrega gestão financeira como
          serviço — do dado realizado à decisão, em quatro unidades de negócio.
        </Text>

        <View style={s.kpiRow}>
          <Kpi label="ARR" value={brl(oxy.arr_brl, { compact: true })} foot={`${pct(oxy.revenue_yoy_pct, true)} YoY`} />
          <Kpi label="Margem Bruta" value={pct(oxy.gross_margin_pct)} foot={`EBITDA ${pct(oxy.ebitda_margin_pct)}`} />
          <Kpi label="NRR" value={pct(oxy.net_revenue_retention_pct)} foot={oxy.ltv_cac ? `LTV:CAC ${oxy.ltv_cac.toFixed(1)}x` : ''} />
          <Kpi label="Rule of 40" value={num(oxy.rule_of_40)} foot="crescimento + margem" />
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionTitle}>{problem?.title ?? 'Problema'}</Text>
            <Text style={s.body}>{problem?.body_md ?? '—'}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.sectionTitle}>{solution?.title ?? 'Solução'}</Text>
            <Text style={s.body}>{solution?.body_md ?? '—'}</Text>
          </View>
        </View>

        <View style={s.projWrap}>
          <Text style={s.sectionTitle}>Projeção de receita · cenário BASE (BP)</Text>
          <View style={s.bars}>
            {proj3.map((y) => (
              <View key={y.year} style={s.barCol}>
                <Text style={s.barVal}>{brl(y.revenue_brl, { compact: true })}</Text>
                <View style={[s.bar, { height: Math.max(8, (y.revenue_brl / maxRev) * 78) }]} />
                <Text style={s.barLabel}>{y.year}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.ask}>
          <View>
            <Text style={s.askLabel}>Ask</Text>
            <Text style={s.askValue}>{brl(config.ask_amount_brl, { compact: true })}</Text>
          </View>
          <Text style={s.askMeta}>
            valuation pré {brl(config.valuation_pre_brl, { compact: true })}{'\n'}
            rumo a {brl(bp.pnl.at(-1)!.revenue_brl, { compact: true })} em {bp.pnl.at(-1)!.year}
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footText}>{config.contact.name} · {config.contact.email}</Text>
          <Text style={s.footText}>NDA · Documento confidencial</Text>
        </View>
      </Page>
    </Document>
  );
}

function Kpi({ label, value, foot }: { label: string; value: string; foot?: string }) {
  return (
    <View style={s.kpi}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={s.kpiValue}>{value}</Text>
      {foot ? <Text style={s.kpiFoot}>{foot}</Text> : null}
    </View>
  );
}
