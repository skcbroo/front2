import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function GraficoRetorno() {
  const [dados, setDados] = useState({
    retornoPorMes: [],
    comparativoCDI: [],
  });

  useEffect(() => {
    async function carregar() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/retorno-agenciado`);
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar retorno agenciado:", err);
      }
    }
    carregar();
  }, []);

  // === Converte para percentuais em relação ao primeiro mês
  const baseRetorno = dados.retornoPorMes[0]?.valor || 1;
  const baseCDI = dados.comparativoCDI[0]?.valor || 1;

  const valoresProjetados = dados.retornoPorMes.map((d) => ((d.valor / baseRetorno) - 1) * 100);
  const valoresCDI = dados.comparativoCDI.map((d) => ((d.valor / baseCDI) - 1) * 100);
  const labels = dados.retornoPorMes.map((d) => d.mes);

  const maxY = Math.max(...valoresProjetados, ...valoresCDI, 0);
  const stepSize = maxY > 100 ? 20 : 10;

  const data = {
    labels,
    datasets: [
      {
        label: "Retorno Projetado",
        data: valoresProjetados,
        borderColor: "#0074D9",
        backgroundColor: "#0074D9",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        clip: { top: 8, right: 12, bottom: 0, left: 0 },
      },
      {
        label: "CDI Acumulado",
        data: valoresCDI,
        borderColor: "#FBBF24",
        backgroundColor: "#FBBF24",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        clip: { top: 8, right: 12, bottom: 0, left: 0 },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 12, right: 12, left: 12, bottom: 12 },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#2D3748",
          font: { size: 12, weight: "bold" },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toFixed(2)}%`,
          title: () => null,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4A5568" },
      },
      y: {
        min: 0,
        grace: "5%",
        ticks: {
          stepSize,
          maxTicksLimit: 10,
          callback: (value) => `${value.toFixed(1)}%`,
          color: "#4A5568",
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#EBF4FF",
        border: "1px solid #CBD5E1",
        borderRadius: "1rem",
        padding: "1rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        height: "500px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
