import { Link } from "react-router-dom";

export default function NavbarLayout({ children }) {
    const role = localStorage.getItem("role");

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2F5871] via-[#2e4e63] to-[#243b4e] text-white font-sans">
            {/* Navbar moderna flutuante */}
            <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 fixed top-0 left-0 w-full z-50 px-8 py-3 flex items-center justify-between shadow-sm">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/logonova.png"
                        alt="Midlej Capital"
                        className="h-10 md:h-12 object-contain"
                        draggable="false"
                    />
                </div>

                {/* Menu */}
                <div className="flex gap-6 text-sm font-medium">
                    <Link to="/creditos" className="hover:text-yellow-300 transition duration-200">Créditos</Link>

                    {role === "cliente" && (
                        <Link to="/meus-ativos" className="hover:text-yellow-300 transition duration-200">
                            Meus Ativos
                        </Link>
                    )}

                    {role === "admin" && (
                        <>
                            <Link to="/admin/dashboard" className="hover:text-yellow-300 transition duration-200">
                                Dashboard
                            </Link>
                            <Link to="/admin/creditos" className="hover:text-yellow-300 transition duration-200">
                                Gerenciar Créditos
                            </Link>
                            <Link to="/admin/cotas" className="hover:text-yellow-300 transition duration-200">
                                Gerenciar Cotas
                            </Link>
                            <Link to="/admin/usuarios" className="hover:text-yellow-300 transition duration-200">
                                Usuários
                            </Link>
                        </>
                    )}

                    <Link to="/" className="hover:text-red-400 transition duration-200">Sair</Link>
                </div>
            </nav>

            {/* Espaço compensando navbar fixa */}
            <div className="pt-20 px-6 md:px-10 pb-10 min-h-[calc(100vh-80px)]">
                {children}
            </div>
        </div>
    );
}
