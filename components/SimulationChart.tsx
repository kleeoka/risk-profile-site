// components/SimulationChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SimulationData {
  year: number;
  value: number;
}

interface SimulationChartProps {
  data: SimulationData[];
}

export default function SimulationChart({ data }: SimulationChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-2xl p-4 shadow">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(val) => `$${val}`} />
          <Tooltip
            formatter={(value: number) => [value, `$${value.toFixed(2)}`]} 
            // ✅ Returns [number, string] tuple to satisfy Recharts Formatter type
          />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
