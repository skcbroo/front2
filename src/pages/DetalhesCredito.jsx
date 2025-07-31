import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarLayout from "../components/Navbar";

export default function DetalhesCredito() {
  const { id } = useParams();
  const [credito, setCredito] = useState(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${import.meta.env.VITE_API_URL}/api/creditos/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async res => {
        const json = await res.json();
        if (!res.ok) return setCredito(null);
        setCredito(json);
      })
      .catch(() => setCredito(null));
  }, [id]);

  if (!credito) {
    return (
      <NavbarLayout>
        <p className="text-center mt-10 text-gray-800 select-none cursor-default">Carregando...</p>
      </NavbarLayout>
    );
  }

  const desagio = 1 - (credito.preco / credito.valor);
  const totalCotas = credito.quantidadeCotas || 0;
  const cotasAdquiridas = credito.cotasAdquiridas ?? 0;
  const cotasDisponiveis = totalCotas - cotasAdquiridas;
  const precoPorCota = credito.preco / totalCotas;
  const valorTotal = quantidadeSelecionada * precoPorCota;

  const confirmarAquisicao = () => {
    if (cotasDisponiveis <= 0) {
      alert("Não há cotas disponíveis para este crédito.");
      return;
    }

    const numeroEmpresa = "5561996204646";
    const mensagem = encodeURIComponent(
      `Olá, gostaria de adquirir cotas do crédito judicial:\n\n` +
      `Processo: ${credito.numeroProcesso}\n` +
      `Quantidade de cotas: ${quantidadeSelecionada}\n` +
      `Valor total: ${valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n` +
      `Aguardo o retorno. Obrigado!`
    );

    const link = `https://wa.me/${numeroEmpresa}?text=${mensagem}`;
    window.open(link, "_blank");
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > cotasDisponiveis) {
      setQuantidadeSelecionada(cotasDisponiveis);
    } else if (val < 1) {
      setQuantidadeSelecionada(1);
    } else {
      setQuantidadeSelecionada(val);
    }
  };

  return (
    <NavbarLayout>
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className="bg-[#EBF4FF] border border-[#CBD5E1] text-[#2D3748] p-6 rounded-xl shadow-md w-full max-w-3xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1 select-none cursor-default">Detalhes do Crédito Judicial</h1>
            <p className="text-sm text-gray-600 select-none cursor-default">{credito.numeroProcesso}</p>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p><span className="font-semibold">Valor estimado de recebimento:</span><br />
                {credito.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p><span className="font-semibold">Valor de aquisição:</span><br />
                {credito.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p><span className="font-semibold">Deságio:</span><br />
                {(desagio * 100).toFixed(2)}%
              </p>
              <p><span className="font-semibold">Área:</span><br />{credito.area}</p>
              <p><span className="font-semibold">Fase:</span><br />{credito.fase}</p>
              <p><span className="font-semibold">Matéria:</span><br />{credito.materia}</p>
            </div>

            <div className="space-y-1">
              <p><span className="font-semibold">Cotas totais:</span><br />{totalCotas}</p>
              <p><span className="font-semibold">Cotas adquiridas:</span><br />{cotasAdquiridas}</p>
              <p><span className="font-semibold">Cotas disponíveis:</span><br />{cotasDisponiveis}</p>
              <p><span className="font-semibold">Preço por cota:</span><br />
                {precoPorCota.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>

              {typeof credito.cotasDoUsuario === "number" && credito.cotasDoUsuario > 0 && (
                <p className="font-medium text-[#2B6CB0] mt-2">
                  Você possui {credito.cotasDoUsuario} cota(s) deste crédito.
                </p>
              )}
            </div>
          </div>

          {/* Descrição */}
          {credito.descricao && (
            <div>
              <hr className="border-gray-300 my-3" />
              <h2 className="text-lg font-semibold text-[#2B6CB0] mb-1">Descrição</h2>
              <p className="text-justify text-sm text-gray-700">{credito.descricao}</p>
            </div>
          )}

          {/* Aquisição */}
          {cotasDisponiveis > 0 ? (
            <div className="space-y-3">
              <label htmlFor="qtd" className="block font-medium text-sm">Quantidade de cotas a adquirir:</label>
              <input
                id="qtd"
                type="number"
                min={1}
                max={cotasDisponiveis}
                value={quantidadeSelecionada}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-800">
                Total a pagar: <strong>{valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
              </p>
              <button
                onClick={confirmarAquisicao}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Confirmar solicitação via WhatsApp
              </button>
            </div>
          ) : (
            <p className="text-center text-red-600 font-semibold mt-4">
              Este crédito está com todas as cotas adquiridas.
            </p>
          )}
        </div>
      </div>
    </NavbarLayout>
  );
}
