import { useEffect, useState } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icons';
import { getDeckConfig, saveDeckConfig, resetDeckConfig } from '../domain/dataSource';
import type { DeckConfig } from '../domain/schemas';
import { brl } from '../lib/format';

export function DeckConfigPage() {
  const [cfg, setCfg] = useState<DeckConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getDeckConfig().then(setCfg); }, []);
  if (!cfg) return <div className="container-wide" style={{ padding: '120px 0', color: 'var(--fg-subtle)' }}>Carregando…</div>;

  const set = (patch: Partial<DeckConfig>) => { setCfg({ ...cfg, ...patch }); setSaved(false); };

  const sumFunds = cfg.use_of_funds.reduce((a, f) => a + f.pct, 0);
  const sumCap = cfg.cap_table.reduce((a, c) => a + c.pct, 0);

  async function handleSave() { await saveDeckConfig(cfg!); setSaved(true); }
  async function handleReset() { resetDeckConfig(); setCfg(await getDeckConfig()); setSaved(false); }

  return (
    <>
      <header className="page-head">
        <div className="container-wide">
          <div className="crumbs"><span>O2 Pitch Engine</span><span className="sep">/</span><span>03 Configuração</span></div>
          <Eyebrow accent>F2 · Configuração do deck</Eyebrow>
          <h1>Configuração</h1>
          <p className="lede">O que não vem da Oxy nem do BP: ask, uso de recursos, cap table, TAM/SAM/SOM e contato.</p>
        </div>
      </header>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="container-wide" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Ask & valuation */}
          <div className="card">
            <div className="section-head"><h3 style={{ fontFamily: 'var(--font-display)' }}>Ask & Valuation</h3></div>
            <div className="auto-grid-240">
              <NumField label="Ask (R$)" value={cfg.ask_amount_brl} onChange={(v) => set({ ask_amount_brl: v })} hint={brl(cfg.ask_amount_brl, { compact: true })} />
              <NumField label="Valuation pré (R$)" value={cfg.valuation_pre_brl} onChange={(v) => set({ valuation_pre_brl: v })} hint={brl(cfg.valuation_pre_brl, { compact: true })} />
            </div>
          </div>

          {/* Use of funds */}
          <div className="card">
            <div className="section-head">
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Uso de recursos</h3>
              <span className="pill" style={sumFunds === 100 ? {} : { background: 'rgba(255,107,107,.14)', color: '#FF6B6B' }}>Σ {sumFunds}%</span>
            </div>
            {cfg.use_of_funds.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <input className="input" value={f.label} onChange={(e) => {
                  const arr = [...cfg.use_of_funds]; arr[i] = { ...f, label: e.target.value }; set({ use_of_funds: arr });
                }} />
                <input className="input" type="number" style={{ width: 90 }} value={f.pct} onChange={(e) => {
                  const arr = [...cfg.use_of_funds]; arr[i] = { ...f, pct: Number(e.target.value) }; set({ use_of_funds: arr });
                }} />
                <button className="icon-btn" onClick={() => set({ use_of_funds: cfg.use_of_funds.filter((_, j) => j !== i) })} aria-label="Remover"><Icon.Close size={16} /></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => set({ use_of_funds: [...cfg.use_of_funds, { label: 'Novo', pct: 0 }] })}>+ Linha</button>
          </div>

          {/* Cap table */}
          <div className="card">
            <div className="section-head">
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Cap table</h3>
              <span className="pill" style={sumCap === 100 ? {} : { background: 'rgba(255,107,107,.14)', color: '#FF6B6B' }}>Σ {sumCap}%</span>
            </div>
            {cfg.cap_table.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <input className="input" value={c.shareholder} onChange={(e) => {
                  const arr = [...cfg.cap_table]; arr[i] = { ...c, shareholder: e.target.value }; set({ cap_table: arr });
                }} />
                <input className="input" type="number" style={{ width: 90 }} value={c.pct} onChange={(e) => {
                  const arr = [...cfg.cap_table]; arr[i] = { ...c, pct: Number(e.target.value) }; set({ cap_table: arr });
                }} />
                <button className="icon-btn" onClick={() => set({ cap_table: cfg.cap_table.filter((_, j) => j !== i) })} aria-label="Remover"><Icon.Close size={16} /></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => set({ cap_table: [...cfg.cap_table, { shareholder: 'Novo', pct: 0 }] })}>+ Linha</button>
          </div>

          {/* TAM SAM SOM */}
          <div className="card">
            <div className="section-head"><h3 style={{ fontFamily: 'var(--font-display)' }}>Mercado TAM / SAM / SOM</h3></div>
            <div className="auto-grid-240">
              <NumField label="TAM (R$)" value={cfg.tam_sam_som.tam_brl} onChange={(v) => set({ tam_sam_som: { ...cfg.tam_sam_som, tam_brl: v } })} hint={brl(cfg.tam_sam_som.tam_brl, { compact: true })} />
              <NumField label="SAM (R$)" value={cfg.tam_sam_som.sam_brl} onChange={(v) => set({ tam_sam_som: { ...cfg.tam_sam_som, sam_brl: v } })} hint={brl(cfg.tam_sam_som.sam_brl, { compact: true })} />
              <NumField label="SOM (R$)" value={cfg.tam_sam_som.som_brl} onChange={(v) => set({ tam_sam_som: { ...cfg.tam_sam_som, som_brl: v } })} hint={brl(cfg.tam_sam_som.som_brl, { compact: true })} />
            </div>
          </div>

          {/* Contact */}
          <div className="card">
            <div className="section-head"><h3 style={{ fontFamily: 'var(--font-display)' }}>Contato</h3></div>
            <div className="auto-grid-240">
              <TextField label="Nome" value={cfg.contact.name} onChange={(v) => set({ contact: { ...cfg.contact, name: v } })} />
              <TextField label="Cargo" value={cfg.contact.role} onChange={(v) => set({ contact: { ...cfg.contact, role: v } })} />
              <TextField label="E-mail" value={cfg.contact.email} onChange={(v) => set({ contact: { ...cfg.contact, email: v } })} />
              <TextField label="Telefone" value={cfg.contact.phone ?? ''} onChange={(v) => set({ contact: { ...cfg.contact, phone: v } })} />
            </div>
          </div>

          <div className="save-bar">
            <span className="saved">{saved ? '✓ Salvo localmente' : 'Alterações não salvas'}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>Restaurar padrão</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}><Icon.Check size={14} /> Salvar configuração</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function NumField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div className="field">
      <label>{label}{hint ? <span style={{ color: 'var(--accent)' }}> · {hint}</span> : null}</label>
      <input className="input" type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
