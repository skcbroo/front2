import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function AdminCotas() {
  const [usuarios, setUsuarios] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [cotas, setCotas] = useState([]);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [creditoSelecionado, setCreditoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [editandoCotaId, setEditandoCotaId] = useState(null);
  const [novoUsuarioId, setNovoUsuarioId] = useState("");

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [usuariosRes, creditosRes, cotasRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/creditos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/cotas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsuarios(usuariosRes.data);
      setCreditos(creditosRes.data);
      setCotas(cotasRes.data);
    } catch (err) {
      alert("Erro ao carregar dados.");
    }
  }

  // ... (restante do código continua igual)



  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cotas`,
        {
          usuarioId: Number(usuarioSelecionado),
          creditoJudicialId: Number(creditoSelecionado),
          quantidade: Number(quantidade),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Cotas atribuídas com sucesso!");
      setUsuarioSelecionado("");
      setCreditoSelecionado("");
      setQuantidade(1);
      atualizarCotas();
    } catch (err) {
      alert("Erro ao associar cotas.");
    }
  }

  async function atualizarCotas() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCotas(res.data);
    } catch (err) {
      console.error("Erro ao atualizar cotas.");
    }
  }

  async function removerCota(id) {
    if (!confirm("Tem certeza que deseja remover esta cota?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      atualizarCotas();
    } catch (err) {
      alert("Erro ao remover cota.");
    }
  }

  async function salvarEdicao(id) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cotas/${id}`,
        { usuarioId: Number(novoUsuarioId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditandoCotaId(null);
      setNovoUsuarioId("");
      atualizarCotas();
    } catch (err) {
      alert("Erro ao editar cota.");
    }
  }

  return (
    <NavbarLayout>
      <div className="max-w-3xl mx-auto p-6">
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
              <option key={u.id} value={u.id}>
                {u.nome} 
              </option>
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

        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4 select-none cursor-default">Cotas Existentes</h3>

        <div className="space-y-3">
          {cotas.map((cota) => (
            <div key={cota.id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
              {editandoCotaId === cota.id ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                  <input
                    type="number"
                    value={novoUsuarioId}
                    onChange={(e) => setNovoUsuarioId(e.target.value)}
                    className="border p-2 rounded w-full sm:w-48"
                    placeholder="Novo ID do Usuário"
                  />
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => salvarEdicao(cota.id)}
                  >
                    Salvar
                  </button>
                  <button
                    className="text-gray-600"
                    onClick={() => setEditandoCotaId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-2">
                  <div>
                    <strong>ID:</strong> {cota.id} | <strong>Crédito:</strong> #{cota.creditoJudicialId} |{" "}
                    <strong>Usuário:</strong> {cota.usuario?.nome || "—"} |{" "}
                    <strong>Qtd:</strong> {cota.quantidade}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setEditandoCotaId(cota.id);
                        setNovoUsuarioId(cota.usuarioId);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removerCota(cota.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </NavbarLayout>
  );
}
