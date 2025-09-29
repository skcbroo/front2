import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import NavbarLayout from "../components/Navbar";
import TSTTimeEstimatorFinal from "../components/TSTTimeEstimatorFinal";


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
       <TSTTimeEstimatorFinal />;
     
    </NavbarLayout>
  );
}
