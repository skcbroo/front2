import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
      .catch((err) => setErro("Erro ao carregar ativos"));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meus Ativos</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      {cotas.length === 0 ? (
        <p>Você ainda não possui cotas adquiridas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cotas.map((cota) => (
            <div key={cota.id} className="border p-4 rounded shadow">
              <p><strong>Área:</strong> {cota.creditoJudicial.area}</p>
              <p><strong>Matéria:</strong> {cota.creditoJudicial.materia}</p>
              <p><strong>Quantidade de cotas:</strong> {cota.quantidade}</p>
              <p><strong>Fase:</strong> {cota.creditoJudicial.fase}</p>
              <p><strong>Valor do crédito:</strong> R$ {cota.creditoJudicial.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
