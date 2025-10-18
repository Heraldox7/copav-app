// src/pages/admin/AgregarArbitros.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AgregarArbitros = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    categoria: "",
    celular: "",
    colegiatura: "",
    estado: "ACTIVO",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "arbitros"), form);
      toast.success("✅ Árbitro registrado correctamente");
      navigate("/admin/arbitros");
    } catch (error) {
      console.error("Error al guardar árbitro:", error);
      toast.error("❌ Error al registrar árbitro");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Agregar Árbitro</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombres"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellidos"
          value={form.apellido}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Categoría</option>
          <option value="3ra">3ra</option>
          <option value="2da">2da</option>
          <option value="1ra">1ra</option>
          <option value="Internacional">Internacional</option>
        </select>
        <input
          type="text"
          name="celular"
          placeholder="Celular"
          value={form.celular}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="colegiatura"
          placeholder="N° Colegiatura"
          value={form.colegiatura}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/arbitros")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarArbitros;
