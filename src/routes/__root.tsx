import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import o2Css from "../styles/o2-ds.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icons";
import { useTheme } from "../hooks/useTheme";
import { AuthGate } from "../components/AuthGate";
import { ClientOnly } from "../components/ClientOnly";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "O2 Pitch Deck" },
      { name: "description", content: "Teaser e Book auto-atualizados de Oxy + BP + Storytelling." },
      { property: "og:title", content: "O2 Pitch Deck" },
      { name: "twitter:title", content: "O2 Pitch Deck" },
      { property: "og:description", content: "Teaser e Book auto-atualizados de Oxy + BP + Storytelling." },
      { name: "twitter:description", content: "Teaser e Book auto-atualizados de Oxy + BP + Storytelling." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3712d046-80ce-4ec6-b53e-754641ec0f72/id-preview-559c4b2b--fd9ab30d-43ce-4192-abae-c7ea5a2aae0d.lovable.app-1780107218895.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3712d046-80ce-4ec6-b53e-754641ec0f72/id-preview-559c4b2b--fd9ab30d-43ce-4192-abae-c7ea5a2aae0d.lovable.app-1780107218895.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: o2Css },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/storytelling", label: "Storytelling" },
  { to: "/deck-config", label: "Configuração" },
  { to: "/generate", label: "Gerar" },
  { to: "/versions", label: "Versões" },
];

function Chrome() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><BrandMark size={30} /></span>
            <span className="brand-sep" />
            <span className="brand-name">O2 Pitch Engine</span>
          </Link>
          <nav className="nav-desktop">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeProps={{ className: "active" }}
                activeOptions={n.exact ? { exact: true } : undefined}>
                <span className="dot" />{n.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={toggleTheme}
              aria-label={`Trocar para tema ${theme === "dark" ? "claro" : "escuro"}`}>
              {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => supabase.auth.signOut()}
              aria-label="Sair"
              title="Sair"
              style={{ marginLeft: 8, fontSize: 12, padding: "0 10px" }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="meta">
          <span>O2 Inc. · Pitch Engine · MVP</span>
          <span>Confidencial · Dados mock</span>
        </div>
      </footer>
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ClientOnly fallback={<div style={{ minHeight: "100vh" }} />}>
        <AuthGate>
          <Chrome />
        </AuthGate>
      </ClientOnly>
    </QueryClientProvider>
  );
}
