import { Suspense, lazy, useEffect, useState } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icons';
import { ClientOnly } from '../components/ClientOnly';
import { listSnapshots, deleteSnapshot } from '../domain/snapshots';
import type { DeckSnapshot } from '../domain/schemas';
import { brl, pct } from '../lib/format';

const PdfClient = lazy(() => import('../pdf/PdfClient'));

function whenLabel(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function Versions() {
  const [snaps, setSnaps] = useState<DeckSnapshot[]>([]);

  useEffect(() => { listSnapshots().then(setSnaps); }, []);

  async function remove(id: string) {
    await deleteSnapshot(id);
    setSnaps(await listSnapshots());
  }

  return (
    <>
      <header className="page-head">
        <div className="container-wide">
          <div className="crumbs"><span>O2 Pitch Engine</span><span className="sep">/</span><span>05 Versões</span></div>
          <Eyebrow accent>F6 · Histórico</Eyebrow>
          <h1>Versões</h1>
          <p className="lede">
            Cada deck gerado congela as 3 fontes num snapshot. Baixe qualquer versão de novo — o PDF é
            re-renderizado a partir dos dados arquivados.
          </p>
        </div>
      </header>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="container-wide">
          {snaps.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '64px 28px', color: 'var(--fg-muted)' }}>
              <Icon.Pdf size={32} />
              <p style={{ marginTop: 16 }}>Nenhum snapshot ainda. Gere um Teaser ou Book em <strong>/generate</strong>.</p>
            </div>
          ) : (
            snaps.map((s, i) => {
              const prev = snaps.slice(i + 1).find((p) => p.kind === s.kind);
              const arr = s.oxy_payload.arr_brl;
              const delta = prev ? arr - prev.oxy_payload.arr_brl : 0;
              return (
                <div key={s.id} className="snap">
                  <div className="snap-meta">
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="pill">{s.kind === 'teaser' ? 'Teaser' : 'Book'}</span>
                      <strong style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 18 }}>{brl(arr, { compact: true })} ARR</strong>
                      {prev && delta !== 0 && (
                        <span className="mono" style={{ fontSize: 11, color: delta > 0 ? 'var(--accent)' : '#FF6B6B' }}>
                          {pct((delta / prev.oxy_payload.arr_brl) * 100, true)} vs anterior
                        </span>
                      )}
                    </span>
                    <span className="snap-when">{whenLabel(s.created_at)} · gatilho {s.trigger} · contrato v{s.meta.contract_version}</span>
                  </div>
                  <div className="snap-actions">
                    <ClientOnly fallback={<span className="mono" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>…</span>}>
                      <Suspense fallback={<span className="mono" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>…</span>}>
                        <PdfClient variant="download" snap={s} fileName={`O2-${s.kind}-${s.created_at.slice(0, 10)}.pdf`} />
                      </Suspense>
                    </ClientOnly>
                    <button className="icon-btn" onClick={() => remove(s.id)} aria-label="Excluir snapshot"><Icon.Close size={16} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
