import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartDonut = ({ data = [] }) => {
  const COLORS = ["#00E0A1", "#3B82F6", "#FACC15"];
  const chartData = data.length ? data : [
    { name: "1er Árbitro", value: 0 },
    { name: "2do Árbitro", value: 0 },
    { name: "Planilla", value: 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Distribución por rol
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            label
          >
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
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
