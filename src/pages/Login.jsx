import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

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
     <NavbarLayout>
      {/* Título oculto para acessibilidade/SEO */}
      <h1 className="sr-only">Midlej Capital — Plataforma de Créditos Judiciais</h1>
       
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white justify-center">
      {/* Lado esquerdo com logo e slogan */}
      <div className="flex-1 flex items-center justify-center p-8 select-none cursor-default">
        <div className="max-w-md text-center">
          <img
            src="/logonova.png"
            alt="Logo"
            className="mx-auto h-28 mb-6"
            draggable="false"
          />
          <p className="text-xl font-semibold mb-1">Transformando sentenças judiciais</p>
          <p className="text-lg text-white opacity-80">em oportunidades reais</p>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div className="flex-1 bg-white text-gray-800 flex items-center justify-center shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 px-8 py-10 select-none cursor-default"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Acesso à Plataforma
          </h2>

          <div>
            <label className="block mb-1 font-medium">E-mail</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 cursor-pointer" />
              Lembrar-me
            </label>
            <Link
              to="/esqueci-senha"
              className="text-[#222B3B] hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#222B3B] hover:bg-[#1a212f] text-white w-full p-2 rounded transition"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="border border-[#222B3B] text-[#222B3B] w-full p-2 rounded hover:bg-[#f0f1f3] transition"
            >
              Cadastrar
            </button>
          </div>

          <div className="text-center text-sm mt-4 text-gray-500">
            © 2025. Todos os direitos reservados.
          </div>
        </form>
      </div>
    </div>
        </NavbarLayout>
  );
}

