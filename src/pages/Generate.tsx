import { Suspense, lazy, useEffect, useState } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icons';
import { ClientOnly } from '../components/ClientOnly';
import { loadAllSources } from '../domain/dataSource';
import { createSnapshot } from '../domain/snapshots';
import type { OxyKpiPayload, BpProjectionPayload, StoryPayload, DeckConfig } from '../domain/schemas';
import { monthLabel } from '../lib/format';

const PdfClient = lazy(() => import('../pdf/PdfClient'));

type Sources = { oxy: OxyKpiPayload; bp: BpProjectionPayload; story: StoryPayload; config: DeckConfig };
type Kind = 'teaser' | 'book';

export function Generate() {
  const [src, setSrc] = useState<Sources | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const [downloadTick, setDownloadTick] = useState(0);
  const [archived, setArchived] = useState('');

  useEffect(() => { loadAllSources().then(setSrc); }, []);

  if (!src) {
    return <div className="container-wide" style={{ padding: '120px 0', color: 'var(--fg-subtle)' }}>Carregando fontes…</div>;
  }

  async function generate(k: Kind) {
    setKind(k);
    setDownloadTick((t) => t + 1);
    try {
      const snap = await createSnapshot(k, 'manual', src!);
      setArchived(`Snapshot ${k} arquivado · ${new Date(snap.created_at).toLocaleTimeString('pt-BR')}`);
    } catch (e) {
      setArchived(`Falha ao arquivar snapshot: ${String(e)}`);
    }
  }

  const period = src.oxy.as_of.slice(0, 7);
  const fileName = `O2-${kind ?? 'deck'}-${period}.pdf`;

  return (
    <>
      <header className="page-head">
        <div className="container-wide">
          <div className="crumbs"><span>O2 Pitch Engine</span><span className="sep">/</span><span>04 Gerar</span></div>
          <Eyebrow accent>F4–F5 · Geração de PDF</Eyebrow>
          <h1>Gerar deck</h1>
          <p className="lede">
            Casa Oxy ({monthLabel(period)}) + BP + storytelling e renderiza o PDF com a identidade O2.
            Cada geração arquiva um snapshot em Versões.
          </p>
          <div className="page-head-action">
            <button type="button" className={`btn ${kind === 'teaser' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => generate('teaser')}>
              <Icon.Pdf size={16} /> Gerar Teaser
            </button>
            <button type="button" className={`btn ${kind === 'book' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => generate('book')}>
              <Icon.Pdf size={16} /> Gerar Book
            </button>
            {kind && (
              <ClientOnly>
                <Suspense fallback={<span className="mono" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>preparando…</span>}>
                  <PdfClient
                    key={`${kind}-${downloadTick}`}
                    variant="download"
                    src={src}
                    kind={kind}
                    fileName={fileName}
                    autoDownload
                  />
                </Suspense>
              </ClientOnly>
            )}
          </div>
          {archived && <p className="mono" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{archived}</p>}
        </div>
      </header>

      <section className="block" style={{ paddingTop: 32 }}>
        <div className="container-wide">
          {kind ? (
            <ClientOnly fallback={<div className="card" style={{ padding: 48, color: 'var(--fg-subtle)' }}>Renderizando preview…</div>}>
              <Suspense fallback={<div className="card" style={{ padding: 48, color: 'var(--fg-subtle)' }}>Renderizando preview…</div>}>
                <PdfClient variant="preview" src={src} kind={kind} fileName={fileName} />
              </Suspense>
            </ClientOnly>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '64px 28px', color: 'var(--fg-muted)' }}>
              <Icon.Pdf size={32} />
              <p style={{ marginTop: 16 }}>Escolha <strong>Gerar Teaser</strong> (1 página) ou <strong>Gerar Book</strong> (deck completo) para o preview ao vivo.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
