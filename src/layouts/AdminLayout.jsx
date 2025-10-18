import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* 👈 Aquí se carga la página actual (Dashboard, Arbitros, etc.) */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
