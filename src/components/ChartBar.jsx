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

const ChartBar = () => {
  // 🔹 Datos de ejemplo (luego se reemplazarán por datos reales desde Firebase)
  const data = [
    { name: "Ene", partidos: 14 },
    { name: "Feb", partidos: 10 },
    { name: "Mar", partidos: 18 },
    { name: "Abr", partidos: 9 },
    { name: "May", partidos: 22 },
    { name: "Jun", partidos: 17 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Partidos arbitrados por mes
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="partidos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBar;
