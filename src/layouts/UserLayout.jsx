import React from "react";
import { Outlet } from "react-router-dom";
import SidebarUser from "../components/SidebarUser";
import Navbar from "../components/Navbar";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* 👈 Aquí se renderiza la vista activa (Dashboard, Perfil, etc.) */}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
