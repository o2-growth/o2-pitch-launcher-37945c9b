/* ===========================================================================
   Ponte client-only para @react-pdf. Carregado via React.lazy dentro de
   <ClientOnly>, então este módulo (e o @react-pdf) NUNCA é importado no SSR.
   =========================================================================== */
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
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
};

export default function PdfClient({ variant, src, kind, snap, fileName }: PdfClientProps) {
  const doc = snap ? docFromSnapshot(snap) : src && kind ? docFromSources(src, kind) : null;
  if (!doc) return null;

  if (variant === 'preview') {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '82vh' }}>
        <PDFViewer width="100%" height="100%" showToolbar style={{ border: 'none' }}>{doc}</PDFViewer>
      </div>
    );
  }

  return (
    <PDFDownloadLink document={doc} fileName={fileName} className="btn btn-ghost btn-sm">
      {({ loading }) => (<><Icon.Download size={14} /> {loading ? '…' : 'PDF'}</>)}
    </PDFDownloadLink>
  );
}
