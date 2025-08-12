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
  const maxData = valores.length ? Math.max(...valores) : 0;

  // step: 20k se passar de 100k, senão 10k
  const stepSize = maxData > 100000 ? 20000 : 10000;

  // maxY arredondado + folga (meio step) pra não cortar o ponto no topo
  const maxY = Math.ceil((maxData + stepSize * 0.5) / stepSize) * stepSize;

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
        // evita clipping nas bordas (pode ser número ou objeto)
        clip: { top: 8, right: 12, bottom: 0, left: 0 },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      // um respiro visual no topo/direita (ajuda contra corte)
       padding: { top: 12, right: 12, left: 12 }, 
    },
    plugins: {
      legend: { display: false },
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
        // use suggestedMax + grace pra dar folga automática
        suggestedMax: maxY,
        grace: "5%", // folguinha adicional acima
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
