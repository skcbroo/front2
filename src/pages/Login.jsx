import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NavbarLayout from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("login_email");
    if (saved) {
      setEmail(saved);
      setLembrar(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, senha }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (lembrar) localStorage.setItem("login_email", email);
      else localStorage.removeItem("login_email");

      navigate("/meus-ativos");
    } catch {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <NavbarLayout>
      <h1 className="sr-only">Midlej Capital — Plataforma de Créditos Judiciais</h1>

      {/* tela inteira com o card centralizado */}
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl text-gray-800 rounded-2xl shadow-2xl border border-white/40 px-8 py-10"
          aria-labelledby="titulo-login"
        >
          {/* logo opcional no topo do card */}
          <div className="mb-6 text-center select-none cursor-default">
            <img src="/logonova.png" alt="Midlej Capital" className="mx-auto h-16 mb-3" />
          </div>

          <h2
            id="titulo-login"
            className="text-2xl font-semibold text-center mb-6 select-none cursor-default"
          >
            Acesso à Plataforma
          </h2>

          {/* E-mail */}
          <label className="block mb-1 font-medium select-none cursor-default" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222B3B]"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {/* Senha */}
          <label className="block mt-4 mb-1 font-medium select-none cursor-default" htmlFor="senha">
            Senha
          </label>
          <div className="relative">
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222B3B] pr-12"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3l18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.58 10.58a3 3 0 104.24 4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.88 4.24A10.94 10.94 0 0121 12a10.94 10.94 0 01-2.1 3.37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.61 6.61A10.94 10.94 0 003 12c2 3.5 5.5 6 9 6 1.01 0 1.99-.15 2.9-.44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {/* Lembrar + Esqueci */}
          <div className="flex justify-between items-center text-sm mt-3">
            <label className="flex items-center select-none cursor-default">
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
              />
              Lembrar-me
            </label>
            <Link to="/esqueci-senha" className="text-[#222B3B] hover:underline">
              Esqueci a senha
            </Link>
          </div>

          {/* Erro */}
          {erro && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {erro}
            </div>
          )}

          {/* Ações */}
         <div className="flex justify-center mt-6">
  <button
    type="submit"
    disabled={loading}
    className={`w-1/2 p-3 rounded-lg text-white transition ${
      loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#222B3B] hover:bg-[#1a212f]"
    }`}
  >
    {loading ? "Entrando..." : "Entrar"}
  </button>
</div>


          <p className="text-center text-xs mt-6 text-gray-500 select-none cursor-default">
            © 2025. Todos os direitos reservados.
          </p>
        </form>
      </div>
    </NavbarLayout>
  );
}



