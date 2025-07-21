import { useEffect, useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";
import { useNavigate } from "react-router-dom";
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

export default function MeusAtivos() {
  const [ativos, setAtivos] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "cliente") {
      navigate("/");
      return;
    }

    const carregarAtivos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ativos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAtivos(res.data);
      } catch (err) {
        console.error("Erro ao carregar ativos:", err);
      }
    };

    carregarAtivos();
  }, []);

  function irParaDetalhes(id) {
    navigate(`/creditos/${id}`);
  }

  // 🔢 Dados mockados para o gráfico
  const dadosGrafico = [
    { mes: "Jan", valor: 2.3 },
    { mes: "Fev", valor: 3.1 },
    { mes: "Mar", valor: 4.8 },
    { mes: "Abr", valor: 5.2 },
    { mes: "Mai", valor: 6.0 },
    { mes: "Jun", valor: 6.7 },
  ];

  return (
    <NavbarLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 select-none cursor-default">Meus Ativos</h2>

        {ativos.length === 0 ? (
          <p className="text-center text-gray-700">Você ainda não possui ativos adquiridos.</p>
        ) : (
          <ul className="space-y-4">
            {ativos.map((ativo) => (
              <li
                key={ativo.id}
                className="bg-white border rounded-xl p-4 shadow-md select-none cursor-pointer hover:bg-gray-100 transition"
                onClick={() => irParaDetalhes(ativo.id)}
              >
                <p><strong>📄 Processo:</strong> {ativo.numeroProcesso}</p>
                <p><strong>💰 Valor do crédito:</strong> {ativo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                <p><strong>💵 Preço por cota:</strong> {(ativo.preco / ativo.quantidadeCotas).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                <p><strong>🎯 Cotas adquiridas:</strong> {ativo.cotasCompradas}</p>
                <p><strong>📉 Deságio:</strong> {ativo.desagio.toFixed(2)}%</p>
              </li>
            ))}
          </ul>
        )}

        {/* 📈 Gráfico de exemplo */}
        <div className="mt-10 bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Gráfico de Retorno Simulado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} name="Retorno" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </NavbarLayout>
  );
}
