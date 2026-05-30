/* ===========================================================================
   Ponte client-only para @react-pdf. Carregado via React.lazy dentro de
   <ClientOnly>, então este módulo (e o @react-pdf) NUNCA é importado no SSR.

   Estratégia: geramos o Blob com pdf(doc).toBlob() e usamos <iframe src={blobUrl}>
   para o preview. PDFViewer/<embed> do Chromium são instáveis dentro do iframe
   do Lovable e às vezes só renderizam o botão "Open" em vez do PDF.
   =========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { TeaserTemplate } from './TeaserTemplate';
import { BookTemplate } from './BookTemplate';
import { Icon } from '../components/Icons';
import type { OxyKpiPayload, BpProjectionPayload, StoryPayload, DeckConfig, DeckSnapshot } from '../domain/schemas';

type Sources = { oxy: OxyKpiPayload; bp: BpProjectionPayload; story: StoryPayload; config: DeckConfig };
type Kind = 'teaser' | 'book';

function docFromSources(src: Sources, kind: Kind) {
  return kind === 'teaser' ? <TeaserTemplate {...src} /> : <BookTemplate {...src} />;
}
function docFromSnapshot(s: DeckSnapshot) {
  const props = { oxy: s.oxy_payload, bp: s.bp_payload, story: s.story_payload, config: s.config_payload };
  return s.kind === 'teaser' ? <TeaserTemplate {...props} /> : <BookTemplate {...props} />;
}

export type PdfClientProps = {
  variant: 'preview' | 'download';
  src?: Sources;
  kind?: Kind;
  snap?: DeckSnapshot;
  fileName: string;
  /** Quando true, dispara o download automaticamente assim que o blob ficar pronto. */
  autoDownload?: boolean;
};

/** Gera (e regenera) o blob do PDF sempre que os inputs mudarem. */
function useBlobUrl(src: Sources | undefined, kind: Kind | undefined, snap: DeckSnapshot | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Identidade estável: pra snapshot usa id; pra geração ao vivo usa kind+as_of.
  const key = snap ? `snap:${snap.id}` : src && kind ? `live:${kind}:${src.oxy.as_of}` : 'none';

  useEffect(() => {
    let cancelled = false;
    let currentUrl: string | null = null;
    setUrl(null);
    setErr(null);

    const doc = snap ? docFromSnapshot(snap) : src && kind ? docFromSources(src, kind) : null;
    if (!doc) return;

    pdf(doc)
      .toBlob()
      .then((blob) => {
        if (cancelled) return;
        currentUrl = URL.createObjectURL(blob);
        setUrl(currentUrl);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error('[PdfClient] toBlob failed', e);
        setErr(String(e?.message ?? e));
      });

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { url, err };
}

export default function PdfClient({ variant, src, kind, snap, fileName, autoDownload }: PdfClientProps) {
  const { url, err } = useBlobUrl(src, kind, snap);
  const triggeredRef = useRef<string | null>(null);

  // Auto-download: dispara um clique sintético assim que o blob estiver pronto.
  useEffect(() => {
    if (!autoDownload || !url) return;
    if (triggeredRef.current === url) return;
    triggeredRef.current = url;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [autoDownload, url, fileName]);

  if (variant === 'preview') {
    return (
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          height: '82vh',
          background: 'var(--bg-elev)',
        }}
      >
        {err ? (
          <div style={{ padding: 32, color: '#FF6B6B' }}>Falha ao gerar PDF: {err}</div>
        ) : url ? (
          <iframe
            src={url}
            title={fileName}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
          />
        ) : (
          <div style={{ padding: 32, color: 'var(--fg-subtle)' }}>Renderizando PDF…</div>
        )}
      </div>
    );
  }

  // variant === 'download'
  if (err) {
    return <span className="mono" style={{ fontSize: 11, color: '#FF6B6B' }}>erro</span>;
  }
  if (!url) {
    return (
      <span className="btn btn-ghost btn-sm" aria-disabled>
        <Icon.Download size={14} /> …
      </span>
    );
  }
  return (
    <a href={url} download={fileName} className="btn btn-ghost btn-sm">
      <Icon.Download size={14} /> PDF
    </a>
  );
}
