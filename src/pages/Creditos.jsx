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
                            className="block bg-[#F9FAFB] border border-[#CBD5E1] rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-[#2D3748]"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-[#1A202C]">
                                Valor estimado de recebimento
                            </h3>
                            <p className="text-2xl font-bold text-[#1A202C] mb-4">
                                {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>

                            <dl className="space-y-1 text-sm text-[#4A5568]">
                                <div>
                                    <dt className="font-medium">Área</dt>
                                    <dd>{c.area}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Fase</dt>
                                    <dd>{c.fase}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Matéria</dt>
                                    <dd>{c.materia}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Deságio</dt>
                                    <dd>{c.desagio}%</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-[#2B6CB0]">Valor de aquisição</dt>
                                    <dd className="text-[#2B6CB0] font-medium">
                                        {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Cotas disponíveis</dt>
                                    <dd>
                                        {disponiveis} de {c.quantidadeCotas}
                                    </dd>
                                </div>
                            </dl>
                        </Link>
                    );
                })}
            </div>

        </NavbarLayout>
    );
}
