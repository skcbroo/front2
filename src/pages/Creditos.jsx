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
                            className="bg-white border border-[#CBD5E1] rounded-xl shadow hover:shadow-md transition-all p-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-x-20"
                        >
                            {/* Bloco da esquerda */}
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Valor estimado de recebimento
                                </h3>
                                <p className="text-3xl font-bold text-[#1A202C] mb-4">
                                    {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>

                                <div className="space-y-1 text-sm text-[#4A5568]">
                                    <div><span className="font-semibold">Área:</span> {c.area}</div>
                                    <div><span className="font-semibold">Fase:</span> {c.fase}</div>
                                    <div><span className="font-semibold">Matéria:</span> {c.materia}</div>
                                    <div><span className="font-semibold">Deságio:</span> {c.desagio}%</div>
                                </div>
                            </div>

                            {/* Bloco da direita */}
                            <div className="flex-1 mt-6 md:mt-0 space-y-4 text-sm text-[#4A5568]">
                                <div>
                                    <span className="font-semibold">Cotas disponíveis:</span>
                                    <div className="text-base">
                                        {c.quantidadeCotas - (c.cotas?.reduce((soma, ct) => soma + ct.quantidade, 0) || 0)} de {c.quantidadeCotas}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold text-[#2B6CB0]">Valor de aquisição:</span>
                                    <div className="text-[#2B6CB0] font-bold text-base">
                                        {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
