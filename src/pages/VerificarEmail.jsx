import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerificarEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verificando"); // verificando | sucesso | erro

  useEffect(() => {
    async function verificar() {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verificar-email/${token}`);
        setStatus("sucesso");
        setTimeout(() => navigate("/"), 3000); // Redireciona para login após 3s
      } catch (err) {
        setStatus("erro");
      }
    }

    verificar();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white justify-center items-center">
      <div className="text-center px-8 max-w-md">
        <img src="/logo.png" alt="Logo" className="mx-auto h-20 mb-6" />

        {status === "verificando" && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Verificando seu e-mail...</h2>
            <p>Por favor, aguarde alguns segundos.</p>
          </div>
        )}

        {status === "sucesso" && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-green-300">Verificado com sucesso ✅</h2>
            <p>Você será redirecionado para o login em instantes.</p>
          </div>
        )}

        {status === "erro" && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-red-300">Token inválido ou expirado ❌</h2>
            <p>O link de verificação pode ter expirado. Tente se cadastrar novamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
