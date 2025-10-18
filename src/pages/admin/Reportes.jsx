import React, { useState } from "react";
import { FileText, Calendar, Filter, Download } from "lucide-react";

const Reportes = () => {
  const [filtro, setFiltro] = useState("");
  const [reportes, setReportes] = useState([
    {
      id: 1,
      fecha: "2025-03-10",
      campeonato: "Copa Nacional U17",
      partido: "Calca vs Cusco",
      arbitro: "Raúl Condori",
      estado: "Finalizado",
    },
    {
      id: 2,
      fecha: "2025-03-12",
      campeonato: "Torneo Regional Sur",
      partido: "Arequipa vs Moquegua",
      arbitro: "Jhonatan Collantes",
      estado: "En curso",
    },
    {
      id: 3,
      fecha: "2025-03-15",
      campeonato: "Campeonato Escolar",
      partido: "Punchana vs Santa Ana",
      arbitro: "José Cruzatt",
      estado: "Pendiente",
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          Reportes
        </h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 dark:text-gray-400" size={18} />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los campeonatos</option>
            <option value="Copa Nacional U17">Copa Nacional U17</option>
            <option value="Torneo Regional Sur">Torneo Regional Sur</option>
            <option value="Campeonato Escolar">Campeonato Escolar</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-gray-500 dark:text-gray-400" size={18} />
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla de reportes */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Campeonato</th>
              <th className="px-4 py-3">Partido</th>
              <th className="px-4 py-3">Árbitro</th>
              <th className="px-4 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
              >
                <td className="px-4 py-3">{r.fecha}</td>
                <td className="px-4 py-3">{r.campeonato}</td>
                <td className="px-4 py-3">{r.partido}</td>
                <td className="px-4 py-3">{r.arbitro}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.estado === "Finalizado"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : r.estado === "En curso"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
