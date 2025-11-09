"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: { provider: string; count: number }[];
}

export default function BarChartProviders({ data }: ChartProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm w-full">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        Misconfigurations by Provider
      </h2>

      {/* for recharts, give the chart an explicit height and minWidth */}
      <div className="w-full min-w-0" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="provider" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
