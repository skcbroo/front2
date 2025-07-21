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

            <div className="grid gap-6 max-w-7xl mx-auto">
                {creditos.map((c) => {
                    const adquiridas = c.cotas?.reduce((soma, cota) => soma + cota.quantidade, 0) || 0;
                    const disponiveis = c.quantidadeCotas - adquiridas;

                    return (
                        <Link
                            to={`/creditos/${c.id}`}
                            key={c.id}
                            className="block bg-[#F9FAFB] border border-[#CBD5E1] rounded-xl shadow-sm hover:shadow-md transition-all px-6 py-5 text-[#2D3748] w-full max-w-5xl mx-auto"
                        >
                            {/* Valor no topo */}
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Valor estimado de recebimento
                                </h3>
                                <p className="text-3xl font-bold text-[#1A202C]">
                                    {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>

                            {/* Conteúdo em colunas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#4A5568]">
                                {/* Coluna 1: informações técnicas */}
                                <div className="space-y-1">
                                    <div>
                                        <span className="font-semibold">Área:</span> {c.area}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Fase:</span> {c.fase}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Matéria:</span> {c.materia}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Deságio:</span> {c.desagio}%
                                    </div>
                                </div>

                                {/* Coluna 2: valores financeiros */}
                                <div className="space-y-1">
                                    <div>
                                        <span className="font-semibold text-[#2B6CB0]">Valor de aquisição:</span>
                                        <div className="text-[#2B6CB0] font-bold">
                                            {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Cotas disponíveis:</span>
                                        <div>{c.quantidadeCotas - (c.cotas?.reduce((soma, ct) => soma + ct.quantidade, 0) || 0)} de {c.quantidadeCotas}</div>
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
