import { useState } from "react";
import * as XLSX from "xlsx";
import NavbarLayout from "../components/Navbar";

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
    <NavbarLayout>
      <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default">
        Estimador TST
      </h2>

      {/* Uploads */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <label className="flex flex-col items-center bg-[#EBF4FF] border border-[#CBD5E1] px-4 py-3 rounded-lg cursor-pointer">
          <span className="text-sm font-medium text-[#2D3748] mb-1">Turmas XLSX</span>
          <input type="file" accept=".xlsx" className="hidden" onChange={(e) => handleFileUpload(e, setTurmas)} />
        </label>
        <label className="flex flex-col items-center bg-[#EBF4FF] border border-[#CBD5E1] px-4 py-3 rounded-lg cursor-pointer">
          <span className="text-sm font-medium text-[#2D3748] mb-1">Relatores XLSX</span>
          <input type="file" accept=".xlsx" className="hidden" onChange={(e) => handleFileUpload(e, setRelatores)} />
        </label>
        <label className="flex flex-col items-center bg-[#EBF4FF] border border-[#CBD5E1] px-4 py-3 rounded-lg cursor-pointer">
          <span className="text-sm font-medium text-[#2D3748] mb-1">Empíricos XLSX</span>
          <input type="file" accept=".xlsx" className="hidden" onChange={(e) => handleFileUpload(e, setEmpiricos)} />
        </label>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={gerarBundle}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
        >
          Gerar Bundle
        </button>
      </div>

      {bundle && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {bundle.turmas.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md px-6 py-5 text-[#2D3748]"
            >
              {/* Badge de status baseado em congestão */}
              <div
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                  t.congestion_proxy_pct > 50
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {t.congestion_proxy_pct.toFixed(1)}% Congestão
              </div>

              <h3 className="text-lg font-bold mb-2">{t.turma}</h3>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Prazo até pauta:</span>{" "}
                {t.base_pauta_dias} dias
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Prazo até trânsito:</span>{" "}
                {t.base_ttj_dias} dias
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Throughput:</span>{" "}
                {t.throughput_julgados_sobre_distribuidos.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {bundle && (
        <div className="flex justify-center mt-8">
          <button
            onClick={downloadBundle}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition"
          >
            Baixar JSON
          </button>
        </div>
      )}
    </NavbarLayout>
  );
}
