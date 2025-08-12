import { useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (novaSenha !== confirmarSenha) {
      setErro("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/alterar-senha`,
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      setErro("Erro ao alterar senha. Verifique se a senha atual está correta.");
    }
  }

  return (
    <NavbarLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-[#F7FAFC]">
        <form
          onSubmit={handleSubmit}
          className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl shadow-md px-8 py-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-[#2D3748] mb-6 text-center select-none cursor-default">
            Alterar Senha
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nova senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all text-sm font-medium"
          >
            Salvar nova senha
          </button>

          {mensagem && (
            <p className="mt-4 text-center text-green-600 text-sm">{mensagem}</p>
          )}
          {erro && (
            <p className="mt-4 text-center text-red-600 text-sm">{erro}</p>
          )}
        </form>
      </div>
    </NavbarLayout>
  );
}
