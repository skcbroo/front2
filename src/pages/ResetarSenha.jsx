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
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white justify-center">
      <div className="flex-1 flex items-center justify-center p-8 select-none cursor-default">
        <div className="max-w-md text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto h-24 mb-6" draggable="false" />
          <h1 className="text-4xl font-bold mb-4">Midlej Capital</h1>
          <p className="text-lg text-blue-100">Digite sua nova senha abaixo</p>
        </div>
      </div>

      <div className="flex-1 bg-white text-gray-800 flex items-center justify-center shadow-xl">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 px-8 py-10 select-none cursor-default">
          <h2 className="text-2xl font-semibold mb-4 text-center">Nova senha</h2>

          <div>
            <label className="block mb-1 font-medium">Nova senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text select-text"
              placeholder="********"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirmar nova senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text select-text"
              placeholder="********"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded cursor-pointer select-none focus:outline-none"
          >
            Redefinir senha
          </button>

          {sucesso && <p className="text-green-600 text-sm text-center">{sucesso}</p>}
          {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        </form>
      </div>
    </div>
  );
}
