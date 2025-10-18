// src/pages/admin/PerfilArbitro.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FaArrowLeft, FaUser, FaFlag, FaClipboardList, FaTable } from "react-icons/fa";

const PerfilArbitro = () => {
  const { id } = useParams();
  const [arbitro, setArbitro] = useState(null);

  useEffect(() => {
    const fetchArbitro = async () => {
      const ref = doc(db, "arbitros", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) setArbitro(snapshot.data());
    };
    fetchArbitro();
  }, [id]);

  if (!arbitro) return <p className="p-6">Cargando datos...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <Link
        to="/admin/arbitros"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft /> Volver
      </Link>

      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
        <div className="w-[150px] h-[150px] bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-6xl">
          <FaUser />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {arbitro.nombre} {arbitro.apellido}
          </h2>
          <p className="text-gray-600">Categoría: {arbitro.categoria}</p>
          <p className="text-gray-600">N° Colegiatura: {arbitro.colegiatura}</p>
          <p className="text-gray-600">Celular: {arbitro.celular}</p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-4 gap-4">
        <Card icon={<FaTable />} title="Total Partidos" value="12" />
        <Card icon={<FaFlag />} title="1er Árbitro" value="6" />
        <Card icon={<FaFlag />} title="2do Árbitro" value="4" />
        <Card icon={<FaClipboardList />} title="Planilla" value="2" />
      </div>

      {/* Tabla de partidos */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Partidos del árbitro</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Campeonato</th>
              <th className="p-2 border">Equipos</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="text-center text-sm hover:bg-gray-50">
                <td className="p-2 border">2025-10-01</td>
                <td className="p-2 border">Copa Nacional</td>
                <td className="p-2 border">Equipo A vs Equipo B</td>
                <td className="p-2 border">3-2</td>
                <td className="p-2 border">1er Árbitro</td>
                <td className="p-2 border space-x-2">
                  <button className="text-blue-600 hover:underline">Ver</button>
                  <button className="text-green-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
    <div className="text-3xl text-blue-600 mb-2">{icon}</div>
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

export default PerfilArbitro;
