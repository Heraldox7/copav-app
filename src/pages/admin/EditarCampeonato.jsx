import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const EditarCampeonato = () => {
  const { campeonatoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    temporada: "",
    deporte: "Vóleibol",
    fechaInicio: "",
    fechaFin: "",
    estado: "Próximo",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Obtener los datos actuales del campeonato
  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const docRef = doc(db, "campeonatos", campeonatoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          toast.error("Campeonato no encontrado");
          navigate("/admin/campeonatos");
        }
      } catch (error) {
        console.error("Error al obtener el campeonato:", error);
        toast.error("Error al cargar los datos");
      }
    };

    fetchCampeonato();
  }, [campeonatoId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "campeonatos", campeonatoId);
      await updateDoc(docRef, formData);

      toast.success("Campeonato actualizado correctamente");
      navigate("/admin/campeonatos");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Editar Campeonato
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Temporada</label>
          <input
            type="text"
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
            placeholder="Ej: 2025-2026"
            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deporte</label>
          <input
            type="text"
            name="deporte"
            value={formData.deporte}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="Próximo">Próximo</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
        >
          {loading ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditarCampeonato;
