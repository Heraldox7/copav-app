// src/hooks/useArbitros.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const useArbitros = () => {
  const [arbitros, setArbitros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "arbitros"), orderBy("nombre", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArbitros(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { arbitros, loading };
};

export default useArbitros;
