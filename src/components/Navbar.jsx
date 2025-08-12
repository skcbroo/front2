import { Link, useNavigate } from "react-router-dom";

export default function NavbarLayout({ children }) {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        navigate("/"); // Redireciona para a página inicial
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] text-white shadow-md px-6 py-2 flex items-center justify-between select-none">

                {/* Logo clicável */}
                <div className="flex items-center gap-2">
                    <Link to="/">
                        <img
                            src="/logonova.png"
                            alt="Logo"
                            className="h-14 cursor-pointer"
                            draggable="false"
                        />
                    </Link>
                </div>

                {/* Menu */}
                <div className="flex gap-4 text-sm">
                    <Link to="/creditos" className="hover:underline cursor-pointer select-none">
                        Créditos
                    </Link>

                    {role ? (
  <>
    {role === "cliente" && (
      <>
        <Link to="/meus-ativos" className="hover:underline cursor-pointer select-none">
          Meus Ativos
        </Link>
        <Link to="/alterar-senha" className="hover:underline cursor-pointer select-none">
          Alterar Senha
        </Link>
      </>
    )}

    {role === "admin" && (
      <>
        <Link to="/admin/dashboard" className="hover:underline cursor-pointer select-none">
          Dashboard
        </Link>
        <Link to="/admin/creditos" className="hover:underline cursor-pointer select-none">
          Gerenciar Créditos
        </Link>
        <Link to="/admin/cotas" className="hover:underline cursor-pointer select-none">
          Gerenciar Cotas
        </Link>
        <Link to="/admin/usuarios" className="hover:underline cursor-pointer select-none">
          Usuários
        </Link>
        <Link to="/alterar-senha" className="hover:underline cursor-pointer select-none">
          Alterar Senha
        </Link>
      </>
    )}

    <button
      onClick={handleLogout}
      className="hover:underline cursor-pointer select-none bg-transparent border-none text-white"
    >
      Sair
    </button>
  </>
) : (
  <Link to="/login" className="hover:underline cursor-pointer select-none">
    Entrar
  </Link>
)}

                </div>
            </nav>

            {/* Conteúdo da página */}
            <div className="p-10 min-h-[calc(100vh-80px)]">
                {children}
            </div>
        </div>
    );
}

