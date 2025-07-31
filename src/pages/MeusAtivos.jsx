import { useEffect, useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
        <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default">
          Meus Ativos
        </h2>

        {ativos.length === 0 ? (
          <p className="text-center text-gray-700">Você ainda não possui ativos adquiridos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto select-none cursor-default">
            {ativos.map((ativo) => (
              <div
                key={ativo.id}
                className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md hover:shadow-lg transition-all px-6 py-5 text-[#2D3748] cursor-pointer"
                onClick={() => irParaDetalhes(ativo.id)}
              >
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Processo
                  </h3>
                  <p className="text-xl font-bold text-[#1A202C]">{ativo.numeroProcesso}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm text-[#4A5568]">
                  <div className="space-y-1">
                    <p><span className="font-semibold">Valor do crédito:</span><br />
                      {ativo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <p><span className="font-semibold">Preço por cota:</span><br />
                      {(ativo.preco / ativo.quantidadeCotas).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="font-semibold">Cotas adquiridas:</span><br />
                      {ativo.cotasCompradas}
                    </p>
                    <p><span className="font-semibold">Deságio:</span><br />
                      {ativo.desagio.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Gráfico após os cards 
        <GraficoRetorno />*/}
      </div>
    </NavbarLayout>
  );
}
