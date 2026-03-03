import React, { useState } from "react";

const SESSION_KEY = "midlej_dash_auth_ok";

export default function DashboardComercial() {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(sessionStorage.getItem(SESSION_KEY) === "1");

  const DASH_PASS = import.meta.env.VITE_DASH_PASSWORD || "";

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
  }

  if (!ok) {
    return (
      <div style={{ minHeight:"100vh", display:"grid", placeItems:"center", padding:24, background:"#0C0C0E", color:"#F0EDE8" }}>
        <form onSubmit={submit} style={{ width:"min(420px,100%)", background:"#111114", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:24 }}>
          <div style={{ fontWeight:800, marginBottom:8 }}>Acesso restrito</div>
          <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Senha"
            style={{ width:"100%", padding:"12px 14px", borderRadius:6, background:"#18181C", border:"1px solid rgba(255,255,255,0.10)", color:"#F0EDE8", outline:"none", marginBottom:12 }} />
          <button type="submit" style={{ width:"100%", padding:"12px 14px", borderRadius:6, background:"rgba(214,168,91,0.12)", border:"1px solid rgba(214,168,91,0.25)", color:"#EBC97E", fontWeight:800, textTransform:"uppercase", cursor:"pointer" }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0C0C0E", color:"#F0EDE8", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
        <div style={{ opacity:0.7 }}>MIDLEJ · Dashboard (protegido)</div>
        <button onClick={logout} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.12)", color:"#F0EDE8", padding:"6px 10px", borderRadius:6, cursor:"pointer" }}>
          Sair
        </button>
      </div>

      <iframe
        title="Dashboard Comercial"
        style={{ flex: 1, border: "none", width: "100%" }}
        src="/dashboards/midlej"
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    </div>
  );
}
