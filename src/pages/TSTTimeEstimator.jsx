import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import NavbarLayout from "../components/Navbar";

export default function TSTTimeEstimator() {
  const [ano, setAno] = useState("");
  const [relator, setRelator] = useState("");
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [relatores, setRelatores] = useState([]);
  const [resultado, setResultado] = useState(null);

  // === Função util para ler Excel em /public ===
  const loadExcel = async (filePath) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
  };

  // === Carrega os arquivos do /public uma vez ===
  useEffect(() => {
    (async () => {
      const turmasData = await loadExcel("/turmas_modelo.xlsx");
      const relatoresData = await loadExcel("/relatores_modelo.xlsx");
      setTurmas(turmasData);
      setRelatores(relatoresData);
    })();
  }, []);

  // === Calcular estimativa ===
  const calcular = () => {
    const turmaSelecionada = turmas.find((t) => t.turma === turma);
    const relatorSelecionado = relatores.find((r) => r.relator === relator);

    if (!turmaSelecionada || !relatorSelecionado) {
      alert("Selecione relator e turma válidos!");
      return;
    }

    // Exemplo simplificado: usar métricas já calculadas no CSV
    const estimativaPauta = turmaSelecionada.base_pauta_dias || 300;
    const estimativaTTJ = turmaSelecionada.base_ttj_dias || 500;
    const monocraticas = relatorSelecionado.mono_rate || "N/D";

    setResultado({
      ano,
      turma,
      relator,
      estimativaPauta,
      estimativaTTJ,
      monocraticas,
    });
  };

  return (
    <NavbarLayout>
      <h2 className="text-2xl font-bold text-center mb-6">
        Estimador TST
      </h2>

      <div className="max-w-xl mx-auto space-y-4 bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Ano do processo</label>
          <input
            type="text"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Ex: 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ministro Relator</label>
          <select
            value={relator}
            onChange={(e) => setRelator(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Selecione</option>
            {relatores.map((r, idx) => (
              <option key={idx} value={r.relator}>
                {r.relator}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Turma</label>
          <select
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Selecione</option>
            {turmas.map((t, idx) => (
              <option key={idx} value={t.turma}>
                {t.turma}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calcular}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
        >
          Calcular
        </button>
      </div>

      {resultado && (
        <div className="max-w-xl mx-auto mt-8 bg-white border rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Resultado da Estimativa</h3>
          <p><strong>Ano:</strong> {resultado.ano}</p>
          <p><strong>Relator:</strong> {resultado.relator}</p>
          <p><strong>Turma:</strong> {resultado.turma}</p>
          <p><strong>Tempo estimado até pauta:</strong> {resultado.estimativaPauta} dias</p>
          <p><strong>Tempo estimado até trânsito em julgado:</strong> {resultado.estimativaTTJ} dias</p>
          <p><strong>Relator costuma decidir monocraticamente?</strong> {resultado.monocraticas}</p>
        </div>
      )}
    </NavbarLayout>
  );
}
