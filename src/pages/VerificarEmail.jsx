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
        setTimeout(() => navigate("/"), 3000); // Redireciona após 3s
      } catch (err) {
        setStatus("erro");
      }
    }

    verificar();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-white via-[#A6B8C7] to-[#222B3B] justify-center items-center px-4">
      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <img src="/logonova.png" alt="Logo" className="mx-auto h-14 mb-6" />

        {status === "verificando" && (
          <>
            <h2 className="text-2xl font-semibold mb-2">Verificando seu e-mail...</h2>
            <p className="text-gray-600">Por favor, aguarde alguns segundos.</p>
          </>
        )}

        {status === "sucesso" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-green-600">E-mail verificado com sucesso ✅</h2>
            <p className="text-gray-700">Você será redirecionado para o login.</p>
          </>
        )}

        {status === "erro" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Token inválido ou expirado ❌</h2>
            <p className="text-gray-700">Tente se cadastrar novamente ou solicite novo link.</p>
          </>
        )}
      </div>
    </div>
  );
}
