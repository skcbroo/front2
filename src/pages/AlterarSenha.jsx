import { useState } from "react";
import axios from "axios";
import NavbarLayout from "../components/Navbar";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setMensagem("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/alterar-senha`,
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("Senha alterada com sucesso!");
    } catch (err) {
      setMensagem("Erro ao alterar senha. Verifique a senha atual.");
    }
  }

  return (
    <NavbarLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Alterar Senha</h2>
          <input
            type="password"
            placeholder="Senha atual"
            className="border rounded w-full mb-4 p-2"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nova senha"
            className="border rounded w-full mb-4 p-2"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className="border rounded w-full mb-4 p-2"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Alterar
          </button>
          {mensagem && <p className="mt-4 text-center text-sm">{mensagem}</p>}
        </form>
      </div>
    </NavbarLayout>
  );
}
