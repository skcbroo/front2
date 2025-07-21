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
                            className="block bg-[#F9FAFB] border border-[#CBD5E1] rounded-xl shadow-sm hover:shadow-md transition-all px-6 py-5 text-[#2D3748] w-full max-w-5xl mx-auto h-full"
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

                            {/* Layout horizontal equilibrado */}
                            <div className="grid grid-cols-2 gap-6 text-sm text-[#4A5568] h-full">
                                {/* Coluna esquerda */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <p><span className="font-semibold">Área:</span> {c.area}</p>
                                        <p><span className="font-semibold">Fase:</span> {c.fase}</p>
                                        <p><span className="font-semibold">Matéria:</span> {c.materia}</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p><span className="font-semibold">Deságio:</span> {c.desagio}%</p>
                                    </div>
                                </div>

                                {/* Coluna direita */}
                                <div className="flex flex-col justify-between items-end text-right">
                                    <div>
                                        <p className="font-semibold">Cotas disponíveis:</p>
                                        <p>{disponiveis} de {c.quantidadeCotas}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2B6CB0]">Valor de aquisição:</p>
                                        <p className="text-[#2B6CB0] font-bold">
                                            {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
