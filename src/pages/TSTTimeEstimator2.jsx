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

  // === Fórmulas auxiliares ===
  const safeDiv = (a, b) => (Number(b) ? Number(a) / Number(b) : 0);

  const calcularBasesTurma = (t) => {
    const pend = Number(t.acervo_turma_pendentes_2024);
    const julg = Number(t.julgados_2024);
    const dist = Number(t.distribuidos_2024);

    const ef = safeDiv(pend, julg); // estoque/fluxo
    const thr = safeDiv(julg, dist); // throughput
    const invThr = thr ? 1 / thr : 0;
    const cong = (pend + julg) ? pend / (pend + julg) : 0;

    const base_pauta_dias = Math.round(343 * (0.6 * ef + 0.4 * invThr));
    const base_ttj_dias = Math.round(551 * (0.7 * ef + 0.3 * cong));

    return { base_pauta_dias, base_ttj_dias };
  };

  // === Calcular ===
  const calcular = () => {
    const turmaSelecionada = turmas.find((t) => t.turma === turma);
    const relatorSelecionado = relatores.find((r) => r.relator === relator);

    if (!turmaSelecionada || !relatorSelecionado || !dataChegada) {
      alert("Preencha todos os campos!");
      return;
    }

    // Bases calculadas
    const { base_pauta_dias, base_ttj_dias } = calcularBasesTurma(turmaSelecionada);

    // Taxa monocrática
    let monocraticas = "-";
    if (relatorSelecionado.decisoes_monocraticas_2024 && relatorSelecionado.processos_julgados_2024) {
      const dec = Number(relatorSelecionado.decisoes_monocraticas_2024);
      const proc = Number(relatorSelecionado.processos_julgados_2024);
      if (proc > 0) monocraticas = (dec / proc * 100).toFixed(1) + "%";
    }

    // Datas finais
    const chegadaDate = new Date(dataChegada);
    const dataMaximaPauta = new Date(chegadaDate);
    dataMaximaPauta.setDate(dataMaximaPauta.getDate() + base_pauta_dias);

    const dataMaximaTTJ = new Date(chegadaDate);
    dataMaximaTTJ.setDate(dataMaximaTTJ.getDate() + base_ttj_dias);

    setResultado({
      dataChegada,
      turma,
      relator,
      estimativaPauta: base_pauta_dias,
      estimativaTTJ: base_ttj_dias,
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
            <p className="text-black"><strong>Tendência de decisão monocrática:</strong> {resultado.monocraticas}</p>
          </div>
        </section>
      )}
    </NavbarLayout>
  );
}
