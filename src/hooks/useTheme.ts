import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/** SSR-safe: começa em 'dark' (default O2) e lê a preferência no cliente após montar. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('o2-theme') : null) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    if (typeof localStorage !== 'undefined') localStorage.setItem('o2-theme', theme);
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}
