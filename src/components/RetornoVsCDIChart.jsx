import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useCDI from "../hooks/useCDI";

export default function RetornoVsCDIChart() {
  const { taxaCDI, loading } = useCDI();

  if (loading) return <p>Carregando CDI...</p>;
  if (!taxaCDI) return <p>Erro ao carregar CDI</p>;

  const taxaMensal = Math.pow(1 + taxaCDI / 100, 1 / 12) - 1;

  const data = Array.from({ length: 6 }, (_, i) => {
    const cdiAcumulado = ((1 + taxaMensal) ** (i + 1) - 1) * 100;
    const retornoEsperado = cdiAcumulado * 1.05; // 5% acima do CDI, exemplo

    return {
      mes: `M${i + 1}`,
      retorno: retornoEsperado,
      cdi: cdiAcumulado.toFixed(2),
    };
  });

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Retorno Esperado vs CDI</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="retorno" stroke="#8884d8" strokeWidth={2} name="Retorno Esperado" />
          <Line type="monotone" dataKey="cdi" stroke="#82ca9d" strokeWidth={2} name="CDI" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
