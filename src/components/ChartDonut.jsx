import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartDonut = ({ data = [] }) => {
  // 🔹 Datos por defecto si no se pasa ningún prop
  const defaultData = [
    { name: "Regional Norte", value: 12 },
    { name: "Regional Centro", value: 8 },
    { name: "Regional Sur", value: 15 },
    { name: "Lima Metropolitana", value: 10 },
  ];

  const chartData = data.length ? data : defaultData;
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Distribución por regiones
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDonut;
