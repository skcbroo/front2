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

  const statusMap = {
    cotizando: { texto: "Cotizando", cor: "bg-yellow-200 text-yellow-800" },
    andamento: { texto: "Em andamento", cor: "bg-blue-200 text-blue-800" },
    pago: { texto: "Pago", cor: "bg-green-200 text-green-800" },
    disponivel: { texto: "Disponível", cor: "bg-gray-200 text-gray-800" },
  };

  const statusOrdem = {
    cotizando: 0,
    andamento: 1,
    pago: 2,
    disponivel: 3,
  };

  const temCotas = ativos.some(a => (a.cotasCompradas ?? 0) > 0);

  // Cálculos financeiros
  const valorAplicado = ativos.reduce((total, ativo) => {
    const precoCota = ativo.preco / ativo.quantidadeCotas;
    return total + precoCota * ativo.cotasCompradas;
  }, 0);

  const retornoProjetado = ativos.reduce((total, ativo) => {
    const valorCota = ativo.valor / ativo.quantidadeCotas;
    return total + valorCota * ativo.cotasCompradas;
  }, 0);

  const retornoAtual = ativos.reduce((total, ativo) => {
    const status = (ativo.status || "").toLowerCase();
    if (status.includes("pago")) {
      const valorCota = ativo.valor / ativo.quantidadeCotas;
      return total + valorCota * ativo.cotasCompradas;
    }
    return total;
  }, 0);

  const rentabilidade = valorAplicado > 0 ? (retornoProjetado / valorAplicado) * 100 : 0;

  return (
    <NavbarLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default">
          Meus Ativos
        </h2>

        {ativos.length === 0 ? (
          <p className="text-center text-gray-700">
            Você ainda não possui ativos adquiridos.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto select-none cursor-default">
            {[...ativos]
              .sort((a, b) => {
                const normalizar = (status) =>
                  (status || "")
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim();

                const chaveA = normalizar(a.status);
                const chaveB = normalizar(b.status);

                return (statusOrdem[chaveA] ?? 99) - (statusOrdem[chaveB] ?? 99);
              })
              .map((ativo) => {
                const precoPorCota = ativo.preco / ativo.quantidadeCotas;
                const valorInvestido = precoPorCota * ativo.cotasCompradas;
                const retornoEsperado = (ativo.valor / ativo.quantidadeCotas) * ativo.cotasCompradas;

                const statusRaw = ativo.status || ativo.creditoJudicial?.status || "";
                const statusChave = statusRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const statusInfo = statusMap[statusChave] || {
                  texto: "Desconhecido",
                  cor: "bg-gray-200 text-gray-700",
                };

                return (
                  <div
                    key={ativo.id}
                    className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md hover:shadow-lg transition-all px-6 py-5 text-[#2D3748] cursor-pointer"
                    onClick={() => irParaDetalhes(ativo.id)}
                  >
                    {/* Badge de status */}
                    <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${statusInfo.cor}`}>
                      {statusInfo.texto}
                    </div>

                    {/* Número do processo */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Processo
                      </h3>
                      <p className="text-xl font-bold text-[#1A202C]">{ativo.numeroProcesso}</p>
                    </div>

                    {/* Informações distribuídas em 2 colunas */}
                    <div className="grid grid-cols-2 gap-6 text-sm text-[#4A5568]">
                      <div className="space-y-1">
                        <p><span className="font-semibold">Valor do crédito:</span><br />
                          {ativo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                        <p><span className="font-semibold">Preço por cota:</span><br />
                          {precoPorCota.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                        <p><span className="font-semibold">Valor investido:</span><br />
                          {valorInvestido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p><span className="font-semibold">Cotas adquiridas:</span><br />
                          {ativo.cotasCompradas}
                        </p>
                        <p><span className="font-semibold">Deságio:</span><br />
                          {ativo.desagio.toFixed(2)}%
                        </p>
                        <p><span className="font-semibold">Retorno esperado:</span><br />
                          {retornoEsperado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {temCotas && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-center mb-4 select-none cursor-default">
              Retorno Projetado
            </h3>
            <GraficoRetorno />

            {/* Bloco de resumo financeiro */}
            <div className="mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 text-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-center">Resumo Financeiro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">💰 Valor aplicado:</span><br />
                  {valorAplicado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div>
                  <span className="font-semibold">📈 Retorno projetado:</span><br />
                  {retornoProjetado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div>
                  <span className="font-semibold">📊 Rentabilidade projetada:</span><br />
                  {rentabilidade.toFixed(2)}%
                </div>
                <div>
                  <span className="font-semibold">✅ Retorno atual:</span><br />
                  {retornoAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavbarLayout>
  );
}
