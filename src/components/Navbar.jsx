import React, { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia guardada o del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Si no hay preferencia guardada, usa la del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Cambiar tema manualmente
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Panel de Administración
      </h1>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="text-gray-600 dark:text-gray-300" size={18} />
        </button>

        {/* Botón de modo oscuro */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <Sun className="text-yellow-400" size={18} />
          ) : (
            <Moon className="text-gray-600 dark:text-gray-300" size={18} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
