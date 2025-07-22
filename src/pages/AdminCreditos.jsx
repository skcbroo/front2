import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

function InputMoeda({ value, onChange }) {
    const formatarValor = (val) => {
        const numero = parseFloat(val.replace(/\D/g, '')) / 100;
        if (isNaN(numero)) return '';
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleChange = (e) => {
        const entrada = e.target.value;
        const somenteNumeros = entrada.replace(/[^\d]/g, '');
        onChange(somenteNumeros);
    };

    return (
        <input
            type="text"
            value={formatarValor(value)}
            onChange={handleChange}
            className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
            required
        />
    );
}

export default function AdminCreditos() {
    const [valor, setValor] = useState("");
    const [area, setArea] = useState("");
    const [fase, setFase] = useState("");
    const [materia, setMateria] = useState("");
    const [preco, setPreco] = useState("");
    const [numeroProcesso, setNumeroProcesso] = useState("");
    const [descricao, setDescricao] = useState("");
    const [quantidadeCotas, setQuantidadeCotas] = useState("");
    const [cotasAdquiridas, setCotasAdquiridas] = useState("");
    const [status, setStatus] = useState("Cotizando");
    const [creditos, setCreditos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/");

    useEffect(() => {
        carregarCreditos();
    }, []);

    async function carregarCreditos() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/creditos`);
            setCreditos(res.data);
        } catch (err) {
            console.error("Erro ao carregar créditos:", err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const valorNum = parseFloat(valor) / 100;
        const precoNum = parseFloat(preco) / 100;
        const desagio = parseFloat(((1 - (precoNum / valorNum)) * 100).toFixed(2));

        const dados = {
            valor: valorNum,
            area,
            fase,
            materia,
            preco: precoNum,
            desagio,
            numeroProcesso,
            descricao,
            quantidadeCotas: parseInt(quantidadeCotas),
            cotasAdquiridas: parseInt(cotasAdquiridas) || 0,
            status
        };

        try {
            if (editandoId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/creditos/${editandoId}`, dados, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Crédito atualizado com sucesso!");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/creditos`, dados, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Crédito cadastrado com sucesso!");
            }
            resetarFormulario();
            carregarCreditos();
        } catch (err) {
            alert("Erro ao cadastrar ou atualizar crédito.");
        }
    }

    function preencherFormulario(c) {
        setValor((c.valor * 100).toString());
        setArea(c.area);
        setFase(c.fase);
        setMateria(c.materia);
        setPreco((c.preco * 100).toString());
        setNumeroProcesso(c.numeroProcesso || "");
        setDescricao(c.descricao || "");
        setQuantidadeCotas(c.quantidadeCotas || "");
        setCotasAdquiridas(c.cotasAdquiridas || "");
        setStatus(c.status || "Cotizando");
        setEditandoId(c.id);
    }

    function resetarFormulario() {
        setValor("");
        setArea("");
        setFase("");
        setMateria("");
        setPreco("");
        setNumeroProcesso("");
        setDescricao("");
        setQuantidadeCotas("");
        setCotasAdquiridas("");
        setStatus("Cotizando");
        setEditandoId(null);
    }

    async function excluirCredito(id) {
        const token = localStorage.getItem("token");
        if (!window.confirm("Deseja realmente excluir este crédito?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/creditos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            carregarCreditos();
        } catch (err) {
            alert("Erro ao excluir crédito.");
        }
    }

    return (
        <NavbarLayout>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 select-none cursor-default text-gray-800">
                    {editandoId ? "Editar Crédito Judicial" : "Cadastrar Crédito Judicial"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 mb-10 select-none cursor-default">

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Valor do Crédito</label>
                        <InputMoeda value={valor} onChange={setValor} />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Área</label>
                        <input type="text" value={area} onChange={e => setArea(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Fase</label>
                        <input type="text" value={fase} onChange={e => setFase(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Matéria</label>
                        <input type="text" value={materia} onChange={e => setMateria(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Preço de Oferta</label>
                        <InputMoeda value={preco} onChange={setPreco} />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Número do Processo</label>
                        <input type="text" value={numeroProcesso} onChange={e => setNumeroProcesso(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Descrição do Caso</label>
                        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded h-24 bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Quantidade Total de Cotas</label>
                        <input type="number" value={quantidadeCotas} onChange={e => setQuantidadeCotas(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Cotas Adquiridas (Manual)</label>
                        <input type="number" value={cotasAdquiridas} onChange={e => setCotasAdquiridas(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800" required>
                            <option value="">Selecione o status</option>
                            <option value="Cotizando">Cotizando</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Pago">Pago</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                            {editandoId ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                        {editandoId && (
                            <button type="button" onClick={resetarFormulario} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded">
                                Cancelar
                            </button>
                        )}
                    </div>

                </form>

                <h2 className="text-xl mb-4 font-semibold select-none cursor-default text-gray-800">Créditos cadastrados</h2>

                <ul className="space-y-4">
                    {creditos.map(c => (
                        <li key={c.id} className="bg-[#F9FAFB] border border-[#CBD5E1] rounded-xl p-4 shadow-md select-none cursor-default text-gray-700">
                            <p><strong>💰 Valor:</strong> {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                            <p><strong>📚 Área:</strong> {c.area}</p>
                            <p><strong>⚖️ Fase:</strong> {c.fase}</p>
                            <p><strong>📝 Matéria:</strong> {c.materia}</p>
                            <p><strong>📉 Deságio:</strong> {c.desagio}%</p>
                            <p><strong>🏷️ Preço:</strong> {c.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                            <p><strong>🔢 Cotas totais:</strong> {c.quantidadeCotas}</p>
                            <p><strong>✅ Cotas adquiridas:</strong> {c.cotasAdquiridas ?? 0}</p>
                            <p><strong>📌 Status:</strong> {c.status}</p>

                            <div className="flex gap-2 mt-3">
                                <button onClick={() => preencherFormulario(c)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Editar</button>
                                <button onClick={() => excluirCredito(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </NavbarLayout>
    );
}
