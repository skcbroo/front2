import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavbarLayout({ children }) {
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#283142] to-[#1e2736] text-white font-sans">
      {/* Navbar com degradê do branco para a cor */}
      <nav
        className="fixed top-0 left-0 w-full z-50 h-16 backdrop-blur-md border-b border-transparent"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.85), rgba(22, 32, 43, 0.85))`,
          boxShadow: "0 2px 8px rgb(0 0 0 / 0.3)",
        }}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center px-4 md:px-12">
          {/* Logo alinhada quase no começo, com mínimo padding */}
          <div className="flex-shrink-0 mr-10">
            <img
              src="/logonova.png"
              alt="Midlej Capital"
              className="h-10 md:h-12 object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Menu Links (exceto Sair) */}
          <div className="hidden sm:flex gap-8 font-semibold flex-1">
            <Link
              to="/creditos"
              className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              Créditos
            </Link>

            {role === "cliente" && (
              <Link
                to="/meus-ativos"
                className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                Meus Ativos
              </Link>
            )}

            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/creditos"
                  className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  Gerenciar Créditos
                </Link>
                <Link
                  to="/admin/cotas"
                  className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  Gerenciar Cotas
                </Link>
                <Link
                  to="/admin/usuarios"
                  className="hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  Usuários
                </Link>
              </>
            )}
          </div>

          {/* Sair alinhado quase no fim da navbar */}
          <div className="hidden sm:flex ml-auto">
            <Link
              to="/"
              className="hover:text-red-600 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
            >
              Sair
            </Link>
          </div>

          {/* Botão Hamburguer Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ml-auto"
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
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12" // X icon
                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="sm:hidden bg-[#16202bee] backdrop-blur-md border-t border-yellow-400/30">
            <nav className="flex flex-col gap-4 p-6 text-base font-semibold">
              <Link
                to="/creditos"
                className="hover:text-yellow-400 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Créditos
              </Link>

              {role === "cliente" && (
                <Link
                  to="/meus-ativos"
                  className="hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Meus Ativos
                </Link>
              )}

              {role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/creditos"
                    className="hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Gerenciar Créditos
                  </Link>
                  <Link
                    to="/admin/cotas"
                    className="hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Gerenciar Cotas
                  </Link>
                  <Link
                    to="/admin/usuarios"
                    className="hover:text-yellow-400 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Usuários
                  </Link>
                </>
              )}

              <Link
                to="/"
                className="hover:text-red-500 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Sair
              </Link>
            </nav>
          </div>
        )}
      </nav>

      {/* Espaçamento compensando navbar */}
      <main className="pt-16 px-6 md:px-12 pb-12 min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#283142] to-[#1e2736]">
        {children}
      </main>
    </div>
  );
}
