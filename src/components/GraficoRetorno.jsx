import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dadosGrafico = [
  { mes: "Jan", valor: 2.3 },
  { mes: "Fev", valor: 3.1 },
  { mes: "Mar", valor: 4.8 },
  { mes: "Abr", valor: 5.2 },
  { mes: "Mai", valor: 6.0 },
  { mes: "Jun", valor: 6.7 },
];

export default function GraficoRetorno() {
  return (
    <div className="mt-10 bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">Gráfico de Retorno Simulado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#8884d8"
            strokeWidth={2}
            name="Retorno"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
