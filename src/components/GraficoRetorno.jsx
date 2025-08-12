import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraficoRetorno({ dados }) {
  if (!dados || dados.length === 0) return null;

  const maxValor = Math.max(...dados.map((d) => d.valor));
  const tickStep = maxValor > 100000 ? 20000 : 10000;

  const ticks = [];
  for (let i = 0; i <= Math.ceil(maxValor / tickStep) * tickStep; i += tickStep) {
    ticks.push(i);
  }

  return (
    <div className="bg-[#EDF2F7] rounded-xl p-6 shadow-md max-w-6xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-center text-[#2D3748] mb-4 select-none cursor-default">
        Retorno Projetado
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dados}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12 }}
            stroke="#4A5568"
          />
          <YAxis
            ticks={ticks}
            tickFormatter={(v) =>
              v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            }
            stroke="#4A5568"
          />
          <Tooltip
            formatter={(v) =>
              v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            }
            labelStyle={{ fontWeight: "bold", color: "#2D3748" }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#007BFF"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
