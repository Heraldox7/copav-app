import React, { useState } from "react";
import { Plus, Edit, Trash2, User } from "lucide-react";

const Arbitros = () => {
  const [arbitros, setArbitros] = useState([
    { id: 1, nombre: "Raúl Condori", categoria: "Nacional", estado: "Activo" },
    { id: 2, nombre: "José Cruzatt", categoria: "Regional", estado: "Inactivo" },
    { id: 3, nombre: "Jhonatan Collantes", categoria: "Internacional", estado: "Activo" },
  ]);

  return (
    <div className="p-6">
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" /> Árbitros
        </h1>

        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Agregar Árbitro
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {arbitros.map((arb, index) => (
              <tr
                key={arb.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {arb.nombre}
                </td>
                <td className="px-4 py-3">{arb.categoria}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      arb.estado === "Activo"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {arb.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Arbitros;
