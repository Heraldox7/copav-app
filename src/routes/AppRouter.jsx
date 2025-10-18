// src/routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

// Páginas Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import Arbitros from "../pages/admin/Arbitros";
import AgregarArbitros from "../pages/admin/AgregarArbitros";
import EditarArbitro from "../pages/admin/EditarArbitro";
import PerfilArbitro from "../pages/admin/PerfilArbitro";

import Partidos from "../pages/admin/Partidos";
import AgregarPartido from "../pages/admin/AgregarPartido";

import Campeonatos from "../pages/admin/Campeonatos";
import AgregarCampeonato from "../pages/admin/AgregarCampeonato";
import EditarCampeonato from "../pages/admin/EditarCampeonato";
import EquiposCampeonato from "../pages/admin/EquiposCampeonato";
import AgregarEquipo from "../pages/admin/AgregarEquipo";
import EditarEquipo from "../pages/admin/EditarEquipo";

import Reportes from "../pages/admin/Reportes";

// Páginas User
import DashboardUser from "../pages/user/DashboardUser";
import MisPartidos from "../pages/user/MisPartidos";
import Estadisticas from "../pages/user/Estadisticas";
import Perfil from "../pages/user/Perfil";

// Página de Login
import Login from "../pages/Login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Página principal → redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />

          {/* Árbitros */}
          <Route path="arbitros" element={<Arbitros />} />
          <Route path="arbitros/agregar" element={<AgregarArbitros />} />
          <Route path="arbitros/editar/:id" element={<EditarArbitro />} />
          <Route path="arbitros/:id" element={<PerfilArbitro />} />

          {/* Partidos */}
          <Route path="partidos" element={<Partidos />} />
          <Route path="partidos/agregar" element={<AgregarPartido />} />

          {/* Campeonatos */}
          <Route path="campeonatos" element={<Campeonatos />} />
          <Route path="campeonatos/agregar" element={<AgregarCampeonato />} />
          <Route path="campeonatos/editar/:campeonatoId" element={<EditarCampeonato />} />

          {/* Equipos por campeonato */}
          <Route path="campeonatos/:campeonatoId/equipos" element={<EquiposCampeonato />} />
          <Route path="campeonatos/:campeonatoId/equipos/agregar" element={<AgregarEquipo />} />
          <Route path="campeonatos/:campeonatoId/equipos/editar/:equipoId" element={<EditarEquipo />} />

          {/* Reportes */}
          <Route path="reportes" element={<Reportes />} />

          {/* Redirección por defecto */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* USER */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<DashboardUser />} />
          <Route path="mis-partidos" element={<MisPartidos />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="perfil" element={<Perfil />} />
          <Route index element={<Navigate to="/user/dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="p-8 text-center text-2xl font-semibold">
              404 - Página no encontrada
            </h1>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
