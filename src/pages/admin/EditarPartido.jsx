import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditarPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    campeonatoId: "",
    campeonatoNombre: "",
    categoria: "",
    fase: "",
    fecha: "",
    genero: "",
    equipoA: "",
    equipoB: "",
    scoreA: "",
    scoreB: "",
    arbitro1Id: "",
    arbitro1Nombre: "",
    arbitro2Id: "",
    arbitro2Nombre: "",
    planillaId: "",
    planillaNombre: "",
    juecesLinea: [],
  });

  const [campeonatos, setCampeonatos] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos en paralelo
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [campeonatosSnap, arbitrosSnap, equiposSnap, partidoSnap] = await Promise.all([
          getDocs(collection(db, "campeonatos")),
          getDocs(collection(db, "arbitros")),
          getDocs(collection(db, "equipos")),
          getDoc(doc(db, "partidos", id)),
        ]);

        // 🔹 Convertir datos
        setCampeonatos(campeonatosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setArbitros(arbitrosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setEquipos(equiposSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        if (partidoSnap.exists()) {
          setForm({ ...partidoSnap.data() });
        } else {
          toast.error("❌ No se encontró el partido");
          navigate("/admin/partidos");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("❌ Error al cargar datos");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 🔹 Manejo de cambios en campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.endsWith("Id")) {
      const nombreField = name.replace(/Id$/, "Nombre");

      if (name === "campeonatoId") {
        const seleccionado = campeonatos.find((c) => c.id === value);
        setForm((prev) => ({
          ...prev,
          campeonatoId: value,
          campeonatoNombre: seleccionado ? seleccionado.nombre : "",
        }));
        return;
      }

      const seleccionadoArbitro = arbitros.find((a) => a.id === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        [nombreField]: seleccionadoArbitro
          ? `${seleccionadoArbitro.nombre} ${seleccionadoArbitro.apellido}`
          : "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const partidoRef = doc(db, "partidos", id);
      await updateDoc(partidoRef, {
        ...form,
        campeonatoNombre: form.campeonatoNombre || "",
        arbitro1Nombre: form.arbitro1Nombre || "",
        arbitro2Nombre: form.arbitro2Nombre || "",
        planillaNombre: form.planillaNombre || "",
      });
      toast.success("✅ Partido actualizado correctamente");
      navigate("/admin/partidos");
    } catch (error) {
      console.error("Error al actualizar partido:", error);
      toast.error("❌ Error al actualizar partido");
    }
  };

  // 🔹 Loader visual elegante
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium">Cargando datos del partido...</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Encabezado informativo */}
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Editar Partido</h2>
      <p className="text-gray-500 mb-6">
        {form.equipoA} vs {form.equipoB} — {form.campeonatoNombre || "Campeonato"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-5"
      >
        {/* Campeonato */}
        <select
          name="campeonatoId"
          value={form.campeonatoId}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">Seleccionar campeonato</option>
          {campeonatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {/* Categoría */}
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">Seleccionar categoría</option>
          <option value="U-13">U-13</option>
          <option value="U-15">U-15</option>
          <option value="U-17">U-17</option>
          <option value="U-19">U-19</option>
          <option value="Mayores">Mayores</option>
        </select>

        {/* Fase */}
        <select
          name="fase"
          value={form.fase}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="">Fase</option>
          <option value="Clasificación">Clasificación</option>
          <option value="Semifinal">Semifinal</option>
          <option value="3er Puesto">3er Puesto</option>
          <option value="Final">Final</option>
        </select>

        {/* Fecha */}
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />

        {/* Equipos */}
        <select
          name="equipoA"
          value={form.equipoA}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">Equipo A</option>
          {equipos.map((e) => (
            <option key={e.id} value={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>

        <select
          name="equipoB"
          value={form.equipoB}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">Equipo B</option>
          {equipos.map((e) => (
            <option key={e.id} value={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>

        {/* Género */}
        <select
          name="genero"
          value={form.genero}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">Género</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
          <option value="Mixto">Mixto</option>
        </select>

        {/* Scores */}
        <input
          type="number"
          name="scoreA"
          placeholder="Score Equipo A"
          value={form.scoreA}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="number"
          name="scoreB"
          placeholder="Score Equipo B"
          value={form.scoreB}
          onChange={handleChange}
          className="border rounded p-2"
        />

        {/* Terna Arbitral */}
        <div className="col-span-2 mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Terna Arbitral
          </h3>
        </div>

        <select
          name="arbitro1Id"
          value={form.arbitro1Id}
          onChange={handleChange}
          className="border rounded p-2"
          required
        >
          <option value="">1er Árbitro</option>
          {arbitros.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>

        <select
          name="arbitro2Id"
          value={form.arbitro2Id}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="">2do Árbitro</option>
          {arbitros.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>

        <select
          name="planillaId"
          value={form.planillaId}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="">Planilla</option>
          {arbitros.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>

        {/* Botones */}
        <div className="col-span-2 flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/partidos")}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPartido;
