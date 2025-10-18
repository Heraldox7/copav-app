import React from "react";

/**
 * Componente de tarjeta estadística reutilizable.
 * Props:
 * - title: título (string)
 * - value: número o texto principal
 * - icon: ícono de lucide-react (ej: Users)
 * - color: color principal ('blue', 'green', 'yellow', 'red', 'purple')
 */
const CardStat = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    green: "text-green-500 bg-green-100 dark:bg-green-900/30",
    yellow: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    red: "text-red-500 bg-red-100 dark:bg-red-900/30",
    purple: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all duration-300">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
      {Icon && (
        <div
          className={`p-3 rounded-full ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default CardStat;
