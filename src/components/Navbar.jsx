import React from "react";
import { Bell, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Panel de Administración
      </h1>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="text-gray-600 dark:text-gray-300" size={18} />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
