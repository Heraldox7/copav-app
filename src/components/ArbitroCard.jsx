import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const ArbitroCard = ({ arbitro, onDelete }) => {
  const [estado, setEstado] = useState(arbitro.estado || "INACTIVO");

  // 🟢 Cambiar estado en Firestore
  const handleToggleEstado = async () => {
    const nuevoEstado = estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    setEstado(nuevoEstado);
    try {
      const arbitroRef = doc(db, "arbitros", arbitro.id);
      await updateDoc(arbitroRef, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      // En caso de error, revertimos el cambio local
      setEstado(estado);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg">
      {/* Avatar */}
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
        {arbitro.nombre?.charAt(0) || "A"}
      </div>

      {/* Nombre completo */}
      <h3 className="text-lg font-bold text-gray-800 mt-3">
        {arbitro.nombre && arbitro.apellido
        ? `${arbitro.nombre} ${arbitro.apellido}`
        : arbitro.nombre || "Nombre del árbitro"}
      </h3>

      {/* Nº Colegiatura */}
      <p className="text-sm text-gray-500 mt-1">
        N° Colegiatura: {arbitro.colegiatura || "—"}
      </p>

      {/* Categoría y Partidos */}
      <div className="text-sm text-gray-600 mt-2">
        <p>Categoría: {arbitro.categoria || "Sin asignar"}</p>
        <p>Partidos: {arbitro.partidos || 0}</p>
      </div>

      {/* Estado con toggle */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            estado === "ACTIVO"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {estado}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={estado === "ACTIVO"}
            onChange={handleToggleEstado}
          />
          <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition"></div>
          <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
        </label>
      </div>

      {/* Botones con tooltip */}
      <div className="flex justify-center mt-4 gap-3">
        {/* Ver perfil */}
        <Link
          to={`/admin/arbitros/${arbitro.id}`}
          data-tooltip-id={`ver-${arbitro.id}`}
          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full text-blue-600 transition"
        >
          <FaEye />
        </Link>
        <Tooltip id={`ver-${arbitro.id}`} content="Ver perfil" />

        {/* Editar */}
        <Link
          to={`/admin/arbitros/editar/${arbitro.id}`}
          data-tooltip-id={`editar-${arbitro.id}`}
          className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded-full text-yellow-600 transition"
        >
          <FaEdit />
        </Link>
        <Tooltip id={`editar-${arbitro.id}`} content="Editar árbitro" />

        {/* Eliminar */}
        <button
          onClick={() => onDelete(arbitro.id)}
          data-tooltip-id={`eliminar-${arbitro.id}`}
          className="bg-red-100 hover:bg-red-200 p-2 rounded-full text-red-600 transition"
        >
          <FaTrash />
        </button>
        <Tooltip id={`eliminar-${arbitro.id}`} content="Eliminar árbitro" />
      </div>
    </div>
  );
};

export default ArbitroCard;
