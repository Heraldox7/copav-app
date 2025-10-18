// src/pages/admin/Arbitros.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import ArbitroCard from "@/components/ArbitroCard";
import { FaSearch, FaPlus } from "react-icons/fa";

const Arbitros = () => {
  const [arbitros, setArbitros] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerArbitros = async () => {
      const querySnapshot = await getDocs(collection(db, "arbitros"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArbitros(lista);
    };
    obtenerArbitros();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este árbitro?")) {
      await deleteDoc(doc(db, "arbitros", id));
      setArbitros(arbitros.filter((a) => a.id !== id));
    }
  };

  const filtered = arbitros.filter((a) => {
    const matchName = `${a.nombre} ${a.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = categoria === "Todos" || a.categoria === categoria;
    return matchName && matchCategoria;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Árbitros</h2>
        <button
          onClick={() => navigate("/admin/arbitros/agregar")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaPlus /> Agregar Árbitro
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar árbitro..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="Todos">Todas las categorías</option>
          <option value="3ra">3ra</option>
          <option value="2da">2da</option>
          <option value="1ra">1ra</option>
          <option value="Internacional">Internacional</option>
        </select>
      </div>

      {/* Lista de árbitros */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No se encontraron árbitros.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((arbitro) => (
            <ArbitroCard
              key={arbitro.id}
              arbitro={arbitro}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Arbitros;
