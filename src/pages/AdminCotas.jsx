import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function AdminCotas() {
  const [usuarios, setUsuarios] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [creditoSelecionado, setCreditoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  if (role !== "admin") navigate("/");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      try {
        const [usuariosRes, creditosRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/creditos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsuarios(usuariosRes.data);
        setCreditos(creditosRes.data);
      } catch (err) {
        alert("Erro ao carregar usuários ou créditos.");
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cotas`, {
      usuarioId: usuarioSelecionado,
      creditoJudicialId: creditoSelecionado,
      quantidade: parseInt(quantidade),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      alert("Cotas atribuídas com sucesso!");
      setUsuarioSelecionado("");
      setCreditoSelecionado("");
      setQuantidade(1);
    } catch (err) {
      alert("Erro ao associar cotas.");
    }
  }

  return (
    <NavbarLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 select-none cursor-default">Vincular Cotas a Usuário</h2>

        <form onSubmit={handleSubmit} className="space-y-4 select-none cursor-default">
          <select
            value={usuarioSelecionado}
            onChange={(e) => setUsuarioSelecionado(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nome} ({u.telefone})</option>
            ))}
          </select>

          <select
            value={creditoSelecionado}
            onChange={(e) => setCreditoSelecionado(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um crédito</option>
            {creditos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.numeroProcesso} — {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Quantidade de cotas"
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Salvar Associação
          </button>
        </form>
      </div>
    </NavbarLayout>
  );
}
