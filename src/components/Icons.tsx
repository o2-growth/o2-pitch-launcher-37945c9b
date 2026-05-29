/* Set oficial de ícones O2 (SVG inline, sem libs pesadas). DS seção 7. */
type IconProps = { size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Icon = {
  Menu: ({ size }: IconProps) => (
    <svg {...base(size)}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  Close: ({ size }: IconProps) => (
    <svg {...base(size)}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
  ),
  Download: ({ size }: IconProps) => (
    <svg {...base(size)}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
  ),
  Arrow: ({ size }: IconProps) => (
    <svg {...base(size)}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
  ),
  ArrowUp: ({ size }: IconProps) => (
    <svg {...base(size)}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="6 11 12 5 18 11" /></svg>
  ),
  Pdf: ({ size }: IconProps) => (
    <svg {...base(size)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><polyline points="14 3 14 8 19 8" /></svg>
  ),
  Sparkle: ({ size }: IconProps) => (
    <svg {...base(size)}><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></svg>
  ),
  Check: ({ size }: IconProps) => (
    <svg {...base(size)}><polyline points="4 12 10 18 20 6" /></svg>
  ),
  Sun: ({ size }: IconProps) => (
    <svg {...base(size)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
  ),
  Moon: ({ size }: IconProps) => (
    <svg {...base(size)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
  ),
};
