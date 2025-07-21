import { Link } from "react-router-dom";

export default function NavbarLayout({ children }) {
    const role = localStorage.getItem("role");

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2F5871] via-[#304c5f] to-[#2b4759] text-white">
            {/* Navbar aprimorada */}
            <nav className="bg-gradient-to-r from-[#2F5871] via-white to-white shadow-md px-8 py-2 flex items-center justify-between select-none">

                {/* Logo Midlej centralizado verticalmente */}
                <div className="flex items-center gap-3">
                    <img
                        src="/ARTE MIDLEJ SEM SITE.png"
                        alt="Logo Midlej Capital"
                        className="h-12 md:h-14 lg:h-16 object-contain"
                        draggable="false"
                    />
                </div>

                {/* Menu aprimorado */}
                <div className="flex gap-5 text-sm font-medium text-white">
                    <Link to="/creditos" className="hover:text-yellow-300 transition select-none">
                        Créditos
                    </Link>

                    {role === "cliente" && (
                        <Link to="/meus-ativos" className="hover:text-yellow-300 transition select-none">
                            Meus Ativos
                        </Link>
                    )}

                    {role === "admin" && (
                        <>
                            <Link to="/admin/dashboard" className="hover:text-yellow-300 transition select-none">
                                Dashboard
                            </Link>
                            <Link to="/admin/creditos" className="hover:text-yellow-300 transition select-none">
                                Gerenciar Créditos
                            </Link>
                            <Link to="/admin/cotas" className="hover:text-yellow-300 transition select-none">
                                Gerenciar Cotas
                            </Link>
                            <Link to="/admin/usuarios" className="hover:text-yellow-300 transition select-none">
                                Usuários
                            </Link>
                        </>
                    )}

                    <Link to="/" className="hover:text-yellow-300 transition select-none">
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
