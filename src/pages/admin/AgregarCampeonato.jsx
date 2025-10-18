import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCampeonatos from "@/hooks/useCampeonatos";
import { toast } from "react-hot-toast";

const AgregarCampeonato = () => {
  const navigate = useNavigate();
  const { agregarCampeonato } = useCampeonatos();

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    genero: "",
    temporada: "2025",
    sede: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.categoria || !formData.genero) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    await agregarCampeonato(formData);
    toast.success("Campeonato agregado correctamente");
    navigate("/admin/campeonatos");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🏆 Agregar Campeonato
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Campeonato Distrital U-17"
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            >
              <option value="">Seleccionar</option>
              <option value="U-13">U-13</option>
              <option value="U-15">U-15</option>
              <option value="U-17">U-17</option>
              <option value="U-19">U-19</option>
              <option value="Mayores">Mayores</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Sede</label>
          <input
            type="text"
            name="sede"
            value={formData.sede}
            onChange={handleChange}
            placeholder="Ej. Lima, Cusco, Arequipa"
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/campeonatos")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarCampeonato;
