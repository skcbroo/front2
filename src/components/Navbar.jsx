import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavbarLayout({ children }) {
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#283e51] via-[#485563] to-[#2f5871] text-white font-sans">
      {/* Navbar glassmorphism */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-[1100px] w-[95vw] rounded-2xl bg-white/20 shadow-2xl backdrop-blur-lg px-8 py-3 flex items-center justify-between border border-white/20">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logonova.png"
            alt="Midlej Capital"
            className="h-10 object-contain drop-shadow"
            draggable="false"
          />
        </div>
        
        {/* Hamburger menu (mobile only) */}
        <button
          className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
            />
          </svg>
        </button>

        {/* Menu (desktop & mobile) */}
        <div
          className={`flex-col sm:flex-row sm:flex gap-6 text-[15px] font-medium items-center transition-all duration-300 
                      ${menuOpen ? "flex bg-[#203344]/80 absolute top-16 right-8 rounded-xl px-6 py-5 shadow-lg" : "hidden sm:flex"}`}
        >
          <Link 
            to="/creditos"
            className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
          >
            Créditos
          </Link>
          {role === "cliente" && (
            <Link
              to="/meus-ativos"
              className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
            >
              Meus Ativos
            </Link>
          )}
          {role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/creditos"
                className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
              >
                Gerenciar Créditos
              </Link>
              <Link
                to="/admin/cotas"
                className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
              >
                Gerenciar Cotas
              </Link>
              <Link
                to="/admin/usuarios"
                className="hover:text-yellow-300 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
              >
                Usuários
              </Link>
            </>
          )}
          <Link
            to="/"
            className="hover:text-red-400 transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/10"
          >
            Sair
          </Link>
        </div>
      </nav>
      
      {/* Espaçamento compensando navbar flutuante */}
      <div className="pt-28 px-6 md:px-10 pb-10 min-h-[calc(100vh-112px)] transition-all duration-200">
        {children}
      </div>
    </div>
  );
}
