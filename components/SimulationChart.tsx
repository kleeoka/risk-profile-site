import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SimulationChartProps {
  data: { year: number; value: number }[];
}

export default function SimulationChart({ data }: SimulationChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-2xl p-4 shadow">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(val) => `$${val}`} />
          <Tooltip formatter={(value: number): string => `$${value.toFixed(2)}`} /> 
          {/* ✅ Fixed: explicitly typed return */}
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
