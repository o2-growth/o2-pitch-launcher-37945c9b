/* Utilitários de formatação BRL / percentuais / abreviações. */

export function brl(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1).replace('.', ',')} bi`;
    if (abs >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')} mi`;
    if (abs >= 1_000) return `R$ ${(value / 1_000).toFixed(0)} mil`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function pct(value: number, withSign = false): string {
  const sign = withSign && value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

export function num(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

export function monthLabel(period: string): string {
  // 'YYYY-MM' -> 'mmm/aa'
  const [y, m] = period.split('-');
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${meses[Number(m) - 1]}/${y.slice(2)}`;
}
