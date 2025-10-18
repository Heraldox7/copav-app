import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import toast from "react-hot-toast";

export default function EquiposCampeonato() {
  const { campeonatoId } = useParams(); // ✅ corregido
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const obtenerEquipos = async () => {
      try {
        if (!campeonatoId) {
          toast.error("ID de campeonato no válido");
          navigate("/admin/campeonatos");
          return;
        }

        const q = query(
          collection(db, "equipos"),
          where("campeonatoId", "==", campeonatoId)
        );
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipos(lista);
      } catch (error) {
        console.error("Error al obtener equipos:", error);
        toast.error("No se pudieron cargar los equipos");
      }
    };

    obtenerEquipos();
  }, [campeonatoId, navigate]);

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Equipos del Campeonato
        </h2>

        {/* BOTÓN AGREGAR EQUIPO */}
        <Link
          to={`/admin/campeonatos/${campeonatoId}/equipos/agregar`} // ✅ corregido
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Equipo
        </Link>
      </div>

      {/* LISTADO DE EQUIPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipos.length > 0 ? (
          equipos.map((equipo) => (
            <div
              key={equipo.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                {equipo.nombre}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Categoría: {equipo.categoria || "Sin definir"}
              </p>

              {/* BOTONES */}
              <div className="flex gap-2">
                <Link
                  to={`/admin/campeonatos/${campeonatoId}/equipos/editar/${equipo.id}`} // ✅ corregido
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
                >
                  Editar
                </Link>

                <button
                  onClick={() => toast.success("Eliminar en desarrollo")}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
            No hay equipos registrados en este campeonato.
          </p>
        )}
      </div>
    </div>
  );
}
