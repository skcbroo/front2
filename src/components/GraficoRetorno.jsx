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
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/retorno-projetado`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar retorno projetado:", err);
      }
    }
    carregar();
  }, []);

  const valoresProjetados = dados.retornoPorMes.map((d) => d.valor);
  const valoresCDI = dados.comparativoCDI.map((d) => d.valor);
  const labels = dados.retornoPorMes.map((d) => d.mes);

  const maxData = Math.max(...valoresProjetados, ...valoresCDI, 0);
  const stepSize = maxData > 100000 ? 20000 : 10000;
  const maxY = Math.ceil((maxData + stepSize * 0.5) / stepSize) * stepSize;

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
        tension: 0.2,
        spanGaps: true,
        clip: false,
      },
      {
        label: "CDI Acumulado",
        data: valoresCDI,
        borderColor: "#FBBF24",
        backgroundColor: "#FBBF24",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.2,
        spanGaps: true,
        clip: false,
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
          label: (ctx) =>
            ctx.parsed.y.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
          title: () => null,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        grid: { display: false },
        ticks: { color: "#4A5568" },
        min: labels[0],
        max: labels[labels.length - 1],
      },
      y: {
        min: 0,
        suggestedMax: maxY,
        grace: "5%",
        ticks: {
          stepSize,
          maxTicksLimit: 10,
          callback: (value) =>
            value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            }),
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
