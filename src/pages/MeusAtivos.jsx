import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarLayout from "../components/Navbar";
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

  const statusMap = {
    cotizando: { texto: "Cotizando", cor: "bg-yellow-200 text-yellow-800" },
    andamento: { texto: "Em andamento", cor: "bg-blue-200 text-blue-800" },
    pago: { texto: "Pago", cor: "bg-green-200 text-green-800" },
  };

  return (
    <NavbarLayout>
      <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default text-white">
        Meus Ativos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 max-w-6xl mx-auto px-4">
        {ativos.map((c) => {
          const status = statusMap[c.status?.toLowerCase()] || {};
          return (
            <div
              key={c.id}
              className="bg-blue-50 rounded-xl shadow-md p-5 min-h-[210px] hover:shadow-lg transition cursor-default"
            >
              {status.texto && (
                <div
                  className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold ${status.cor}`}
                >
                  {status.texto}
                </div>
              )}

              <p className="text-sm text-gray-600">PROCESSO</p>
              <p className="font-semibold text-md mb-3 text-gray-900">
                {c.numeroProcesso}
              </p>

              <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                <span>Valor do crédito:</span>
                <span className="font-semibold text-gray-900">
                  {c.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                <span>Preço por cota:</span>
                <span className="font-semibold text-gray-900">
                  {c.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                <span>Cotas adquiridas:</span>
                <span className="font-semibold text-gray-900">
                  {c.quantidade}
                </span>

                <span>Deságio:</span>
                <span className="font-semibold text-gray-900">
                  {c.desagio.toFixed(2)}%
                </span>

                <span>Valor investido:</span>
                <span className="font-semibold text-gray-900">
                  {(c.quantidade * c.preco).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                <span>Retorno esperado:</span>
                <span className="font-semibold text-gray-900">
                  {c.retornoEsperado.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <h3 className="text-lg font-semibold text-center text-white mb-4">
          Retorno Projetado
        </h3>
        <GraficoRetorno />
      </div>
    </NavbarLayout>
  );
}
