import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Trophy, Search, Users } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCampeonatos, setFilteredCampeonatos] = useState([]);

  // 🔹 Obtener campeonatos
  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "campeonatos"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampeonatos(data);
        setFilteredCampeonatos(data);
      } catch (error) {
        toast.error("Error al cargar campeonatos");
        console.error(error);
      }
    };
    fetchCampeonatos();
  }, []);

  // 🔹 Filtro de búsqueda
  useEffect(() => {
    const filtered = campeonatos.filter((camp) =>
      camp.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCampeonatos(filtered);
  }, [searchTerm, campeonatos]);

  // 🔹 Obtener número de equipos por campeonato
  const [equiposCount, setEquiposCount] = useState({});
  useEffect(() => {
    const fetchEquiposPorCampeonato = async () => {
      try {
        const counts = {};
        for (const camp of campeonatos) {
          const q = query(
            collection(db, "equipos"),
            where("campeonatoId", "==", camp.id)
          );
          const snapshot = await getDocs(q);
          counts[camp.id] = snapshot.size;
        }
        setEquiposCount(counts);
      } catch (error) {
        console.error("Error al obtener equipos:", error);
      }
    };

    if (campeonatos.length > 0) fetchEquiposPorCampeonato();
  }, [campeonatos]);

  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-500" />
          Campeonatos
        </h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Búsqueda */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar campeonato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>

          <Link
            to="/admin/campeonatos/agregar"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Nuevo
          </Link>
        </div>
      </div>

      {/* GRID DE CAMPEONATOS */}
      {filteredCampeonatos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampeonatos.map((camp) => (
            <div
              key={camp.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
            >
              {/* Título */}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {camp.nombre}
              </h2>

              {/* Temporada */}
              {camp.temporada && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Temporada: {camp.temporada}
                </p>
              )}

              {/* Equipos */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {equiposCount[camp.id] ?? 0} equipos registrados
                </span>
              </div>

              {/* Estado */}
              <div className="mt-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    camp.estado === "Activo"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {camp.estado || "Inactivo"}
                </span>
              </div>

              {/* Botones */}
              <div className="flex justify-between items-center mt-auto pt-3 border-t dark:border-gray-700">
                <Link
                  to={`/admin/campeonatos/${camp.id}/equipos`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Users size={16} /> Equipos
                </Link>

                <div className="flex gap-3">
                  {/* 🔹 EDITAR */}
                  <button
                    onClick={() =>
                      navigate(`/admin/campeonatos/editar/${camp.id}`)
                    }
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  {/* 🔹 ELIMINAR */}
                  <button
                    onClick={() => toast.error("Eliminar aún no implementado")}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No hay campeonatos registrados.
        </p>
      )}
    </div>
  );
};

export default Campeonatos;
