import { LayoutDashboard, CalendarCheck, BarChart3, UserCircle, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SidebarUser = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard" },
    { name: "Mis Partidos", icon: CalendarCheck, path: "/user/mis-partidos" },
    { name: "Estadísticas", icon: BarChart3, path: "/user/estadisticas" },
    { name: "Mi Perfil", icon: UserCircle, path: "/user/perfil" },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 shadow-md w-64 p-4">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.svg" alt="Logo" className="w-10 h-10 mr-2" />
        <h1 className="text-xl font-bold text-blue-600">CopaV</h1>
      </div>

      {/* Perfil del usuario */}
      <div className="flex flex-col items-center mb-6">
        <img src="/avatar.png" alt="Avatar" className="w-16 h-16 rounded-full mb-2" />
        <h2 className="text-gray-900 dark:text-gray-100 font-semibold">Usuario</h2>
        <p className="text-sm text-gray-500">Árbitro</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="flex items-center gap-3 px-4 py-2 rounded-lg mt-6 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
        <LogOut className="w-5 h-5" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default SidebarUser;
