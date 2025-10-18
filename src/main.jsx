import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>  // Comentado para evitar doble renderizado en desarrollo
  <AuthProvider>
    <App />
    {/* Componente global de notificaciones */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
        },
      }}
    />
  </AuthProvider>
  // </React.StrictMode>
);
