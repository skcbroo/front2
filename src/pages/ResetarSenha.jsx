import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetarSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        token,
        novaSenha,
      });
      setSucesso("Senha redefinida com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setErro("Erro ao redefinir senha. Verifique o link ou tente novamente.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white justify-center items-center px-4">
      <div className="bg-white text-gray-800 w-full max-w-md p-8 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img src="/logonova.png" alt="Logo" className="h-12" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">Nova Senha</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nova senha</label>
            <input
              type="password"
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              placeholder="********"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirmar nova senha</label>
            <input
              type="password"
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              placeholder="********"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#222B3B] hover:bg-[#1A202C] text-white font-semibold py-2 rounded transition"
          >
            Redefinir Senha
          </button>

          {sucesso && <p className="text-green-600 text-sm text-center">{sucesso}</p>}
          {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        </form>
      </div>
    </div>
  );
}
