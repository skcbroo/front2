import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function TSTTimeEstimator() {
  const [turmas, setTurmas] = useState([]);
  const [relatores, setRelatores] = useState([]);
  const [empiricos, setEmpiricos] = useState([]);
  const [bundle, setBundle] = useState(null);

  // === Função de parse XLSX ===
  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
      setter(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // === Cálculo de métricas por Turma ===
  const calcularBasesPorTurma = (todasTurmas) => {
    const eArray = todasTurmas.map(
      (t) => Number(t.acervo_turma_pendentes_2024) / Number(t.julgados_2024)
    );
    const throughputArray = todasTurmas.map(
      (t) => Number(t.julgados_2024) / Number(t.distribuidos_2024)
    );
    const invThroughArray = throughputArray.map((x) => 1 / x);
    const congArray = todasTurmas.map(
      (t) =>
        Number(t.acervo_turma_pendentes_2024) /
        (Number(t.acervo_turma_pendentes_2024) + Number(t.julgados_2024))
    );

    const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const meanE = mean(eArray);
    const meanInvThrough = mean(invThroughArray);
    const meanCong = mean(congArray);

    return todasTurmas.map((t, i) => {
      const estoqueFluxo = eArray[i];
      const invThrough = invThroughArray[i];
      const congestionProxy = congArray[i];

      const fatorPauta =
        0.6 * (estoqueFluxo / meanE) + 0.4 * (invThrough / meanInvThrough);
      const fatorTTJ =
        0.7 * (estoqueFluxo / meanE) + 0.3 * (congestionProxy / meanCong);

      return {
        ...t,
        estoque_sobre_fluxo: estoqueFluxo,
        throughput_julgados_sobre_distribuidos: throughputArray[i],
        congestion_proxy_pct: congestionProxy * 100,
        base_pauta_dias: Math.round(343 * fatorPauta),
        base_ttj_dias: Math.round(551 * fatorTTJ),
      };
    });
  };

  // === Gerar bundle ===
  const gerarBundle = () => {
    if (turmas.length === 0 || relatores.length === 0) {
      alert("Suba pelo menos Turmas e Relatores!");
      return;
    }
    const turmasProcessadas = calcularBasesPorTurma(turmas);
    const weights = {
      w_basePauta: 0.40,
      w_tDespacho: 0.25,
      w_acervoRelator: 0.10,
      w_congestTurma: 0.35,
      k_baseTTJ: 0.45,
      k_acervoRelator: 0.20,
      k_congestTurma: 0.35,
      a_relator_emp: 0.50,
      a_turma_emp: 0.50,
    };
    const novoBundle = {
      turmas: turmasProcessadas,
      relatores,
      empiricos,
      weights,
    };
    setBundle(novoBundle);
  };

  // === Download do JSON ===
  const downloadBundle = () => {
    if (!bundle) return;
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tst_time_estimator_bundle.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 TST Time Estimator</h1>

      {/* Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="font-semibold">Turmas XLSX</p>
          <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, setTurmas)} />
        </div>
        <div>
          <p className="font-semibold">Relatores XLSX</p>
          <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, setRelatores)} />
        </div>
        <div>
          <p className="font-semibold">Empíricos XLSX</p>
          <input type="file" accept=".xlsx" onChange={(e) => handleFileUpload(e, setEmpiricos)} />
        </div>
      </div>

      <button
        onClick={gerarBundle}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Gerar Bundle
      </button>

      {bundle && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preview (Turmas)</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Turma</th>
                <th>Pauta (dias)</th>
                <th>TTJ (dias)</th>
                <th>Congestão (%)</th>
              </tr>
            </thead>
            <tbody>
              {bundle.turmas.map((t, idx) => (
                <tr key={idx} className="border">
                  <td className="p-2">{t.turma}</td>
                  <td className="p-2">{t.base_pauta_dias}</td>
                  <td className="p-2">{t.base_ttj_dias}</td>
                  <td className="p-2">{t.congestion_proxy_pct.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadBundle}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Baixar JSON
          </button>
        </div>
      )}
    </div>
  );
}
ccccc
