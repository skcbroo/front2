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

  // === Carregar turmas/relatores do /public ===
  useEffect(() => {
    (async () => {
      const turmasData = await loadExcel("/turmas_modelo.xlsx");
      const relatoresData = await loadExcel("/relatores_modelo.xlsx");
      setTurmas(turmasData);
      setRelatores(relatoresData);
    })();
  }, []);

  // === Calcular ===
  const calcular = () => {
    const turmaSelecionada = turmas.find((t) => t.turma === turma);
    const relatorSelecionado = relatores.find((r) => r.relator === relator);

    if (!turmaSelecionada || !relatorSelecionado) {
      alert("Selecione relator e turma válidos!");
      return;
    }

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B]">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            Estimador TST
          </h2>

          {/* Formulário */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Ano do processo
              </label>
              <input
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
                placeholder="Ex: 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Ministro Relator
              </label>
              <select
                value={relator}
                onChange={(e) => setRelator(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
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
              <label className="block text-sm font-medium mb-1 text-black">
                Turma
              </label>
              <select
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
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

          {/* Resultado */}
          {resultado && (
            <div className="mt-8 bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">
                📊 Resultado da Estimativa
              </h3>
              <p className="text-black"><strong>Ano:</strong> {resultado.ano}</p>
              <p className="text-black"><strong>Relator:</strong> {resultado.relator}</p>
              <p className="text-black"><strong>Turma:</strong> {resultado.turma}</p>
              <p className="text-black"><strong>Tempo até pauta:</strong> {resultado.estimativaPauta} dias</p>
              <p className="text-black"><strong>Tempo até trânsito em julgado:</strong> {resultado.estimativaTTJ} dias</p>
              <p className="text-black"><strong>Monocráticas?</strong> {resultado.monocraticas}</p>
            </div>
          )}
        </div>
      </div>
    </NavbarLayout>
  );
}
