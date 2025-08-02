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

  const valores = dados.map((d) => d.valor);
  const valorMax = valores.length > 0 ? valores[valores.length - 1] : 0;
  const maxY = Math.ceil((valorMax + 1) / 10000) * 10000;

  const data = {
    labels: dados.map((d) => d.mes),
    datasets: [
      {
        data: valores,
        borderColor: "#0074D9",
        backgroundColor: "#0074D9",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            context.parsed.y.toLocaleString("pt-BR", {
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
        max: maxY,
        ticks: {
          stepSize: 10000,
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
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "1rem",
        padding: "1rem",
        height: "300px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
