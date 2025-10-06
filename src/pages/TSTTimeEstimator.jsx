import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
/**
 * TST Time Estimator – Versão Final (Single File)
 * -----------------------------------------------------------------------------
 * Funcionalidades:
 * - Upload CSV (Turmas, Relatores, Empíricos) e Import/Export de Bundle .json.
 * - Estimativas: (a) tempo até pauta, (b) tempo até trânsito, (c) prob. monocrática.
 * - Bases por Turma: usa campos existentes; se ausentes, modela com KPIs por Turma.
 * - Offsets empíricos por Relator/Turma quando existirem casos reais (empiricos.csv).
 *
 * Esquemas esperados (cabeçalhos):
 * turmas.csv
 *   turma,acervo_turma_pendentes_2024,julgados_2024,distribuidos_2024,base_pauta_dias?,base_ttj_dias?
 *
 * relatores.csv
 *   relator,turma,tempo_despacho_dias_proxy_ITMJ?,decisoes_monocraticas_2024?,processos_julgados_2024?
 *
 * empiricos.csv
 *   chegada_data,relator,turma,pauta_data,transito_data,decisao_tipo
 *
 * -----------------------------------------------------------------------------
 * Aviso: Estimativas estatísticas; não constituem garantia de prazos nem aconselhamento jurídico.
 */

// ---------------------------- Utilidades ------------------------------------
function parseCSV(text) {
  // Parser simples CSV com vírgula como separador. Para casos complexos, usar PapaParse.
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
const num = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
};
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
  const A = new Date(d1),
    B = new Date(d2);
  const ms = B - A;
  return Number.isFinite(ms) ? Math.round(ms / 86400000) : NaN;
}

// ---------------------- Normalizações de Dados ------------------------------
function normalizeTurma(t) {
  return {
    turma: String(t.turma || t.Turma || "").trim(),
    acervo_turma_pendentes_2024: num(t.acervo_turma_pendentes_2024 ?? t.pendentes ?? t.Pendentes),
    julgados_2024: num(t.julgados_2024 ?? t.julgados ?? t.Julgados),
    distribuidos_2024: num(t.distribuidos_2024 ?? t.distribuidos ?? t.Distribuidos),
    base_pauta_dias: num(t.base_pauta_dias),
    base_ttj_dias: num(t.base_ttj_dias),
  };
}
function normalizeRelator(r) {
  return {
    relator: String(r.relator || r.Relator || "").trim(),
    turma: String(r.turma || r.Turma || "").trim(),
    tempo_despacho_dias_proxy_ITMJ: num(r.tempo_despacho_dias_proxy_ITMJ ?? r.tempoDespachoDias),
    // Dados para mono_rate:
    decisoes_monocraticas_2024: num(r.decisoes_monocraticas_2024),
    processos_julgados_2024: num(r.processos_julgados_2024),
  };
}
function normalizeEmpirico(c) {
  return {
    chegada_data: (c.chegada_data || c.chegada || c.arrival || "").slice(0, 10),
    relator: String(c.relator || c.Relator || "").trim(),
    turma: String(c.turma || c.Turma || "").trim(),
    pauta_data: (c.pauta_data || c.data_pauta || "").slice(0, 10),
    transito_data: (c.transito_data || c.data_transito || "").slice(0, 10),
    decisao_tipo: String(c.decisao_tipo || c.decisao || "").toLowerCase(),
  };
}

// ------------------------- Modelagem por Turma ------------------------------
/**
 * Se a Turma NÃO trouxer base_pauta_dias/base_ttj_dias:
 *  - calcula KPIs e gera bases modeladas por Turma conforme fórmula acordada:
 *    base_pauta_dias = 343 * [0.6 * (estoque/fluxo) + 0.4 * (1/throughput)]
 *    base_ttj_dias   = 551 * [0.7 * (estoque/fluxo) + 0.3 * congestion_proxy]
 *  Onde:
 *    estoque/fluxo = pendentes / julgados
 *    throughput    = julgados / distribuidos
 *    congestion_proxy = pendentes / (pendentes + julgados)
 *  As razões são normalizadas pela média entre Turmas para comparabilidade.
 */
function computeTurmaBases(turmas) {
  // Deep copy
  const T = turmas.map((t) => ({ ...t }));
  const ef = T.map((t) => safeDiv(t.acervo_turma_pendentes_2024, t.julgados_2024)); // estoque/fluxo
  const thr = T.map((t) => safeDiv(t.julgados_2024, t.distribuidos_2024)); // throughput
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

  const meanEF = mean(ef);
  const meanInvThr = mean(invThr);
  const meanCong = mean(cong);

  return T.map((t, i) => {
    // Se já existem bases, respeita-as
    let baseP = t.base_pauta_dias;
    let baseT = t.base_ttj_dias;

    const ef_i = ef[i];
    const invThr_i = invThr[i];
    const cong_i = cong[i];

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
    return {
      ...t,
      base_pauta_dias: baseP,
      base_ttj_dias: baseT,
      // KPIs úteis para auditoria:
      estoque_sobre_fluxo: ef_i,
      throughput_julgados_sobre_distribuidos: thr[i],
      congestion_proxy_pct: cong_i,
    };
  });
}

// --------------------- Componente Principal ---------------------------------
export default function TSTTimeEstimatorFinal() {
  // Estados dos dados
  const [turmas, setTurmas] = useState([]);
  const [relatores, setRelatores] = useState([]);
  const [empiricos, setEmpiricos] = useState([]);

  // Inputs do caso
  const [arrivalDate, setArrivalDate] = useState("");
  const [relator, setRelator] = useState("");
  const [turma, setTurma] = useState("");

  // Pesos do modelo
  const [weights, setWeights] = useState({
    w_basePauta: 0.40,
    w_tDespacho: 0.25,
    w_acervoRelator: 0.10,
    w_congestTurma: 0.35,
    k_baseTTJ: 0.45,
    k_acervoRelator: 0.20,
    k_congestTurma: 0.35,
    a_relator_emp: 0.50,
    a_turma_emp: 0.50,
  });

  // Turmas com bases finais (usa existentes ou modela)
  const turmasReady = useMemo(() => computeTurmaBases(turmas), [turmas]);

  const rel = useMemo(
    () => relatores.find((r) => r.relator === relator),
    [relatores, relator]
  );
  const tur = useMemo(
    () => turmasReady.find((t) => t.turma === turma),
    [turmasReady, turma]
  );

  // Estatísticas globais para normalização/explicação
  const stats = useMemo(() => {
    const mAcRel = median(relatores.map((r) => r.acervo_relator_conclusos_2024));
    const mDesp = median(
      relatores.map((r) =>
        Number.isFinite(r.tempo_despacho_dias_proxy_ITMJ)
          ? r.tempo_despacho_dias_proxy_ITMJ
          : NaN
      )
    );
    const mCong = median(turmasReady.map((t) => t.congestion_proxy_pct));
    const mBaseP = median(turmasReady.map((t) => t.base_pauta_dias));
    const mBaseT = median(turmasReady.map((t) => t.base_ttj_dias));

    // Offsets empíricos por relator e turma (médias observadas)
    const empByRel = {};
    const empByTur = {};
    empiricos.forEach((c) => {
      const ch = c.chegada_data;
      if (!ch) return;
      const pautaObs = c.pauta_data ? diffDays(ch, c.pauta_data) : null;
      const transObs = c.transito_data ? diffDays(ch, c.transito_data) : null;
      if (!empByRel[c.relator]) empByRel[c.relator] = { nP: 0, sP: 0, nT: 0, sT: 0 };
      if (!empByTur[c.turma]) empByTur[c.turma] = { nP: 0, sP: 0, nT: 0, sT: 0 };
      if (Number.isFinite(pautaObs)) {
        empByRel[c.relator].nP++; empByRel[c.relator].sP += pautaObs;
        empByTur[c.turma].nP++;   empByTur[c.turma].sP   += pautaObs;
      }
      if (Number.isFinite(transObs)) {
        empByRel[c.relator].nT++; empByRel[c.relator].sT += transObs;
        empByTur[c.turma].nT++;   empByTur[c.turma].sT   += transObs;
      }
    });

    return { mAcRel, mDesp, mCong, mBaseP, mBaseT, empByRel, empByTur };
  }, [relatores, turmasReady, empiricos]);

  // Cálculo das estimativas
  const estimates = useMemo(() => {
    if (!rel || !tur) return null;

    const tDesp = Number.isFinite(rel.tempo_despacho_dias_proxy_ITMJ)
      ? rel.tempo_despacho_dias_proxy_ITMJ
      : stats.mDesp;

    // Índices:
    // - acervo_relator_idx: normalizado pela mediana de conclusos (se existir); se não, usa 1.
    const acRelIdx = Number.isFinite(stats.mAcRel) && Number.isFinite(rel.acervo_relator_conclusos_2024)
      ? safeDiv(rel.acervo_relator_conclusos_2024, stats.mAcRel)
      : 1;
    // - congestão turma: normalizado pela mediana
    const congIdx = Number.isFinite(stats.mCong) && Number.isFinite(tur.congestion_proxy_pct)
      ? safeDiv(tur.congestion_proxy_pct, stats.mCong)
      : 1;

    // Bases
    const baseP = Number.isFinite(tur.base_pauta_dias) ? tur.base_pauta_dias : stats.mBaseP;
    const baseT = Number.isFinite(tur.base_ttj_dias) ? tur.base_ttj_dias : stats.mBaseT;

    // Offsets empíricos
    const empRel = stats.empByRel[relator] || { nP: 0, sP: 0, nT: 0, sT: 0 };
    const empTur = stats.empByTur[turma]   || { nP: 0, sP: 0, nT: 0, sT: 0 };
    const empOffP =
      weights.a_relator_emp * (empRel.nP ? empRel.sP / empRel.nP - baseP : 0) +
      weights.a_turma_emp   * (empTur.nP ? empTur.sP / empTur.nP - baseP : 0);
    const empOffT =
      weights.a_relator_emp * (empRel.nT ? empRel.sT / empRel.nT - baseT : 0) +
      weights.a_turma_emp   * (empTur.nT ? empTur.sT / empTur.nT - baseT : 0);

    // ETA até pauta
    const etaPauta =
      weights.w_basePauta * baseP +
      weights.w_tDespacho * tDesp +
      weights.w_acervoRelator * (acRelIdx * baseP) +
      weights.w_congestTurma * (congIdx * baseP) +
      empOffP;

    // ETA até trânsito
    const etaTTJ =
      weights.k_baseTTJ * baseT +
      weights.k_acervoRelator * (acRelIdx * baseT) +
      weights.k_congestTurma * (congIdx * baseT) +
      empOffT;

    // Monocrática (%)
    let monoRate = NaN;
    if (Number.isFinite(rel.decisoes_monocraticas_2024) && Number.isFinite(rel.processos_julgados_2024) && rel.processos_julgados_2024 > 0) {
      monoRate = rel.decisoes_monocraticas_2024 / rel.processos_julgados_2024;
    }

    return {
      daysToPauta: Math.max(0, etaPauta),
      daysToTTJ: Math.max(0, etaTTJ),
      monoRate: clamp01(monoRate),
      explain: { baseP, baseT, tDesp, acRelIdx, congIdx, empOffP, empOffT },
    };
  }, [rel, tur, stats, weights, relator, turma]);

  const arrivalInfo = arrivalDate ? new Date(arrivalDate).toISOString().slice(0, 10) : "-";

  // ------------------------- Render ----------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">TST Time Estimator</h1>
          <p className="text-sm text-gray-600 mt-1">
            Estime pauta, trânsito em julgado e tendência monocrática no TST com dados oficiais e empíricos.
          </p>
        </header>

        {/* Inputs do Caso */}
        <section className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <label className="text-sm font-medium">Data de chegada no TST</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <label className="text-sm font-medium">Relator</label>
            <input
              list="relatores-list"
              className="mt-1 w-full border rounded-xl px-3 py-2"
              placeholder="Selecione ou digite"
              value={relator}
              onChange={(e) => setRelator(e.target.value)}
            />
            <datalist id="relatores-list">
              {relatores.map((r) => (
                <option key={r.relator} value={r.relator} />
              ))}
            </datalist>
            <small className="text-gray-500">Carregue sua base de relatores para a lista completa.</small>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <label className="text-sm font-medium">Turma</label>
            <select
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            >
              <option value="">Selecione…</option>
              {turmasReady.map((t) => (
                <option key={t.turma} value={t.turma}>
                  {t.turma}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Resultados */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <Card title="Tempo estimado até pauta">
            {estimates ? (
              <div>
                <BigNumber value={`${dd(estimates.daysToPauta)} dias`} />
                <p className="text-sm text-gray-600">
                  Chegada: <b>{arrivalInfo}</b>
                </p>
                <p className="text-sm text-gray-600">
                  Data estimada: <b>{addDays(arrivalDate, estimates.daysToPauta)}</b>
                </p>
              </div>
            ) : (
              <Placeholder />
            )}
          </Card>

          <Card title="Tempo estimado até trânsito no TST">
            {estimates ? (
              <div>
                <BigNumber value={`${dd(estimates.daysToTTJ)} dias`} />
                <p className="text-sm text-gray-600">
                  Chegada: <b>{arrivalInfo}</b>
                </p>
                <p className="text-sm text-gray-600">
                  Data estimada: <b>{addDays(arrivalDate, estimates.daysToTTJ)}</b>
                </p>
              </div>
            ) : (
              <Placeholder />
            )}
          </Card>

          <Card title="Tendência de decisão monocrática do Relator">
            {estimates && Number.isFinite(estimates.monoRate) ? (
              <div>
                <BigNumber value={pct(estimates.monoRate)} />
                <p className="text-sm text-gray-600">
                  Classificação:{" "}
                  <b>
                    {estimates.monoRate >= 0.5
                      ? "Costuma proferir monocrática"
                      : "Predominantemente colegiada"}
                  </b>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Informe (no CSV de relatores) <b>decisoes_monocraticas_2024</b> e{" "}
                <b>processos_julgados_2024</b> para calcular a taxa.
              </p>
            )}
          </Card>
        </section>

        {/* Justificativa */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">
          <h2 className="text-lg font-semibold mb-3">Justificativa do modelo</h2>
          {estimates && rel && tur ? (
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>
                <b>Base Turma (pauta):</b> {dd(estimates.explain.baseP)} dias
              </li>
              <li>
                <b>Base Turma (TTJ):</b> {dd(estimates.explain.baseT)} dias
              </li>
              <li>
                <b>Tempo de despacho (proxy ITMJ do Relator):</b> {dd(estimates.explain.tDesp)} dias
              </li>
              <li>
                <b>Índice de acervo do Relator:</b>{" "}
                {Number.isFinite(estimates.explain.acRelIdx)
                  ? estimates.explain.acRelIdx.toFixed(2)
                  : "-"}
              </li>
              <li>
                <b>Índice de congestão da Turma:</b>{" "}
                {Number.isFinite(estimates.explain.congIdx)
                  ? estimates.explain.congIdx.toFixed(2)
                  : "-"}
              </li>
              <li>
                <b>Offset empírico (pauta):</b> {dd(estimates.explain.empOffP)} dias
              </li>
              <li>
                <b>Offset empírico (TTJ):</b> {dd(estimates.explain.empOffT)} dias
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Carregue os dados e selecione Relator e Turma para ver a decomposição.
            </p>
          )}
        </section>

        {/* Uploads */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <UploadCard
            title="Carregar Turmas"
            subtitle="turma,acervo_turma_pendentes_2024,julgados_2024,distribuidos_2024,(base_pauta_dias?),(base_ttj_dias?)"
            onLoad={(rows) => setTurmas(rows.map(normalizeTurma))}
          />
          <UploadCard
            title="Carregar Relatores"
            subtitle="relator,turma,(tempo_despacho_dias_proxy_ITMJ?),(decisoes_monocraticas_2024?),(processos_julgados_2024?)"
            onLoad={(rows) => setRelatores(rows.map(normalizeRelator))}
          />
          <UploadCard
            title="Carregar Empíricos (opcional)"
            subtitle="chegada_data,relator,turma,pauta_data,transito_data,decisao_tipo"
            onLoad={(rows) => setEmpiricos(rows.map(normalizeEmpirico))}
          />
        </section>

        {/* Configuração do Modelo */}
        <section className="bg-white rounded-2xl shadow p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4">Configuração do Modelo</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Até pauta</h3>
              <Weight name="Base Turma" value={weights.w_basePauta} onChange={(v) => setWeights({ ...weights, w_basePauta: v })} />
              <Weight name="Tempo despacho (Relator)" value={weights.w_tDespacho} onChange={(v) => setWeights({ ...weights, w_tDespacho: v })} />
              <Weight name="Acervo (Relator)" value={weights.w_acervoRelator} onChange={(v) => setWeights({ ...weights, w_acervoRelator: v })} />
              <Weight name="Congestão (Turma)" value={weights.w_congestTurma} onChange={(v) => setWeights({ ...weights, w_congestTurma: v })} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Até trânsito</h3>
              <Weight name="Base Turma (TTJ)" value={weights.k_baseTTJ} onChange={(v) => setWeights({ ...weights, k_baseTTJ: v })} />
              <Weight name="Acervo (Relator)" value={weights.k_acervoRelator} onChange={(v) => setWeights({ ...weights, k_acervoRelator: v })} />
              <Weight name="Congestão (Turma)" value={weights.k_congestTurma} onChange={(v) => setWeights({ ...weights, k_congestTurma: v })} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium mb-2">Ajustes empíricos</h3>
              <Weight name="Offset por Relator" value={weights.a_relator_emp} onChange={(v) => setWeights({ ...weights, a_relator_emp: v })} />
              <Weight name="Offset por Turma" value={weights.a_turma_emp} onChange={(v) => setWeights({ ...weights, a_turma_emp: v })} />
              <p className="text-xs text-gray-500 mt-2">
                Use seus casos reais para capturar sazonalidade e mudanças recentes.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
              <b>Boas práticas</b>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Valide com 2–3 casos conhecidos antes de travar os pesos.</li>
                <li>Atualize mensalmente as bases por Turma e Relator.</li>
                <li>Adote janela móvel (6–12 meses) nos empíricos para refletir o mais recente.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exportar / Importar Bundle */}
        <section className="bg-white rounded-2xl shadow p-5 mb-24">
          <h2 className="text-lg font-semibold mb-3">Exportar / Importar</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded-xl shadow bg-gray-900 text-white"
              onClick={() => exportBundle(relatores, turmasReady, empiricos, weights)}
            >
              Exportar pacote (.json)
            </button>
            <label className="px-4 py-2 rounded-xl shadow bg-gray-200 cursor-pointer">
              Importar pacote (.json)
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => importBundle(e, setRelatores, setTurmas, setEmpiricos, setWeights)}
              />
            </label>
          </div>
        </section>

        <footer className="text-xs text-gray-500">
          <p>
            Aviso: estimativas baseadas em dados fornecidos e estatísticas históricas. Não constitui garantia de prazos nem aconselhamento jurídico.
          </p>
        </footer>
      </div>
    </div>
  );
}

// ---------------------- Componentes Auxiliares ------------------------------
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
}
function BigNumber({ value }) {
  return <div className="text-3xl md:text-4xl font-semibold mb-2">{value}</div>;
}
function Placeholder() {
  return <p className="text-sm text-gray-500">Selecione Relator e Turma (e informe a data de chegada) para estimar.</p>;
}
function Weight({ name, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <label className="text-sm">{name}</label>
        <span className="text-xs text-gray-600">{Number(value).toFixed(2)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function UploadCard({ title, subtitle, onLoad }) {
  const [fileInfo, setFileInfo] = useState(null);

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer(); // funciona para .xlsx e .csv
    let rows = [];

    if (f.name.endsWith(".csv")) {
      const str = new TextDecoder().decode(buf);
      rows = parseCSV(str);
    } else if (f.name.endsWith(".json")) {
      const str = new TextDecoder().decode(buf);
      rows = JSON.parse(str);
    } else if (f.name.endsWith(".xlsx")) {
      const workbook = XLSX.read(buf, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    }

    setFileInfo({ name: f.name, count: rows.length });
    onLoad(rows);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-xs text-gray-600 mb-3">{subtitle}</p>
      <label className="px-3 py-2 rounded-xl shadow bg-gray-900 text-white cursor-pointer">
        Carregar arquivo
        <input
          type="file"
          accept=".csv,.json,.xlsx"
          className="hidden"
          onChange={onFile}
        />
      </label>

      {fileInfo && (
        <p className="mt-2 text-sm text-green-600 flex items-center space-x-2">
          <span>✅ {fileInfo.name} carregado</span>
          <span className="text-gray-500">({fileInfo.count} linhas)</span>
        </p>
      )}
    </div>
  );
}


// ----------------- Export/Import de Bundle .json ----------------------------
function exportBundle(relatores, turmasReady, empiricos, weights) {
  const bundle = {
    relatores,
    turmas: turmasReady,
    empiricos,
    weights,
  };
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tst_time_estimator_bundle_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
async function importBundle(e, setRelatores, setTurmas, setEmpiricos, setWeights) {
  const f = e.target.files?.[0];
  if (!f) return;
  const text = await f.text();
  const obj = JSON.parse(text);

  if (obj.relatores) setRelatores(obj.relatores.map(normalizeRelator));
  if (obj.turmas) setTurmas(obj.turmas.map(normalizeTurma)); // normaliza; bases serão respeitadas
  if (obj.empiricos) setEmpiricos(obj.empiricos.map(normalizeEmpirico));
  if (obj.weights) setWeights({ ...obj.weights });
}
