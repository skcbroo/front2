import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarLayout from "../components/Navbar";

export default function DetalhesCredito() {
  const { id } = useParams();
  const [credito, setCredito] = useState(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Número do WhatsApp usado em mais de um lugar
  const numeroEmpresa = "5561996204646";

  useEffect(() => {
    // checa login
    try {
      setIsLoggedIn(!!localStorage.getItem('token'));
    } catch (_) {
      setIsLoggedIn(false);
    }

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
  const precoPorCota = totalCotas ? credito.preco / totalCotas : 0;
  const valorTotal = quantidadeSelecionada * precoPorCota;

  // Lucro projetado percentual
  const lucroProjetado = credito.preco
    ? (credito.valor / credito.preco) * 100
    : 0;

  const confirmarAquisicao = () => {
    if (cotasDisponiveis <= 0) {
      alert("Não há cotas disponíveis para este crédito.");
      return;
    }

    const mensagem = encodeURIComponent(
      `Olá, gostaria de adquirir cotas do crédito judicial:\n\n` +
      ` Processo: ${credito.numeroProcesso}\n` +
      ` Quantidade de cotas: ${quantidadeSelecionada}\n` +
      ` Valor total: ${valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n` +
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
      <div className="flex justify-center items-center min-h-[80vh] px-0">
        <div className="bg-[#EBF4FF] border border-[#CBD5E1] text-[#2D3748] p-4 sm:p-8 rounded-xl shadow-md w-full max-w-none sm:max-w-2xl space-y-4">
          <h1 className="text-2xl font-bold text-center text-[#1A202C]">Detalhes do Crédito</h1>

          <div className="space-y-1 text-sm">
            <div className="space-y-1">
              <p><strong>Expectativa de recebimento:</strong>{' '}
                <span className="text-[#1A202C]">
                  {credito.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </p>
              <p><strong>Valor de aquisição:</strong>{' '}
                {credito.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>

              <p><strong>Lucro projetado:</strong>{' '}
                <span className="text-green-700 font-semibold">
                  {lucroProjetado.toFixed(2)}%
                </span>
              </p>

              {credito.dataEstimadaPagamento && (
                <p><strong>Data estimada de recebimento:</strong>{' '}
                  <span className="text-blue-700">
                    {new Date(credito.dataEstimadaPagamento).toLocaleDateString('pt-BR')}
                  </span>
                </p>
              )}
            </div>

            <hr className="my-4 border-t border-gray-300" />

            <h2 className="text-lg font-semibold text-center text-[#1A202C]">Descrição</h2>

            {/* Só mostra a descrição se estiver logado */}
            {isLoggedIn ? (
              <p className="text-justify">{credito.descricao || '—'}</p>
            ) : (
              <div className="text-sm text-[#1A202C] bg-white/70 border border-[#CBD5E1] rounded-lg p-3">
                Para mais informações, acione nossa equipe.
                {' '}
                <a
                  href={`https://wa.me/${numeroEmpresa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[#2B6CB0] hover:text-[#1A4E86]"
                >
                  Falar no WhatsApp
                </a>
                .
              </div>
            )}
          </div>

          <hr className="border-gray-300" />

          <div className="space-y-1 text-sm">
            <p><strong>Cotas totais:</strong> {totalCotas}</p>
            <p><strong>Cotas disponíveis:</strong> {cotasDisponiveis}</p>
            <p><strong>Preço por cota:</strong> {precoPorCota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

            {typeof credito.cotasDoUsuario === "number" && credito.cotasDoUsuario > 0 && (
              <p className="text-sm text-[#2B6CB0] font-medium mt-2">
                Você já possui <strong>{credito.cotasDoUsuario}</strong> cota(s) deste crédito.
              </p>
            )}
          </div>

          {cotasDisponiveis > 0 ? (
            <>
              <hr className="border-gray-300" />
              <div className="space-y-2">
                <label className="font-medium block" htmlFor="qtd">
                  Quantidade de cotas a adquirir:
                </label>
                <input
                  id="qtd"
                  type="number"
                  min={1}
                  max={cotasDisponiveis}
                  value={quantidadeSelecionada}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-800">
                  Total a pagar:{' '}
                  <strong>
                    {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </p>
              </div>

              <button
                onClick={confirmarAquisicao}
                className="w-full px-6 py-2 rounded-lg bg-[#1D2533] text-white hover:brightness-110 transition font-medium"
              >
                Solicitar aquisição
              </button>
            </>
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
