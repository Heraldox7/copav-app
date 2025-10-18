import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function EditarEquipo() {
  const { campeonatoId, equipoId } = useParams(); // ✅ ambos parámetros
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState({
    nombre: "",
    categoria: "",
    entrenador: "",
    jugadores: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerEquipo = async () => {
      try {
        if (!equipoId) {
          toast.error("ID del equipo no válido");
          navigate(-1);
          return;
        }

        const docRef = doc(db, "equipos", equipoId); // ✅ usar equipoId
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEquipo(docSnap.data());
        } else {
          toast.error("Equipo no encontrado");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error al obtener el equipo:", error);
        toast.error("No se pudo cargar la información del equipo");
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipo();
  }, [equipoId, navigate]);

  const handleChange = (e) => {
    setEquipo({ ...equipo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "equipos", equipoId); // ✅ usar equipoId
      await updateDoc(docRef, equipo);
      toast.success("Equipo actualizado correctamente");
      navigate(`/admin/campeonatos/${campeonatoId}/equipos`);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("No se pudo actualizar el equipo");
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando equipo...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Equipo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre del equipo</label>
          <input
            type="text"
            name="nombre"
            value={equipo.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={equipo.categoria}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Entrenador</label>
          <input
            type="text"
            name="entrenador"
            value={equipo.entrenador}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">N° Jugadores</label>
          <input
            type="number"
            name="jugadores"
            value={equipo.jugadores}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
