import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar rol en Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();

        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError("No se encontró el perfil de usuario.");
      }
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-fivb.svg" alt="COPAV Logo" className="h-16 mb-2" />
          <h2 className="text-xl font-semibold text-center text-[#0C2D82]">
            BIENVENIDO
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <input
              type="email"
              placeholder="Ingresa tu usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0C2D82] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0C2D82] focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0C2D82] hover:bg-[#1A46C2] text-white font-semibold py-2 rounded-lg transition"
          >
            INICIAR SESIÓN
          </button>

          <div className="text-center text-sm mt-2">
            <a href="#" className="text-[#0C2D82] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
            <br />
            <a href="#" className="text-[#0C2D82] hover:underline">
              ¿No tienes cuenta? Contacta al admin
            </a>
          </div>
        </form>
      </div>

      <footer className="mt-8 text-sm text-gray-400">
        © 2025 COPAV - Federación Regional de Vóleibol
      </footer>
    </div>
  );
}
