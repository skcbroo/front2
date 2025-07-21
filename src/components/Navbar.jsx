import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavbarLayout({ children }) {
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2a38] to-[#283849] text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#16202bdd] backdrop-blur-sm shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16">
          {/* Logo */}
          <div>
            <img
              src="/logonova.png"
              alt="Midlej Capital"
              className="h-10 md:h-12 object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex gap-8 text-sm font-semibold">
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

            <Link
              to="/"
              className="hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            >
              Sair
            </Link>
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

        {/* Mobile Menu */}
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

      {/* Compensar navbar */}
      <main className="pt-16 px-6 md:px-12 pb-12 min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#283142] to-[#1e2736]">
        {children}
      </main>
    </div>
  );
}
