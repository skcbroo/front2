// Atualizado: Creditos.jsx com exibição de cotas totais e disponíveis
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function Creditos() {
    const [creditos, setCreditos] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/creditos`)
            .then((res) => setCreditos(res.data))
            .catch((err) => console.error("Erro ao buscar créditos:", err));
    }, []);

    return (
        <NavbarLayout>
            <h2 className="text-2xl font-bold text-center mb-6 select-none cursor-default">
                Créditos Judiciais Disponíveis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto select-none cursor-default">
                {creditos.map((c) => {
                    const adquiridas = c.cotas?.reduce((soma, cota) => soma + cota.quantidade, 0) || 0;
                    const disponiveis = c.quantidadeCotas - adquiridas;

                    return (
                        <Link
                            to={`/creditos/${c.id}`}
                            key={c.id}
                            className="block w-[360px] bg-[#F9FAFB] border border-[#CBD5E1] rounded-xl shadow-sm hover:shadow-md transition-all px-5 py-6 text-[#2D3748] min-h-[300px] flex flex-col justify-between"
                        >
                            {/* Cabeçalho */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Valor estimado de recebimento
                                </h3>
                                <p className="text-2xl font-bold text-[#1A202C] mb-4">
                                    {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>

                                {/* Dados em grid */}
                                <div className="grid grid-cols-2 gap-y-2 text-sm text-[#4A5568]">
                                    <div>
                                        <span className="font-semibold block">Área</span>
                                        <span>{c.area}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block">Fase</span>
                                        <span>{c.fase}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-semibold block">Matéria</span>
                                        <span>{c.materia}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-semibold block">Deságio</span>
                                        <span>{c.desagio}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rodapé */}
                            <div className="mt-5 border-t border-[#E2E8F0] pt-3">
                                <div className="text-sm mb-1">
                                    <span className="font-semibold text-[#2B6CB0]">Valor de aquisição</span>
                                    <div className="text-[#2B6CB0] font-bold">
                                        {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </div>
                                </div>

                                <div className="text-sm mt-2">
                                    <span className="font-semibold">Cotas disponíveis</span>
                                    <div>{disponiveis} de {c.quantidadeCotas}</div>
                                </div>
                            </div>
                        </Link>

                    );
                })}
            </div>

        </NavbarLayout>
    );
}
