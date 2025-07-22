import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        senha,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/creditos");
    } catch (err) {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white justify-center">
      {/* Lado esquerdo com logo e descrição */}
      <div className="flex-1 flex items-center justify-center p-8 select-none cursor-default">
        <div className="max-w-md text-center">
          <img
            src="/logonova.png"
            alt="Logo"
            className="mx-auto h-24 mb-6"
            draggable="false"
          />
          <p className="text-lg text-white/90">
            Transformando sentenças judiciais em oportunidades reais
          </p>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div className="flex-1 bg-white text-gray-800 flex items-center justify-center shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-5 px-8 py-12 select-none cursor-default"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Acesso à Plataforma
          </h2>

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 cursor-pointer" />
              Lembrar-me
            </label>
            <Link to="/esqueci-senha" className="text-green-600 hover:underline">
              Esqueci a senha
            </Link>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded transition"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="border border-green-600 text-green-600 w-full p-2 rounded hover:bg-green-50 transition"
            >
              Cadastrar
            </button>
          </div>

          <p className="text-center text-sm mt-6 text-gray-400">
            © {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </form>
      </div>
    </div>
  );
}
