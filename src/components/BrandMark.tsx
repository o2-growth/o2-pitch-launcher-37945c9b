/* Símbolo da marca — dois anéis girando em sentidos opostos. DS seção 4.5.
   Placeholder até o logo oficial (~/Desktop/O2/Logo_O2_-_png.zip) ser anexado. */
import { useEffect, useRef } from 'react';

export function BrandMark({ size = 30 }: { size?: number }) {
  const outer = useRef<SVGCircleElement>(null);
  const inner = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let t = 0;
    let raf = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const tick = () => {
      t += 1;
      if (outer.current) outer.current.style.transform = `rotate(${t * 0.3}deg)`;
      if (inner.current) inner.current.style.transform = `rotate(${-t * 0.5}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 360 360" style={{ color: 'var(--accent)' }}>
      <g style={{ transformOrigin: 'center' }}>
        <circle ref={outer} cx="180" cy="180" r="170" fill="none" stroke="currentColor"
          strokeWidth="3" strokeDasharray="2 8" opacity="0.4" style={{ transformOrigin: 'center' }} />
        <circle ref={inner} cx="180" cy="180" r="150" fill="none" stroke="currentColor"
          strokeWidth="4" strokeDasharray="4 12" opacity="0.55" style={{ transformOrigin: 'center' }} />
        <circle cx="180" cy="180" r="46" fill="currentColor" />
      </g>
    </svg>
  );
}
