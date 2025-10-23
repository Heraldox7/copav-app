import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartBar = ({ data = [] }) => {
  // Si no hay datos se muestra un placeholder vacío para mantener diseño
  const chartData = data.length ? data : [];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Partidos arbitrados por mes
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBar;
