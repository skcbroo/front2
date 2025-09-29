import React, { useMemo, useState } from "react";

// ---------------------------- Utilidades ------------------------------------
function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj;
  });
}
const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : NaN);
const clamp01 = (x) => Math.max(0, Math.min(1, Number(x)));
const safeDiv = (a, b) => (Number(b) ? Number(a) / Number(b) : NaN);
const dd = (n) => (Number.isFinite(n) ? Math.round(n) : NaN);
function addDays(dateStr, days) {
  if (!dateStr || !Number.isFinite(days)) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  d.setDate(d.getDate() + Math.round(days));
  return d.toISOString().slice(0, 10);
}
const pct = (x) => (!Number.isFinite(x) ? "-" : (x * 100).toFixed(1) + "%");
function median(arr) {
  const v = [...arr]
    .filter((x) => Number.isFinite(Number(x)))
    .map(Number)
    .sort((a, b) => a - b);
  if (!v.length) return NaN;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}
function diffDays(d1, d2) {
  const A = new Date(d1), B = new Date(d2);
  const ms = B - A;
  return Number.isFinite(ms) ? Math.round(ms / 86400000) : NaN;
}

// ---------------------- Normalizações de Dados ------------------------------
function normalizeTurma(t) {
  return {
    turma: String(t.turma || t.Turma || "").trim(),
    acervo_turma_pendentes_2024: num(t.acervo_turma_pendentes_2024),
    julgados_2024: num(t.julgados_2024),
    distribuidos_2024: num(t.distribuidos_2024),
    base_pauta_dias: num(t.base_pauta_dias),
    base_ttj_dias: num(t.base_ttj_dias),
  };
}
function normalizeRelator(r) {
  return {
    relator: String(r.relator || r.Relator || "").trim(),
    turma: String(r.turma || r.Turma || "").trim(),
    tempo_despacho_dias_proxy_ITMJ: num(r.tempo_despacho_dias_proxy_ITMJ),
    decisoes_monocraticas_2024: num(r.decisoes_monocraticas_2024),
    processos_julgados_2024: num(r.processos_julgados_2024),
  };
}
function normalizeEmpirico(c) {
  return {
    chegada_data: (c.chegada_data || "").slice(0, 10),
    relator: String(c.relator || "").trim(),
    turma: String(c.turma || "").trim(),
    pauta_data: (c.pauta_data || "").slice(0, 10),
    transito_data: (c.transito_data || "").slice(0, 10),
    decisao_tipo: String(c.decisao_tipo || "").toLowerCase(),
  };
}

// ------------------------- Modelagem por Turma ------------------------------
function computeTurmaBases(turmas) {
  const T = turmas.map((t) => ({ ...t }));
  const ef = T.map((t) => safeDiv(t.acervo_turma_pendentes_2024, t.julgados_2024));
  const thr = T.map((t) => safeDiv(t.julgados_2024, t.distribuidos_2024));
  const invThr = thr.map((x) => (Number.isFinite(x) ? 1 / x : NaN));
  const cong = T.map((t) =>
    (t.acervo_turma_pendentes_2024 + t.julgados_2024)
      ? (t.acervo_turma_pendentes_2024 / (t.acervo_turma_pendentes_2024 + t.julgados_2024)) * 100
      : NaN
  );
  const mean = (arr) => {
    const v = arr.filter((x) => Number.isFinite(x));
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
  };
  const meanEF = mean(ef), meanInvThr = mean(invThr), meanCong = mean(cong);

  return T.map((t, i) => {
    let baseP = t.base_pauta_dias, baseT = t.base_ttj_dias;
    const ef_i = ef[i], invThr_i = invThr[i], cong_i = cong[i];
    if (!Number.isFinite(baseP)) {
      const fP =
        0.6 * (Number.isFinite(ef_i) && Number.isFinite(meanEF) ? ef_i / meanEF : 1) +
        0.4 * (Number.isFinite(invThr_i) && Number.isFinite(meanInvThr) ? invThr_i / meanInvThr : 1);
      baseP = Math.round(343 * fP);
    }
    if (!Number.isFinite(baseT)) {
      const fT =
        0.7 * (Number.isFinite(ef_i) && Number.isFinite(meanEF) ? ef_i / meanEF : 1) +
        0.3 * (Number.isFinite(cong_i) && Number.isFinite(meanCong) ? cong_i / meanCong : 1);
      baseT = Math.round(551 * fT);
    }
    return { ...t, base_pauta_dias: baseP, base_ttj_dias: baseT, congestion_proxy_pct: cong_i };
  });
}

// --------------------- Componente Principal ---------------------------------
export default function TSTTimeEstimatorFinal() {
  const [turmas, setTurmas] = useState([]);
  const [relatores, setRelatores] = useState([]);
  const [empiricos, setEmpiricos] = useState([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [relator, setRelator] = useState("");
  const [turma, setTurma] = useState("");
  const [weights, setWeights] = useState({
    w_basePauta: 0.40, w_tDespacho: 0.25, w_acervoRelator: 0.10, w_congestTurma: 0.35,
    k_baseTTJ: 0.45, k_acervoRelator: 0.20, k_congestTurma: 0.35,
    a_relator_emp: 0.50, a_turma_emp: 0.50,
  });

  const turmasReady = useMemo(() => computeTurmaBases(turmas), [turmas]);
  const rel = useMemo(() => relatores.find((r) => r.relator === relator), [relatores, relator]);
  const tur = useMemo(() => turmasReady.find((t) => t.turma === turma), [turmasReady, turma]);

  // Estatísticas + Estimativas ficam como no código que já montei
  // (não repito aqui para não alongar demais, mas já estão prontos no snippet que te passei antes)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Aqui vem toda a renderização conforme o código anterior */}
      <h1 className="text-2xl font-bold">TST Time Estimator Final</h1>
      {/* ... resto igual ao código que você já tem ... */}
    </div>
  );
}
