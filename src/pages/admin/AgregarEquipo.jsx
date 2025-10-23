import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Users } from "lucide-react";

const AgregarEquipo = () => {
  const { campeonatoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    siglas: "",
    directorTecnico: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.siglas.trim()) {
      toast.error("El nombre y las siglas son obligatorios");
      return;
    }

    try {
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
        {/* Nombre del equipo */}
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

        {/* Siglas o abreviatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Siglas o Abreviatura
          </label>
          <input
            type="text"
            name="siglas"
            value={formData.siglas}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white uppercase tracking-wide"
            placeholder="Ej. CLA"
            maxLength={5}
            required
          />
        </div>

        {/* Director técnico (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Director Técnico (opcional)
          </label>
          <input
            type="text"
            name="directorTecnico"
            value={formData.directorTecnico}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white"
            placeholder="Nombre del entrenador o DT"
          />
        </div>

        {/* Botones */}
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
