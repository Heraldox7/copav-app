import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Users } from "lucide-react";

const AgregarEquipo = () => {
  const { campeonatoId } = useParams(); // ✅ ID correcto del campeonato
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    entrenador: "",
    jugadores: "",
    categoria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast.error("El nombre del equipo es obligatorio");
      return;
    }

    try {
      // ✅ Se usa campeonatoId, no id
      await addDoc(collection(db, "equipos"), {
        ...formData,
        campeonatoId,
        fechaRegistro: serverTimestamp(),
      });

      toast.success("Equipo agregado correctamente 🎉");
      navigate(`/admin/campeonatos/${campeonatoId}/equipos`);
    } catch (error) {
      console.error("Error al agregar equipo:", error);
      toast.error("Error al registrar el equipo");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-500" />
        Agregar Equipo
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del Equipo
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white"
            placeholder="Ej. Club Los Andes"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoría
          </label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white"
            placeholder="Ej. Sub-17, Libre, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Entrenador
          </label>
          <input
            type="text"
            name="entrenador"
            value={formData.entrenador}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white"
            placeholder="Nombre del entrenador"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jugadores (opcional)
          </label>
          <textarea
            name="jugadores"
            value={formData.jugadores}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white"
            rows="4"
            placeholder="Lista de jugadores, separados por coma"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Guardar Equipo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarEquipo;
