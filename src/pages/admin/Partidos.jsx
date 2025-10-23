// src/pages/admin/Partidos.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFileExcel, FaFilePdf, FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [search, setSearch] = useState("");
  const [mes, setMes] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 🔹 Cargar partidos desde Firebase
  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "partidos"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPartidos(data);
      } catch (error) {
        console.error("Error al obtener partidos:", error);
      }
    };
    fetchPartidos();
  }, []);

  // 🔹 Filtrar partidos
  const filteredPartidos = partidos.filter((p) => {
    const searchText = search.toLowerCase();
    const monthMatch = mes ? p.fecha?.slice(5, 7) === mes : true;
    return (
      monthMatch &&
      (p.campeonatoNombre?.toLowerCase().includes(searchText) ||
        `${p.equipoA} vs ${p.equipoB}`.toLowerCase().includes(searchText))
    );
  });

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredPartidos.length / rowsPerPage);
  const paginatedPartidos = filteredPartidos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 🔹 Acciones
  const handleVer = (partido) => {
    setSelectedPartido(partido);
    setShowModal(true);
  };

  const handleEditar = (id) => {
    navigate(`/admin/partidos/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este partido?");
    if (!confirm) return;

    await deleteDoc(doc(db, "partidos", id));
    setPartidos(partidos.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Partidos Registrados</h2>
        <Link
          to="/admin/partidos/agregar"
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaPlus /> Agregar Partido
        </Link>
      </div>

      {/* 🔍 Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por campeonato o equipos..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 w-full sm:w-1/4"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 w-full sm:w-1/4"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Campeonato</th>
              <th className="p-3 text-left">Equipos</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Terna Arbitral</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPartidos.length > 0 ? (
              paginatedPartidos.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.fecha}</td>
                  <td className="p-3">{p.campeonatoNombre}</td>
                  <td className="p-3 font-semibold">{`${p.equipoA} vs ${p.equipoB}`}</td>
                  <td className="p-3">{`${p.scoreA ?? 0} - ${p.scoreB ?? 0}`}</td>
                  <td className="p-3 text-sm">
                    {p.arbitro1Nombre || "-"} / {p.arbitro2Nombre || "-"} / {p.planillaNombre || "-"}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleVer(p)}
                      data-tooltip-id={`view-${p.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                    <Tooltip id={`view-${p.id}`} content="Ver detalles" />

                    <button
                      onClick={() => handleEditar(p.id)}
                      data-tooltip-id={`edit-${p.id}`}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <Tooltip id={`edit-${p.id}`} content="Editar partido" />

                    <button
                      onClick={() => handleEliminar(p.id)}
                      data-tooltip-id={`delete-${p.id}`}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                    <Tooltip id={`delete-${p.id}`} content="Eliminar partido" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hay partidos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Paginación */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Mostrando {paginatedPartidos.length} de {filteredPartidos.length} registros
        </p>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 📤 Exportaciones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => alert("Funcionalidad de exportar a Excel próximamente.")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaFileExcel /> Exportar Excel
        </button>
        <button
          onClick={() => alert("Funcionalidad de exportar a PDF próximamente.")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaFilePdf /> Exportar PDF
        </button>
      </div>

      {/* 🪟 Modal Detalle */}
      {showModal && selectedPartido && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Detalle del Partido
            </h2>

            <h3 className="text-gray-700 font-semibold mb-3">
              {selectedPartido.campeonatoNombre}
            </h3>

            <div className="text-center text-lg font-semibold text-gray-800 mb-4">
              {selectedPartido.equipoA} ({selectedPartido.scoreA}) - ({selectedPartido.scoreB}){" "}
              {selectedPartido.equipoB}
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 mb-4">
              <div>
                <p className="font-semibold">Categoría</p>
                <p>{selectedPartido.categoria}</p>
              </div>
              <div>
                <p className="font-semibold">Fase</p>
                <p>{selectedPartido.fase}</p>
              </div>
              <div>
                <p className="font-semibold">Género</p>
                <p>{selectedPartido.genero}</p>
              </div>
            </div>

            <div className="border-t pt-3 text-sm text-gray-700">
              <p className="font-semibold mb-2">Terna Arbitral:</p>
              <ul className="space-y-1">
                <li>1er Árbitro: {selectedPartido.arbitro1Nombre}</li>
                <li>2do Árbitro: {selectedPartido.arbitro2Nombre}</li>
                <li>Planilla: {selectedPartido.planillaNombre}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partidos;
