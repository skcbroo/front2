import { Link } from "react-router-dom";

export default function NavbarLayout({ children }) {
    const role = localStorage.getItem("role");

    return (
        <div className="min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#2F5871] text-white">
            {/* Navbar branca */}
           <nav className="bg-gradient-to-r from-white via-[#A6B8C7] to-[#2F5871] text-white shadow-md px-6 py-2 flex items-center justify-between select-none">

                <div className="flex items-center gap-2">
                    <img
                        src="/logonova.png"
                        alt="Logo"
                        className="h-14"
                        draggable="false"
                    />
                </div>

                {/* Menu */}
                <div className="flex gap-4 text-sm">
                    <Link to="/creditos" className="hover:underline cursor-pointer select-none">
                        Créditos
                    </Link>

                    {role === "cliente" && (
                        <Link to="/meus-ativos" className="hover:underline cursor-pointer select-none">
                            Meus Ativos
                        </Link>
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
                        </>
                    )}

                    <Link to="/" className="hover:underline cursor-pointer select-none">
                        Sair
                    </Link>
                </div>
            </nav>

            {/* Conteúdo da página */}
            <div className="p-10 min-h-[calc(100vh-80px)]">
                {children}
            </div>
        </div>
    );
}
