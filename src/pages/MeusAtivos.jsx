import { useEffect, useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import GraficoRetorno from "../components/GraficoRetorno";

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

  return (
    <NavbarLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 select-none cursor-default">Meus Ativos</h2>

        {ativos.length === 0 ? (
          <p className="text-center text-gray-700">Você ainda não possui ativos adquiridos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ativos.map((ativo) => (
              <div
                key={ativo.id}
                className="bg-white border rounded-xl p-4 shadow-md select-none cursor-pointer hover:bg-gray-100 transition"
                onClick={() => irParaDetalhes(ativo.id)}
              >
                <p><strong>📄 Processo:</strong> {ativo.numeroProcesso}</p>
                <p><strong>💰 Valor do crédito:</strong> {ativo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                <p><strong>💵 Preço por cota:</strong> {(ativo.preco / ativo.quantidadeCotas).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                <p><strong>🎯 Cotas adquiridas:</strong> {ativo.cotasCompradas}</p>
                <p><strong>📉 Deságio:</strong> {ativo.desagio.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        )}

        {/* Gráfico após os cards */}
        <GraficoRetorno />
      </div>
    </NavbarLayout>
  );
}
