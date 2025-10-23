import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import toast from "react-hot-toast";

export default function EquiposCampeonato() {
  const { campeonatoId } = useParams();
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipos();
  }, [campeonatoId, navigate]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mb-3"></div>
        Cargando equipos...
      </div>
    );

  return (
    <div className="p-6">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Equipos del Campeonato
        </h2>

        {/* BOTÓN AGREGAR EQUIPO */}
        <Link
          to={`/admin/campeonatos/${campeonatoId}/equipos/agregar`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar Equipo
        </Link>
      </div>

      {/* LISTADO DE EQUIPOS */}
      {equipos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {equipos.map((equipo) => (
            <div
              key={equipo.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              {/* Contenedor de insignia + datos */}
              <div className="flex items-center gap-4">
                {/* Círculo con siglas */}
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full text-white text-xl font-bold uppercase shadow-md shrink-0"
                  style={{
                    backgroundColor: generarColorDesdeTexto(
                      equipo.siglas || equipo.nombre
                    ),
                  }}
                >
                  {equipo.siglas?.slice(0, 3) || "EQ"}
                </div>

                {/* Texto: nombre + DT */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                    {equipo.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    DT: {equipo.directorTecnico || "—"}
                  </p>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex gap-2 mt-4 justify-end">
                <Link
                  to={`/admin/campeonatos/${campeonatoId}/equipos/editar/${equipo.id}`}
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
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No hay equipos registrados en este campeonato.
        </p>
      )}
    </div>
  );
}

/**
 * 🔹 Genera un color único basado en el texto (siglas o nombre del equipo)
 */
function generarColorDesdeTexto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs((Math.sin(hash) * 10000) % 1) * 16777215
  ).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
}
