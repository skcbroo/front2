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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis unit="R$" />
            <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0074D9"
              strokeWidth={2}
              name="Retorno"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
