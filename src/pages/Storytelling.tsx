import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icons';
import { getStory, saveStory, resetStory } from '../domain/dataSource';
import type { StorySection } from '../domain/schemas';

export function Storytelling() {
  const [sections, setSections] = useState<StorySection[] | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getStory().then((s) => setSections(s.sections)); }, []);

  if (!sections) {
    return <div className="container-wide" style={{ padding: '120px 0', color: 'var(--fg-subtle)' }}>Carregando…</div>;
  }

  function update(idx: number, patch: Partial<StorySection>) {
    setSections((prev) => prev!.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
    setSaved(false);
  }

  async function handleSave() {
    await saveStory({ sections: sections! });
    setSaved(true);
  }

  async function handleReset() {
    resetStory();
    const s = await getStory();
    setSections(s.sections);
    setSaved(false);
  }

  return (
    <>
      <header className="page-head">
        <div className="container-wide">
          <div className="crumbs"><span>O2 Pitch Engine</span><span className="sep">/</span><span>02 Storytelling</span></div>
          <Eyebrow accent>F3 · Narrativa editável</Eyebrow>
          <h1>Storytelling</h1>
          <p className="lede">
            A narrativa que entra no Teaser e no Book. Edite em markdown; a variante define onde a seção
            aparece. As alterações ficam salvas localmente e são congeladas em cada snapshot gerado.
          </p>
        </div>
      </header>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="container-wide">
          {sections.map((sec, idx) => (
            <div key={sec.slug} className="card" style={{ marginBottom: 20 }}>
              <div className="editor-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div className="field" style={{ flex: 1 }}>
                      <label>Título</label>
                      <input className="input" value={sec.title} onChange={(e) => update(idx, { title: e.target.value })} />
                    </div>
                    <div className="field" style={{ width: 140 }}>
                      <label>Variante</label>
                      <select className="select" value={sec.variant}
                        onChange={(e) => update(idx, { variant: e.target.value as StorySection['variant'] })}>
                        <option value="teaser">Teaser</option>
                        <option value="book">Book</option>
                        <option value="both">Ambos</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Corpo (markdown) · <span className="mono">{sec.slug}</span></label>
                    <textarea className="textarea" value={sec.body_md} rows={5}
                      onChange={(e) => update(idx, { body_md: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Preview</label>
                  <div className="card md-preview" style={{ background: 'var(--bg-elev-2)' }}>
                    <h3>{sec.title}</h3>
                    <Markdown remarkPlugins={[remarkGfm]}>{sec.body_md}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="save-bar">
            <span className="saved">{saved ? '✓ Salvo localmente' : 'Alterações não salvas'}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>Restaurar padrão</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
                <Icon.Check size={14} /> Salvar narrativa
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
