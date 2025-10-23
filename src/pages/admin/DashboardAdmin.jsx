import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import CardStat from "@/components/CardStat";
import ChartBar from "@/components/ChartBar";
import ChartDonut from "@/components/ChartDonut";
import { Users, ClipboardList, Award, BarChart3 } from "lucide-react";

const DashboardAdmin = () => {
  const [partidos, setPartidos] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabla: paginación cliente
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [pSnap, aSnap, cSnap] = await Promise.all([
          getDocs(collection(db, "partidos")),
          getDocs(collection(db, "arbitros")),
          getDocs(collection(db, "campeonatos")),
        ]);

        const partidosData = pSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const arbitrosData = aSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const campeonatosData = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setPartidos(partidosData);
        setArbitros(arbitrosData);
        setCampeonatos(campeonatosData);
      } catch (err) {
        console.error("Error cargando datos dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Estadísticas rápidas (counts)
  const stats = useMemo(() => {
    return {
      totalArbitros: arbitros.length,
      totalPartidos: partidos.length,
      totalCampeonatos: campeonatos.length,
      // reportes: por ahora lo contamos como partidos finalizados (opción)
      totalReportes: partidos.filter((p) => p.estado === "Finalizado").length,
    };
  }, [arbitros, partidos, campeonatos]);

  // Datos para ChartBar: partidos por mes (usa campo fecha)
  const dataPorMes = useMemo(() => {
    // agrupado por mes-año para orden correcto
    const map = {};
    partidos.forEach((p) => {
      const fechaStr = p.fecha || p.creadoEn || "";
      const d = new Date(fechaStr);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("es-ES", { month: "short", year: "numeric" });
      if (!map[key]) map[key] = { mes: label, cantidad: 0 };
      map[key].cantidad++;
    });
    // ordenar por key asc, luego devolver array
    return Object.keys(map)
      .sort()
      .map((k) => map[k]);
  }, [partidos]);

  // Datos para ChartDonut: distribución por rol (1er, 2do, planilla)
  const dataRoles = useMemo(() => {
    let c1 = 0,
      c2 = 0,
      cp = 0;
    partidos.forEach((p) => {
      if (p.arbitro1Nombre) c1++;
      if (p.arbitro2Nombre) c2++;
      if (p.planillaNombre) cp++;
    });
    return [
      { name: "1er Árbitro", value: c1 },
      { name: "2do Árbitro", value: c2 },
      { name: "Planilla", value: cp },
    ];
  }, [partidos]);

  // Últimos partidos ordenados por creadoEn (fallback a fecha) desc
  const partidosOrdenados = useMemo(() => {
    return [...partidos].sort((a, b) => {
      const da = new Date(a.creadoEn || a.fecha || 0).getTime();
      const db = new Date(b.creadoEn || b.fecha || 0).getTime();
      return db - da;
    });
  }, [partidos]);

  // Paginación: slice de partidosOrdenados
  const totalPages = Math.max(1, Math.ceil(partidosOrdenados.length / pageSize));
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return partidosOrdenados.slice(start, start + pageSize);
  }, [partidosOrdenados, currentPage]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-56">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mr-4"></div>
        <span className="text-gray-700">Cargando dashboard...</span>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Panel de administración</h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStat title="Árbitros" value={stats.totalArbitros} icon={Users} color="blue" />
        <CardStat title="Partidos" value={stats.totalPartidos} icon={ClipboardList} color="green" />
        <CardStat title="Campeonatos" value={stats.totalCampeonatos} icon={Award} color="yellow" />
        <CardStat title="Reportes" value={stats.totalReportes} icon={BarChart3} color="red" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBar data={dataPorMes} />
        <ChartDonut data={dataRoles} />
      </div>

      {/* Tabla de últimos partidos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Últimos partidos registrados
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Campeonato</th>
                <th className="px-4 py-2">Partido</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Terna</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3">
                    {new Date(p.fecha || p.creadoEn).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-4 py-3">{p.campeonatoNombre}</td>
                  <td className="px-4 py-3">
                    {p.equipoA} vs {p.equipoB}
                  </td>
                  <td className="px-4 py-3">
                    {p.scoreA ?? 0} - {p.scoreB ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {p.arbitro1Nombre || "-"}, {p.arbitro2Nombre || "-"}, {p.planillaNombre || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Mostrando {pageData.length} de {partidosOrdenados.length} partidos
          </p>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Anterior
            </button>

            {/* botones de página (hasta 5 visibles) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded ${num === currentPage ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                >
                  {num}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
