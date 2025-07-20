import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        nome,
        email,
        senha,
      });

      setMensagem(`Verifique seu e-mail para ativar o acesso.`);
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      // Opcional: navegar após X segundos
       setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      setErro("Erro ao cadastrar. E-mail já existe?");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-gray-800">
          <div className="flex justify-center mb-6">
            <img src="/logo2.png" alt="Logo Midlej" className="h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>

          {erro && <p className="text-red-600 mb-2 text-sm text-center">{erro}</p>}
          {mensagem && <p className="text-green-600 mb-2 text-sm text-center">{mensagem}</p>}

          <form onSubmit={handleCadastro} className="space-y-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Criar Conta
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Já possui conta?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
