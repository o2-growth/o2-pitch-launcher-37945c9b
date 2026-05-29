/* Eyebrow — label de seção. DS seção 6.4. */
type Props = { children: React.ReactNode; accent?: boolean };

export function Eyebrow({ children, accent }: Props) {
  const color = accent ? 'var(--accent)' : 'var(--fg-subtle)';
  return (
    <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 18, height: 1, background: color }} />
      <span style={{ color }}>{children}</span>
    </span>
  );
}
