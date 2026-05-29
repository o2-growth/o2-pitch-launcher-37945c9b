/* ===========================================================================
   O2 Pitch Engine — Tokens do PDF (espelho de styles/tokens.css)
   React-PDF não entende CSS vars; estes valores precisam bater com tokens.css.
   Se o DS mudar, atualizar aqui também (futuro: gerar via script de build).
   =========================================================================== */
import { Font } from '@react-pdf/renderer';

export const o2 = {
  // Cores (dark mode — identidade O2)
  bg: '#3A3A3A',
  bgElev: '#2E2E2E',
  bgElev2: '#252525',
  border: '#4A4A4A',
  borderStrong: '#5A5A5A',
  fg: '#FAFAFA',
  fgMuted: '#C4C4C4',
  fgSubtle: '#9A9A9A',
  accent: '#63F161',     // Lima 400 — só sobre fundo escuro
  accentInk: '#0A0A0A',
  accentSoft: 'rgba(99, 241, 97, 0.14)',
  danger: '#FF6B6B',

  // Fontes (nomes registrados abaixo)
  fontDisplay: 'O2Display',
  fontBody: 'O2Body',
  fontMono: 'O2Mono',

  radius: 10,
  radiusLg: 16,
} as const;

let registered = false;

/** Registra as fontes a partir de /public/fonts/pdf (WOFF). Idempotente. */
export function registerO2Fonts() {
  if (registered) return;
  registered = true;

  // Display — Anton (fallback documentado da Tusker Grotesk)
  Font.register({
    family: o2.fontDisplay,
    fonts: [{ src: '/fonts/pdf/anton-400.woff', fontWeight: 400 }],
  });

  // Body — Montserrat
  Font.register({
    family: o2.fontBody,
    fonts: [
      { src: '/fonts/pdf/montserrat-400.woff', fontWeight: 400 },
      { src: '/fonts/pdf/montserrat-600.woff', fontWeight: 600 },
      { src: '/fonts/pdf/montserrat-700.woff', fontWeight: 700 },
    ],
  });

  // Mono — JetBrains Mono
  Font.register({
    family: o2.fontMono,
    fonts: [
      { src: '/fonts/pdf/jetbrains-mono-400.woff', fontWeight: 400 },
      { src: '/fonts/pdf/jetbrains-mono-500.woff', fontWeight: 500 },
    ],
  });

  // Evita quebras estranhas em palavras com hífen
  Font.registerHyphenationCallback((word) => [word]);
}
