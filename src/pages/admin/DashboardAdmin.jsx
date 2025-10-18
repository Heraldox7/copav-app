import React from "react";
import CardStat from "../../components/CardStat";
import ChartBar from "../../components/ChartBar";
import ChartDonut from "../../components/ChartDonut";
import { Users, ClipboardList, Award, BarChart3 } from "lucide-react";


const DashboardAdmin = () => {
  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Panel de administración
      </h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStat title="Árbitros" value="24" icon={Users} color="blue" />
        <CardStat title="Partidos" value="58" icon={ClipboardList} color="green" />
        <CardStat title="Campeonatos" value="6" icon={Award} color="yellow" />
        <CardStat title="Reportes" value="12" icon={BarChart3} color="red" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBar />
        <ChartDonut />
      </div>
    </div>
  );
};

export default DashboardAdmin;
