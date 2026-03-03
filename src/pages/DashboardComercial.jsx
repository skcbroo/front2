import React, { useEffect, useState } from "react";

const SESSION_KEY = "midlej_dash_auth_ok";

export default function DashboardComercial() {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(sessionStorage.getItem(SESSION_KEY) === "1");
  const [html, setHtml] = useState("");

  const DASH_PASS = import.meta.env.VITE_DASH_PASSWORD || "";

  useEffect(() => {
    if (!ok) return;

    let alive = true;

    (async () => {
      const res = await fetch("/dashboards/midlej", { cache: "no-store", redirect: "follow" });
      const raw = await res.text();

      // injeta token no iframe
      const token = localStorage.getItem("token") || "";
      const injected = raw.replace(
        "</head>",
        `<script>window.__AUTH_TOKEN__ = ${JSON.stringify(token)};</script></head>`
      );

      if (alive) setHtml(injected);
    })();

    return () => { alive = false; };
  }, [ok]);

  function submit(e) {
    e.preventDefault();
    if (!DASH_PASS) return alert("Defina VITE_DASH_PASSWORD no Railway.");

    if (pass === DASH_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setOk(true);
      setPass("");
      return;
    }
    alert("Senha incorreta.");
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setOk(false);
    setHtml("");
  }

  if (!ok) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#0C0C0E",
        color: "#F0EDE8",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}>
        <form onSubmit={submit} style={{
          width: "min(420px, 100%)",
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: 24,
        }}>
          <div style={{ fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
            Acesso restrito
          </div>
          <div style={{ opacity: 0.7, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
            Digite a senha para abrir o Dashboard Comercial.
          </div>

          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Senha"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 6,
              background: "#18181C",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#F0EDE8",
              outline: "none",
              marginBottom: 12,
            }}
          />

          <button type="submit" style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 6,
            background: "rgba(214,168,91,0.12)",
            border: "1px solid rgba(214,168,91,0.25)",
            color: "#EBC97E",
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#0C0C0E",
        color: "#F0EDE8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
      }}>
        <div style={{ opacity: 0.7 }}>MIDLEJ · Dashboard (protegido)</div>
        <button onClick={logout} style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#F0EDE8",
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
        }}>
          Sair
        </button>
      </div>

      <iframe
        title="Dashboard Comercial"
        style={{ flex: 1, border: "none", width: "100%" }}
        srcDoc={html}
        sandbox="allow-scripts allow-forms allow-same-origin allow-storage-access-by-user-activation"
      />
    </div>
  );
}
