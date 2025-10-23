// src/pages/admin/PerfilArbitro.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  or,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  FaArrowLeft,
  FaUser,
  FaFlag,
  FaClipboardList,
  FaTable,
  FaTimes,
} from "react-icons/fa";

const PerfilArbitro = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [arbitro, setArbitro] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [stats, setStats] = useState({ total: 0, arbitro1: 0, arbitro2: 0, planilla: 0 });
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener datos del árbitro
      const ref = doc(db, "arbitros", id);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      setArbitro(data);

      // Consultar partidos
      const partidosRef = collection(db, "partidos");
      const q = query(
        partidosRef,
        or(
          where("arbitro1Nombre", "==", data.nombre + " " + data.apellido),
          where("arbitro2Nombre", "==", data.nombre + " " + data.apellido),
          where("planillaNombre", "==", data.nombre + " " + data.apellido)
        )
      );

      const querySnapshot = await getDocs(q);
      const partidosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Calcular estadísticas
      const arbitro1 = partidosData.filter(
        (p) => p.arbitro1Nombre === `${data.nombre} ${data.apellido}`
      ).length;
      const arbitro2 = partidosData.filter(
        (p) => p.arbitro2Nombre === `${data.nombre} ${data.apellido}`
      ).length;
      const planilla = partidosData.filter(
        (p) => p.planillaNombre === `${data.nombre} ${data.apellido}`
      ).length;

      setStats({ total: partidosData.length, arbitro1, arbitro2, planilla });
      setPartidos(partidosData);
    };

    fetchData();
  }, [id]);

  const handleVer = (partido) => {
    setSelectedPartido(partido);
    setShowModal(true);
  };

  const handleEditar = (idPartido) => {
    navigate(`/admin/partidos/editar/${idPartido}`);
  };

  const handleEliminar = async (idPartido) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este partido?");
    if (!confirm) return;

    await deleteDoc(doc(db, "partidos", idPartido));
    setPartidos(partidos.filter((p) => p.id !== idPartido));
  };

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
        <Card icon={<FaTable />} title="Total Partidos" value={stats.total} />
        <Card icon={<FaFlag />} title="1er Árbitro" value={stats.arbitro1} />
        <Card icon={<FaFlag />} title="2do Árbitro" value={stats.arbitro2} />
        <Card icon={<FaClipboardList />} title="Planilla" value={stats.planilla} />
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Partidos del árbitro</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Campeonato</th>
              <th className="p-2 border">Equipos</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.length > 0 ? (
              partidos.map((p) => {
                let rol = "";
                if (p.arbitro1Nombre === `${arbitro.nombre} ${arbitro.apellido}`) rol = "1er Árbitro";
                else if (p.arbitro2Nombre === `${arbitro.nombre} ${arbitro.apellido}`) rol = "2do Árbitro";
                else if (p.planillaNombre === `${arbitro.nombre} ${arbitro.apellido}`) rol = "Planilla";

                return (
                  <tr key={p.id} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{p.fecha}</td>
                    <td className="p-2 border">{p.campeonatoNombre}</td>
                    <td className="p-2 border">
                      {p.equipoA} vs {p.equipoB}
                    </td>
                    <td className="p-2 border">
                      {p.scoreA}-{p.scoreB}
                    </td>
                    <td className="p-2 border">{rol}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleVer(p)}
                        className="text-blue-600 hover:underline"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditar(p.id)}
                        className="text-green-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hay partidos registrados para este árbitro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detalle */}
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

// Componente de tarjeta
const Card = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
    <div className="text-3xl text-blue-600 mb-2">{icon}</div>
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

export default PerfilArbitro;
