import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--ds-fg-muted, #888)" }}>
        Carregando…
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "var(--ds-bg, #0a0a0a)" }}>
        <form
          onSubmit={onSubmit}
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "28px 26px",
            border: "1px solid var(--ds-border, #2a2a2a)",
            borderRadius: 14,
            background: "var(--ds-surface, #111)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6 }}>
            <strong style={{ fontSize: 18, color: "var(--ds-fg, #fff)" }}>O2 Pitch Engine</strong>
            <span style={{ fontSize: 13, color: "var(--ds-fg-muted, #999)" }}>Acesso restrito ao owner</span>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--ds-fg-muted, #aaa)" }}>
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--ds-fg-muted, #aaa)" }}>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>
          {error ? (
            <div style={{ fontSize: 12, color: "#ff6b6b" }}>{error}</div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid var(--ds-fg, #fff)",
              background: "var(--ds-fg, #fff)",
              color: "var(--ds-bg, #000)",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--ds-border, #2a2a2a)",
  background: "var(--ds-bg, #0a0a0a)",
  color: "var(--ds-fg, #fff)",
  fontSize: 14,
  outline: "none",
};