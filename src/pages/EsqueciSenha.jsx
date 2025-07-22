import { useState } from "react";
import axios from "axios";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setMensagem("E-mail enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      setErro("Erro ao enviar e-mail. Verifique o endereço e tente novamente.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white justify-center items-center px-4">
      <div className="bg-white text-gray-800 w-full max-w-md p-8 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img src="/logonova.png" alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Esqueci minha senha</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Seu e-mail</label>
            <input
              type="email"
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#222B3B] hover:bg-[#1A202C] text-white font-semibold py-2 rounded transition"
          >
            Enviar link de redefinição
          </button>

          {mensagem && <p className="text-green-600 text-sm text-center">{mensagem}</p>}
          {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        </form>
      </div>
    </div>
  );
}
