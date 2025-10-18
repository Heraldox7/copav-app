import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const useCampeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampeonatos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "campeonatos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCampeonatos(data);
    } catch (error) {
      console.error("Error al obtener campeonatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCampeonato = async (nuevoCampeonato) => {
    try {
      await addDoc(collection(db, "campeonatos"), {
        ...nuevoCampeonato,
        estado: "activo",
        equiposCount: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al agregar campeonato:", error);
    }
  };

  const actualizarCampeonato = async (id, datosActualizados) => {
    try {
      await updateDoc(doc(db, "campeonatos", id), datosActualizados);
    } catch (error) {
      console.error("Error al actualizar campeonato:", error);
    }
  };

  const eliminarCampeonato = async (id) => {
    try {
      await deleteDoc(doc(db, "campeonatos", id));
    } catch (error) {
      console.error("Error al eliminar campeonato:", error);
    }
  };

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  return {
    campeonatos,
    loading,
    agregarCampeonato,
    actualizarCampeonato,
    eliminarCampeonato,
    fetchCampeonatos,
  };
};

export default useCampeonatos;
