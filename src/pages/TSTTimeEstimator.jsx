import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import NavbarLayout from "../components/Navbar";

export default function TSTTimeEstimator() {
  const [dataChegada, setDataChegada] = useState("");
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
      const turmasData = await loadExcel("/turmas.xlsx");
      const relatoresData = await loadExcel("/relatores.xlsx");
      setTurmas(turmasData);
      setRelatores(relatoresData);
    })();
  }, []);

  // === Calcular ===
  const calcular = () => {
    const turmaSelecionada = turmas.find((t) => t.turma === turma);
    const relatorSelecionado = relatores.find((r) => r.relator === relator);

    if (!turmaSelecionada || !relatorSelecionado || !dataChegada) {
      alert("Preencha todos os campos!");
      return;
    }

    const estimativaPauta = Number(turmaSelecionada.base_pauta_dias) || 300;
    const estimativaTTJ = Number(turmaSelecionada.base_ttj_dias) || 500;
    const monocraticas = relatorSelecionado.mono_rate || "N/D";

    const chegadaDate = new Date(dataChegada);

    const dataMaximaPauta = new Date(chegadaDate);
    dataMaximaPauta.setDate(dataMaximaPauta.getDate() + estimativaPauta);

    const dataMaximaTTJ = new Date(chegadaDate);
    dataMaximaTTJ.setDate(dataMaximaTTJ.getDate() + estimativaTTJ);

    setResultado({
      dataChegada,
      turma,
      relator,
      estimativaPauta,
      estimativaTTJ,
      monocraticas,
      dataMaximaPauta,
      dataMaximaTTJ,
    });
  };

  return (
    <NavbarLayout>
      {/* HERO */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="rounded-xl bg-[#EBF4FF] border border-[#CBD5E1] px-6 py-8 shadow-md">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-4">
              Estimador TST
            </h2>
            <p className="text-[#4A5568] mb-6 select-none cursor-default">
              Informe a data de chegada, relator e turma para obter o tempo
              estimado até pauta e trânsito em julgado.
            </p>

            {/* Formulário */}
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#1A202C]">
                  Data de chegada no TST
                </label>
                <input
                  type="date"
                  value={dataChegada}
                  onChange={(e) => setDataChegada(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-lg p-2 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#1A202C]">
                  Ministro Relator
                </label>
                <select
                  value={relator}
                  onChange={(e) => setRelator(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-lg p-2 text-black"
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
                <label className="block text-sm font-medium mb-1 text-[#1A202C]">
                  Turma
                </label>
                <select
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-lg p-2 text-black"
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
                className="w-full px-6 py-3 bg-[#2B6CB0] text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADO */}
      {resultado && (
        <section className="max-w-6xl mx-auto mb-8">
          <div className="rounded-xl bg-white border border-[#CBD5E1] px-6 py-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1A202C] mb-4">📊 Resultado</h3>
            <p className="text-black"><strong>Data de chegada:</strong> {new Date(resultado.dataChegada).toLocaleDateString("pt-BR")}</p>
            <p className="text-black"><strong>Relator:</strong> {resultado.relator}</p>
            <p className="text-black"><strong>Turma:</strong> {resultado.turma}</p>
            <p className="text-black"><strong>Tempo até pauta:</strong> {resultado.estimativaPauta} dias</p>
            <p className="text-black"><strong>Data máxima estimada para pauta:</strong> {resultado.dataMaximaPauta.toLocaleDateString("pt-BR")}</p>
            <p className="text-black"><strong>Tempo até trânsito em julgado:</strong> {resultado.estimativaTTJ} dias</p>
            <p className="text-black"><strong>Data máxima estimada para TTJ:</strong> {resultado.dataMaximaTTJ.toLocaleDateString("pt-BR")}</p>
            <p className="text-black"><strong>Monocráticas?</strong> {resultado.monocraticas}</p>
          </div>
        </section>
      )}
    </NavbarLayout>
  );
}
