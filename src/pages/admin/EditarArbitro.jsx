// src/pages/admin/EditarArbitro.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const EditarArbitro = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    categoria: "",
    celular: "",
    colegiatura: "",
    estado: "ACTIVO",
  });

  useEffect(() => {
    const fetchArbitro = async () => {
      try {
        const docRef = doc(db, "arbitros", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          console.error("No se encontró el árbitro");
        }
      } catch (error) {
        console.error("Error al cargar árbitro:", error);
      }
    };
    fetchArbitro();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "arbitros", id);
      await updateDoc(docRef, form);
      toast.success("✅ Árbitro actualizado correctamente");

      // ✅ Redirige a la lista de árbitros después de guardar
      navigate("/admin/arbitros");
    } catch (error) {
      console.error("Error al actualizar árbitro:", error);
    }
  };

  return (
    <div className="p-6">
      {/* 🔙 Botón volver */}
      <Link
        to="/admin/arbitros"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft /> Volver
      </Link>

      <h2 className="text-2xl font-semibold mb-4">Editar Árbitro</h2>

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

export default EditarArbitro;
