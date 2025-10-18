import { Link } from "react-router-dom";
import { Users, Edit, Trash2, List } from "lucide-react";

const CampeonatoCard = ({ campeonato, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-lg transition">
      {/* Título */}
      <h3 className="text-lg font-bold text-gray-800 text-center">
        {campeonato.nombre}
      </h3>

      {/* Temporada */}
      <p className="text-sm text-gray-500 text-center">
        Temporada {campeonato.temporada}
      </p>

      {/* Equipos */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <Users className="text-blue-500" size={18} />
        <span className="text-gray-700 text-sm">
          {campeonato.equiposRegistrados?.length || 0} equipos registrados
        </span>
      </div>

      {/* Estado */}
      <div className="text-center mt-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            campeonato.estado === "Activo"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {campeonato.estado}
        </span>
      </div>

      {/* Botones */}
      <div className="flex justify-center gap-3 mt-3">
        {/* Ver equipos */}
        <Link
            to={`/admin/campeonatos/${campeonato.id}/equipos`}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
          <List size={16} /> Equipos
        </Link>

        {/* Editar */}
        <Link
          to={`/admin/campeonatos/editar/${campeonato.id}`}
          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
          <Edit size={18} />
        </Link>

        {/* Eliminar */}
        <button
          onClick={() => onDelete(campeonato.id)}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default CampeonatoCard;
