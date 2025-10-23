import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FileText, BarChart3, PieChart, Calendar, Filter, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as PieC, Pie, Cell, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const Reportes = () => {
  const [partidos, setPartidos] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [filtros, setFiltros] = useState({
    arbitro: "",
    categoria: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    arbitro1: 0,
    arbitro2: 0,
    planilla: 0,
  });

  // 🔹 Cargar datos de Firestore
  useEffect(() => {
    const cargarDatos = async () => {
      const partidosSnap = await getDocs(collection(db, "partidos"));
      const lista = partidosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPartidos(lista);

      // Extraer árbitros únicos
      const arbitrosUnicos = Array.from(
        new Set([
          ...lista.map((p) => p.arbitro1Nombre),
          ...lista.map((p) => p.arbitro2Nombre),
          ...lista.map((p) => p.planillaNombre),
        ])
      ).filter(Boolean);
      setArbitros(arbitrosUnicos);
    };
    cargarDatos();
  }, []);

  // 🔹 Aplicar filtros
const partidosFiltrados = useMemo(() => {
  const fInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
  const fFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;

  return partidos.filter((p) => {
    const fPartido = new Date(p.fecha);
    return (
      (!filtros.arbitro ||
        p.arbitro1Nombre === filtros.arbitro ||
        p.arbitro2Nombre === filtros.arbitro ||
        p.planillaNombre === filtros.arbitro) &&
      (!filtros.categoria || p.categoria === filtros.categoria) &&
      (!fInicio || fPartido >= fInicio) &&
      (!fFin || fPartido <= fFin)
    );
  });
}, [partidos, filtros]);


  // 🔹 Calcular estadísticas
useEffect(() => {
  if (partidosFiltrados.length === 0) {
    setStats({ total: 0, arbitro1: 0, arbitro2: 0, planilla: 0 });
    return;
  }

  const total = partidosFiltrados.length;
  const arbitro1 = partidosFiltrados.filter((p) => p.arbitro1Nombre === filtros.arbitro).length;
  const arbitro2 = partidosFiltrados.filter((p) => p.arbitro2Nombre === filtros.arbitro).length;
  const planilla = partidosFiltrados.filter((p) => p.planillaNombre === filtros.arbitro).length;

  setStats({ total, arbitro1, arbitro2, planilla });
}, [filtros, partidosFiltrados.length]);

  // 🔹 Datos para gráficos
  const dataPorMes = Object.values(
    partidosFiltrados.reduce((acc, p) => {
      const mes = new Date(p.fecha).toLocaleString("es-ES", { month: "short" });
      acc[mes] = acc[mes] || { mes, cantidad: 0 };
      acc[mes].cantidad++;
      return acc;
    }, {})
  );

  const dataRoles = [
    { name: "1er Árbitro", value: stats.arbitro1 },
    { name: "2do Árbitro", value: stats.arbitro2 },
    { name: "Planilla", value: stats.planilla },
  ];

  const COLORS = ["#00E0A1", "#3B82F6", "#FACC15"];

  // 🔹 Placeholder para exportar (en desarrollo)
  const exportarEnDesarrollo = (tipo) => {
    toast.success(`Exportar ${tipo} — función próximamente disponible 🚧`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FileText className="text-blue-500" /> Reportes
        </h1>
      </div>

      {/* FILTROS */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Árbitro</label>
          <select
            className="border rounded-lg p-2 w-48 dark:bg-gray-900 dark:border-gray-700"
            value={filtros.arbitro}
            onChange={(e) => setFiltros({ ...filtros, arbitro: e.target.value })}
          >
            <option value="">Todos</option>
            {arbitros.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
          <select
            className="border rounded-lg p-2 w-40 dark:bg-gray-900 dark:border-gray-700"
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="U-13">U-13</option>
            <option value="U-15">U-15</option>
            <option value="U-17">U-17</option>
            <option value="U-19">U-19</option>
            <option value="Mayores">Mayores</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            className="border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700"
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            className="border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
          />
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total de Partidos" value={stats.total} color="bg-blue-600" />
        <MetricCard title="1er Árbitro" value={stats.arbitro1} color="bg-green-600" />
        <MetricCard title="2do Árbitro" value={stats.arbitro2} color="bg-yellow-500" />
        <MetricCard title="Planillero" value={stats.planilla} color="bg-purple-600" />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Cantidad de Partidos por Mes
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de roles */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Distribución de Roles
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieC>
              <Pie data={dataRoles} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {dataRoles.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieC>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Campeonato</th>
              <th className="px-4 py-3">Partido</th>
              <th className="px-4 py-3">Árbitro</th>
              <th className="px-4 py-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {partidosFiltrados.map((p) => {
              const rol =
                p.arbitro1Nombre === filtros.arbitro
                  ? "1er Árbitro"
                  : p.arbitro2Nombre === filtros.arbitro
                  ? "2do Árbitro"
                  : p.planillaNombre === filtros.arbitro
                  ? "Planilla"
                  : "-";
              return (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                >
                  <td className="px-4 py-3">{p.fecha}</td>
                  <td className="px-4 py-3">{p.campeonatoNombre}</td>
                  <td className="px-4 py-3">
                    {p.equipoA} vs {p.equipoB}
                  </td>
                  <td className="px-4 py-3">{filtros.arbitro || "Todos"}</td>
                  <td className="px-4 py-3">{rol}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BOTONES EXPORTAR (stand-by) */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => exportarEnDesarrollo("Excel")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Download size={18} /> Excel
        </button>
        <button
          onClick={() => exportarEnDesarrollo("PDF")}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Download size={18} /> PDF
        </button>
      </div>
    </div>
  );
};

// 🔹 Componente de métrica individual
const MetricCard = ({ title, value, color }) => (
  <div
    className={`p-4 rounded-xl shadow-md text-white flex flex-col items-center justify-center ${color}`}
  >
    <span className="text-sm font-medium opacity-80">{title}</span>
    <span className="text-2xl font-bold">{value}</span>
  </div>
);

export default Reportes;
