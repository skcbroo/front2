import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [novaSenha, setNovaSenha] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  async function promover(email) {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/usuarios/promover`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Usuário ${email} promovido a admin`);
      setUsuarios((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: "admin" } : u))
      );
    } catch (err) {
      alert("Erro ao promover usuário.");
    }
  }

  async function alterarSenha(id) {
    const token = localStorage.getItem("token");
    const senha = novaSenha[id];

    if (!senha || senha.length < 6) {
      alert("Informe uma nova senha com pelo menos 6 caracteres.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/${id}/senha`,
        { novaSenha: senha },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Senha atualizada com sucesso!");
      setNovaSenha((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      alert("Erro ao atualizar senha.");
    }
  }

  return (
  <NavbarLayout>
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center select-none cursor-default">
         Gerenciamento de Usuários
      </h2>

      {usuarios.length === 0 ? (
        <p className="text-gray-600 text-center select-none cursor-default">
          Nenhum usuário encontrado.
        </p>
      ) : (
        <ul className="space-y-4">
          {usuarios.map((u) => (
            <li
              key={u.id}
              className="border p-4 rounded-xl bg-white shadow-md select-none cursor-default"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-semibold">
                    {u.nome} <span className="text-sm text-gray-500">({u.email})</span>
                  </p>
                  <p className="text-sm text-gray-600">Role: {u.role}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => promover(u.email)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Promover
                    </button>
                  )}
                </div>
              </div>

              {/* Botão para iniciar alteração de senha */}
              <div className="mt-4">
                {novaSenha[u.id] === undefined ? (
                  <button
                    onClick={() =>
                      setNovaSenha((prev) => ({ ...prev, [u.id]: "" }))
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Alterar Senha
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <input
                      type="password"
                      placeholder="Nova senha"
                      value={novaSenha[u.id]}
                      onChange={(e) =>
                        setNovaSenha((prev) => ({
                          ...prev,
                          [u.id]: e.target.value,
                        }))
                      }
                      className="p-2 border rounded w-full sm:w-64"
                    />
                    <button
                      onClick={() => alterarSenha(u.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() =>
                        setNovaSenha((prev) => {
                          const atualizado = { ...prev };
                          delete atualizado[u.id];
                          return atualizado;
                        })
                      }
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </NavbarLayout>
);
}
