import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GraficoRetorno() {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/retorno-projetado`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Opcional: garantir que os dados venham ordenados por mês
        // const ordenado = res.data.sort((a, b) =>
        //   new Date("01/" + a.mes) - new Date("01/" + b.mes)
        // );
        setDadosGrafico(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar gráfico:", err);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="mt-10 bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">Gráfico de Retorno Projetado</h3>

      {carregando ? (
        <p>Carregando dados...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis
              tickFormatter={(value) =>
                value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              }
            />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0074D9"
              strokeWidth={2}
              name="Retorno"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
