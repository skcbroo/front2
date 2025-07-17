import { useEffect, useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";

export default function AdminCotas() {
  const [usuarios, setUsuarios] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [creditoId, setCreditoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarUsuarios();
    carregarCreditos();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      setMensagem("Erro ao carregar usuários");
    }
  }

  async function carregarCreditos() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/creditos`);
      setCreditos(res.data);
    } catch (err) {
      setMensagem("Erro ao carregar créditos");
    }
  }

  async function handleVincular(e) {
    e.preventDefault();
    setMensagem("");
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cotas`,
        {
          usuarioId: parseInt(usuarioId),
          creditoJudicialId: parseInt(creditoId),
          quantidade: parseInt(quantidade),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensagem("Cotas vinculadas com sucesso!");
      setUsuarioId("");
      setCreditoId("");
      setQuantidade("");
    } catch (err) {
      setMensagem("Erro ao vincular cotas. Verifique se a combinação já existe.");
    }
  }

  return (
    <NavbarLayout>
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 select-none cursor-default">
          Vincular Cotas a Usuário
        </h2>

        {mensagem && <p className="mb-4 text-center text-red-600">{mensagem}</p>}

        <form onSubmit={handleVincular} className="space-y-4 select-none cursor-default">
          <select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>

          <select
            value={creditoId}
            onChange={(e) => setCreditoId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um crédito judicial</option>
            {creditos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.area} - {c.materia} (Cotas disponíveis: {c.quantidadeCotas - c.cotasAdquiridas})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantidade de cotas"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Vincular Cotas
          </button>
        </form>
      </div>
    </NavbarLayout>
  );
}
