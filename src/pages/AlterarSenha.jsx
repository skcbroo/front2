import { useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmarSenha) {
      setErro("A nova senha e a confirmação não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/alterar-senha`,
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("Senha alterada com sucesso.");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch {
      setErro("Erro ao alterar senha. Verifique a senha atual.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <NavbarLayout>
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl text-gray-800 rounded-2xl shadow-2xl border border-white/40 px-8 py-10"
          aria-labelledby="titulo-alterar-senha"
        >
          <div className="mb-6 text-center select-none cursor-default">
            <img src="/logonova.png" alt="Midlej Capital" className="mx-auto h-16 mb-3" />
          </div>

          <h2
            id="titulo-alterar-senha"
            className="text-2xl font-semibold text-center mb-6 select-none cursor-default"
          >
            Alterar Senha
          </h2>

          {/* Senha atual */}
          <label className="block mb-1 font-medium select-none cursor-default">
            Senha atual
          </label>
          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
            required
          />

          {/* Nova senha */}
          <label className="block mt-4 mb-1 font-medium select-none cursor-default">
            Nova senha
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
            required
          />

          {/* Confirmar nova senha */}
          <label className="block mt-4 mb-1 font-medium select-none cursor-default">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
            required
          />

          {/* Mensagens */}
          {mensagem && (
            <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              {mensagem}
            </div>
          )}
          {erro && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {erro}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 p-3 rounded-lg text-white text-sm font-medium transition ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#222B3B] hover:bg-[#1a212f]"
            }`}
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>

          <p className="text-center text-xs mt-6 text-gray-500 select-none cursor-default">
            © 2025. Todos os direitos reservados.
          </p>
        </form>
      </div>
    </NavbarLayout>
  );
}
