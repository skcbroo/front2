// src/pages/Home.jsx
import { Link } from "react-router-dom";
import NavbarLayout from "../components/Navbar";

export default function Home() {
  return (
    <NavbarLayout>
      {/* Título oculto para acessibilidade/SEO */}
      <h1 className="sr-only">Midlej Capital — Plataforma de Créditos Judiciais</h1>

      {/* HERO */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="rounded-xl bg-[#EBF4FF] border border-[#CBD5E1] px-6 py-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide select-none cursor-default">
                Soluções em créditos judiciais
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mt-1">
                Investimento seguro, acompanhamento transparente
              </h2>
              <p className="text-[#4A5568] mt-3 select-none cursor-default">
                Conectamos oportunidades de créditos judiciais a investidores,
                com curadoria, informações claras e um painel simples para
                acompanhar cada etapa até o recebimento.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/creditos"
                  className="inline-block bg-[#2B6CB0] text-white font-semibold rounded-lg px-5 py-2 hover:opacity-90 transition"
                >
                  Ver créditos disponíveis
                </Link>
                <Link
                  to="/contato"
                  className="inline-block bg-white text-[#2B6CB0] border border-[#CBD5E1] font-semibold rounded-lg px-5 py-2 hover:bg-[#F7FAFC] transition"
                >
                  Fale com a equipe
                </Link>
              </div>
            </div>

            {/* Imagem */}
            <div className="flex justify-center md:justify-end">
              <img
                src="/banner-sobe-burtin.jpg"
                alt="Reunião de negócios"
                className="w-48 md:w-72 lg:w-96 rounded-lg object-cover select-none"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="max-w-6xl mx-auto mb-8">
        <h3 className="text-xl font-bold text-center mb-4 select-none cursor-default">
          Por que escolher a Midlej Capital?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardHome
            titulo="Curadoria técnica"
            texto="Analisamos origem, fase processual, riscos e documentação para listar somente créditos com informações claras e objetivas."
          />
          <CardHome
            titulo="Transparência total"
            texto="Acompanhe status, deságio, prazos estimados e histórico — tudo em um só lugar, com linguagem direta."
          />
          <CardHome
            titulo="Atendimento próximo"
            texto="Suporte humano e consultivo para tirar dúvidas, simular cenários e apoiar sua decisão de investimento."
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto mb-8">
        <h3 className="text-xl font-bold text-center mb-4 select-none cursor-default">
          Como funciona
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepHome
            numero="1"
            titulo="Seleção de oportunidades"
            texto="Publicamos créditos com informações fundamentais: valor estimado, deságio, fase e quantidade de cotas."
          />
          <StepHome
            numero="2"
            titulo="Análise e reserva"
            texto="Você avalia os detalhes e manifesta interesse. Nosso time auxilia com dúvidas e viabilidade."
          />
          <StepHome
            numero="3"
            titulo="Acompanhamento e recebimento"
            texto="Monitoramos o andamento e notificamos marcos importantes até a liquidação."
          />
        </div>
      </section>

      {/* CHAMADA PARA AÇÃO */}
      <section className="max-w-6xl mx-auto mb-8">
        <div className="rounded-xl bg-[#EBF4FF] border border-[#CBD5E1] px-6 py-6 shadow-md text-center">
          <h3 className="text-lg md:text-xl font-bold text-[#1A202C]">
            Pronto para conhecer as oportunidades?
          </h3>
          <p className="text-[#4A5568] mt-1 select-none cursor-default">
            Explore a lista de créditos ou fale com nosso time para saber mais.
          </p>

          <div className="mt-4 flex gap-3 justify-center">
            <Link
              to="/creditos"
              className="inline-block bg-[#2B6CB0] text-white font-semibold rounded-lg px-5 py-2 hover:opacity-90 transition"
            >
              Acessar créditos
            </Link>
            <Link
              to="/contato"
              className="inline-block bg-white text-[#2B6CB0] border border-[#CBD5E1] font-semibold rounded-lg px-5 py-2 hover:bg-[#F7FAFC] transition"
            >
              Entrar em contato
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto mb-10">
        <h3 className="text-xl font-bold text-center mb-4 select-none cursor-default">
          Perguntas frequentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FaqHome
            q="O que é um crédito judicial?"
            a="É um direito de receber um valor decorrente de uma ação judicial. Na plataforma, exibimos informações essenciais para avaliação do investidor."
          />
          <FaqHome
            q="Posso acessar os créditos sem cadastro?"
            a="A listagem é pública, mas para reservar/seguir adiante será necessário cadastro e verificação."
          />
          <FaqHome
            q="Como é calculado o deságio?"
            a="O deságio é a relação entre o preço de aquisição e o valor do crédito. Exibimos isso claramente em cada card."
          />
          <FaqHome
            q="Existe suporte para dúvidas?"
            a="Sim. Nosso atendimento está disponível para orientar e esclarecer qualquer ponto antes da decisão."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A202C] text-gray-200 text-sm mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <p>
            A MIDLEJ Capital detém uma plataforma digital que atua como correspondente Bancário para facilitar
            o processo de contratação de empréstimos. A MIDLEJ Capital não é instituição financeira e não
            fornece crédito ao mercado. A MIDLEJ Capital atua como Correspondente Bancário, seguimos as
            diretrizes da Resolução CMN Nº 4.935 do Banco Central do Brasil. A taxa de juros praticada no
            produto de crédito pessoal pode variar de 15,80% a 17,90% a.m. (481,44% a 621,38% a.a.). Nossa
            empresa tem o compromisso de total transparência com nossos clientes. Antes de iniciar o
            preenchimento de uma proposta, será exibido de forma clara: a taxa de juros utilizada, tarifas
            aplicáveis, impostos (IOF) e o custo efetivo total (CET).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-bold">MIDLEJ</h4>
              <p>Capital</p>
              <p className="mt-2">© 2023 by Midlej Tecnology.</p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Endereço:</span> QI 19, Conjunto 04, 1º, Lago Sul, Brasília/DF.
              </p>
              <p>
                <span className="font-semibold">Email:</span> contato@midlejcapital.com.br
              </p>
              <p>
                <span className="font-semibold">Telefone:</span> 61 9 9820-4846
              </p>
            </div>
          </div>
        </div>
      </footer>
    </NavbarLayout>
  );
}

function CardHome({ titulo, texto }) {
  return (
    <div className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl px-6 py-5 shadow-md text-[#2D3748]">
      <h4 className="text-lg font-bold text-[#1A202C] mb-1">{titulo}</h4>
      <p className="text-sm text-[#4A5568]">{texto}</p>
    </div>
  );
}

function StepHome({ numero, titulo, texto }) {
  return (
    <div className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl px-6 py-5 shadow-md text-[#2D3748]">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold mb-2">
        {numero}
      </div>
      <h4 className="text-lg font-bold text-[#1A202C] mb-1">{titulo}</h4>
      <p className="text-sm text-[#4A5568]">{texto}</p>
    </div>
  );
}

function FaqHome({ q, a }) {
  return (
    <div className="bg-[#EBF4FF] border border-[#CBD5E1] rounded-xl px-6 py-5 shadow-md">
      <p className="font-semibold text-[#1A202C]">{q}</p>
      <p className="text-sm text-[#4A5568] mt-1">{a}</p>
    </div>
  );
}
