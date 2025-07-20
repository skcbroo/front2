//import './App.css'; // ✅ Certifique-se que isso esteja no topo
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Creditos from "./pages/Creditos";
import AdminCreditos from "./pages/AdminCreditos";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminDashboard from "./pages/AdminDashboard";
import DetalhesCredito from "./pages/DetalhesCredito";     
import MeusAtivos from "./pages/MeusAtivos";
import AdminCotas from "./pages/AdminCotas";
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetarSenha from "./pages/ResetarSenha";
import VerificarEmail from "./pages/VerificarEmail";



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/resetar-senha/:token" element={<ResetarSenha />} />
                <Route path="/creditos" element={<Creditos />} />
                <Route path="/admin/creditos" element={<AdminCreditos />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/creditos/:id" element={<DetalhesCredito />} /> 
                <Route path="/meus-ativos" element={<MeusAtivos />} />
                <Route path="/admin/cotas" element={<AdminCotas />} />
                <Route path="/verificar-email/:token" element={<VerificarEmail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
