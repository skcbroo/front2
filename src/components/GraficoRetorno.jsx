import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
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

  const data = {
    labels: dados.map((d) => d.mes),
    datasets: [
      {
        data: dados.map((d) => d.valor),
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
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
          },
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
        max: 60000,
        ticks: {
          stepSize: 10000,
          callback: function (value) {
            return value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            });
          },
          color: "#4A5568",
        },
        grid: { display: false },
      },
    },
  };

  return <Line data={data} options={options} />;
}
