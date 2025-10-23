import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function EditarEquipo() {
  const { campeonatoId, equipoId } = useParams();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState({
    nombre: "",
    siglas: "",
    directorTecnico: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerEquipo = async () => {
      try {
        const docRef = doc(db, "equipos", equipoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEquipo(docSnap.data());
        } else {
          toast.error("Equipo no encontrado");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error al obtener el equipo:", error);
        toast.error("Error al cargar el equipo");
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
      await updateDoc(doc(db, "equipos", equipoId), equipo);
      toast.success("Equipo actualizado correctamente");
      navigate(`/admin/campeonatos/${campeonatoId}/equipos`);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el equipo");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mb-3"></div>
        Cargando equipo...
      </div>
    );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Equipo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre del Equipo</label>
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
          <label className="block font-medium mb-1">Siglas o Abreviatura</label>
          <input
            type="text"
            name="siglas"
            value={equipo.siglas}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 uppercase tracking-wide"
            maxLength={5}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Director Técnico (opcional)</label>
          <input
            type="text"
            name="directorTecnico"
            value={equipo.directorTecnico}
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
