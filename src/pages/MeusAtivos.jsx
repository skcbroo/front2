import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NavbarLayout from "../components/Navbar";

export default function MeusAtivos() {
  const [cotas, setCotas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const id = decoded.id;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/cotas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCotas(res.data))
      .catch(() => setErro("Erro ao carregar ativos"));
  }, []);

  return (
    <NavbarLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 select-none cursor-default">
          Meus Ativos
        </h2>

        {erro && (
          <p className="text-red-600 font-medium mb-4 select-none">
            {erro}
          </p>
        )}

        {cotas.length === 0 ? (
          <p className="text-gray-600 select-none">
            Você ainda não possui cotas adquiridas.
          </p>
        ) : (
          <ul className="space-y-4">
            {cotas.map((cota) => (
              <li
                key={cota.id}
                className="bg-white border rounded-xl p-4 shadow-md select-none cursor-default"
              >
                <p>
                  <strong>📚 Área:</strong> {cota.creditoJudicial.area}
                </p>
                <p>
                  <strong>📝 Matéria:</strong> {cota.creditoJudicial.materia}
                </p>
                <p>
                  <strong>⚖️ Fase:</strong> {cota.creditoJudicial.fase}
                </p>
                <p>
                  <strong>🔢 Quantidade de cotas:</strong> {cota.quantidade}
                </p>
                <p>
                  <strong>💰 Valor do crédito:</strong>{" "}
                  {cota.creditoJudicial.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </NavbarLayout>
  );
}
