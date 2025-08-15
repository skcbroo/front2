import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function Creditos() {
  const [creditos, setCreditos] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/creditos`)
      .then((res) => setCreditos(res.data))
      .catch((err) => console.error("Erro ao buscar créditos:", err));
  }, []);

  const statusMap = {
    cotizando: { texto: "Cotizando", cor: "bg-yellow-200 text-yellow-800" },
    andamento: { texto: "Em andamento", cor: "bg-blue-200 text-blue-800" },
    pago: { texto: "Pago", cor: "bg-green-200 text-green-800" },
    disponivel: { texto: "Disponível", cor: "bg-gray-200 text-gray-800" },
  };

  const ordemStatus = {
    cotizando: 0,
    andamento: 1,
    pago: 2,
  };

  const creditosOrdenados = [...creditos].sort((a, b) => {
    const disponiveisA = a.quantidadeCotas - (a.cotasAdquiridas ?? 0) > 0;
    const disponiveisB = b.quantidadeCotas - (b.cotasAdquiridas ?? 0) > 0;

    // 1) Prioriza quem tem cotas disponíveis
    if (disponiveisA && !disponiveisB) return -1;
    if (!disponiveisA && disponiveisB) return 1;

    // 2) Ordena por status
    const statusA = (a.status || "").toLowerCase().trim();
    const statusB = (b.status || "").toLowerCase().trim();
    return (ordemStatus[statusA] ?? 99) - (ordemStatus[statusB] ?? 99);
  });

  return (
    <NavbarLayout>
      <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default">
        Créditos Judiciais
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto select-none cursor-default">
        {creditosOrdenados.map((c) => {
          // Usa c.cotasAdquiridas se existir; caso contrário, soma do array c.cotas
          const adquiridasCalculadas =
            c.cotasAdquiridas ??
            (c.cotas?.reduce((soma, cota) => soma + (cota.quantidade || 0), 0) || 0);

          const disponiveis = c.quantidadeCotas - adquiridasCalculadas;

          const statusChave = (c.status || "").toLowerCase().trim();
          const statusInfo = statusMap[statusChave] || {
            texto: "Desconhecido",
            cor: "bg-gray-200 text-gray-700",
          };

          return (
            <Link
              to={`/creditos/${c.id}`}
              key={c.id}
              className="block bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md hover:shadow-lg transition-all px-6 py-5 text-[#2D3748] w-full max-w-5xl mx-auto"
            >
              {/* Badge de status */}
              <div
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${statusInfo.cor}`}
              >
                {statusInfo.texto}
              </div>

              {/* Valor no topo */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Valor estimado de recebimento
                </h3>
                <p className="text-3xl font-bold text-[#1A202C]">
                  {c.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              {/* Duas colunas lado a lado */}
              <div className="grid grid-cols-2 gap-6 text-sm text-[#4A5568]">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Área:</span> {c.area}
                  </p>
                  <p>
                    <span className="font-semibold">Fase:</span> {c.fase}
                  </p>
                  <p>
                    <span className="font-semibold">Matéria:</span> {c.materia}
                  </p>
                  <p>
                    <span className="font-semibold">Deságio:</span> {c.desagio}%
                  </p>
                </div>

                <div className="flex flex-col justify-between items-start h-full">
                  {/* Só mostra "cotas disponíveis/indisponíveis" se NÃO for 'Pago' */}
                  {statusChave !== "pago" && (
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${
                          disponiveis > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {disponiveis > 0
                        ? "Cotas disponíveis"
                        : "Cotas indisponíveis"}
                    </span>
                  )}

                  <div className="mt-auto">
                    <p className="font-semibold text-[#2B6CB0]">
                      Valor de aquisição:
                    </p>
                    <p className="text-[#2B6CB0] font-bold">
                      {c.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </NavbarLayout>
  );
}
