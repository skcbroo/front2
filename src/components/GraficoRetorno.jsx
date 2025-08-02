import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function GraficoRetorno() {
  const [dados, setDados] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/retorno-projetado`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar retorno projetado:", err);
      }
    };

    carregar();
  }, []);

  const chartData = {
    labels: dados.map((d) => d.mes),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.3,
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
          return context.formattedValue;
        }
      }
    },
  },
  scales: {
    x: {
      grid: { display: false }, // remove linha vertical
      ticks: { color: '#4A5568' }
    },
    y: {
      grid: { display: false }, // remove linha horizontal
      ticks: {
        callback: function (value) {
          return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
          });
        },
        color: '#4A5568'
      }
    }
  }
};


  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
