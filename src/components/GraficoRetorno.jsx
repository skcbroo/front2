import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function GraficoRetorno() {
  const [dados, setDados] = useState([]);
  const [cdi, setCdi] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/retorno-projetado`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDados(res.data.retornoPorMes || []);
        setCdi(res.data.comparativoCDI || []);
      } catch (err) {
        console.error("Erro ao buscar retorno projetado:", err);
      }
    }
    carregar();
  }, []);

  const valores = dados.map((d) => d.valor);
  const valoresCDI = cdi.map((d) => d.valor);

  const maxData = Math.max(...valores, ...valoresCDI, 0);
  const stepSize = maxData > 100000 ? 20000 : 10000;
  const maxY = Math.ceil((maxData + stepSize * 0.5) / stepSize) * stepSize;

  const data = {
    labels: dados.map((d) => d.mes),
    datasets: [
      {
        label: "Retorno Projetado",
        data: valores,
        borderColor: "#0074D9",
        backgroundColor: "#0074D9",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        clip: { top: 8, right: 12, bottom: 0, left: 0 },
      },
      {
        label: "CDI (15% a.a.)",
        data: valoresCDI,
        borderColor: "#2ECC40",
        backgroundColor: "#2ECC40",
        borderDash: [6, 4],
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 12, right: 12, left: 12 },
    },
    plugins: {
      legend: {
        display: true,
        labels: { color: "#1a202c", font: { size: 12 } },
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
        grid: { display: false },
        ticks: { color: "#4A5568" },
      },
      y: {
        min: 0,
        suggestedMax: maxY,
        grace: "5%",
        ticks: {
          stepSize,
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
        height: "300px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
