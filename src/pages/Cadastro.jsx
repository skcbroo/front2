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

    const partesNome = nome.trim().split(" ");
    if (partesNome.length < 2) {
      setErro("Por favor, insira seu nome completo.");
      return;
    }

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

      setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      setErro("Erro ao cadastrar. E-mail já existe?");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white justify-center items-center px-4">
      <div className="bg-white text-gray-800 w-full max-w-md p-8 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img src="/logonova.png" alt="Logo Midlej" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Criar Conta</h2>

        {erro && <p className="text-red-600 text-sm mb-2 text-center">{erro}</p>}
        {mensagem && <p className="text-green-600 text-sm mb-2 text-center">{mensagem}</p>}

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome completo</label>
            <input
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirmar senha</label>
            <input
              className="w-full p-2 border border-[#CBD5E1] rounded bg-[#F9FAFB] text-gray-800"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#222B3B] hover:bg-[#1A202C] text-white font-semibold py-2 rounded transition"
          >
            Criar Conta
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Já possui conta?{" "}
            <Link to="/" className="text-[#222B3B] hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
