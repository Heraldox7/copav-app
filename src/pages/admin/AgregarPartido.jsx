// src/pages/admin/AgregarPartido.jsx
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AgregarPartido = () => {
  const navigate = useNavigate();

  // Estado del formulario
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

  // Datos de Firestore
  const [campeonatos, setCampeonatos] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Cargar datos desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campeonatosSnap = await getDocs(collection(db, "campeonatos"));
        const arbitrosSnap = await getDocs(collection(db, "arbitros"));
        const equiposSnap = await getDocs(collection(db, "equipos"));

        setCampeonatos(
          campeonatosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setArbitros(
          arbitrosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setEquipos(equiposSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia el campeonato, actualiza también el nombre
    if (name === "campeonatoId") {
      const seleccionado = campeonatos.find((c) => c.id === value);
      setForm({
        ...form,
        campeonatoId: value,
        campeonatoNombre: seleccionado ? seleccionado.nombre : "",
      });
    } else if (name.includes("arbitro")) {
      const seleccionado = arbitros.find((a) => a.id === value);
      setForm({
        ...form,
        [name]: value,
        [`${name.replace("Id", "Nombre")}`]: seleccionado
          ? `${seleccionado.nombre} ${seleccionado.apellido}`
          : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Manejar los jueces de línea (opcional)
  const handleJuezLineaChange = (index, value) => {
    const seleccionado = arbitros.find((a) => a.id === value);
    const nuevosJueces = [...form.juecesLinea];
    nuevosJueces[index] = seleccionado
      ? { id: value, nombre: `${seleccionado.nombre} ${seleccionado.apellido}` }
      : null;
    setForm({ ...form, juecesLinea: nuevosJueces.filter(Boolean) });
  };

  // Guardar en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...form,
        creadoEn: new Date().toISOString(),
      };
      await addDoc(collection(db, "partidos"), dataToSave);
      toast.success("✅ Partido registrado correctamente");
      navigate("/admin/partidos");
    } catch (error) {
      console.error("Error al guardar partido:", error);
      toast.error("❌ Error al guardar partido");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Agregar Partido
      </h2>

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

        {/* Score */}
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

        {/* Título sección */}
        <div className="col-span-2 mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Terna Arbitral
          </h3>
        </div>

        {/* Árbitros */}
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

        {/* Jueces de Línea */}
        <div className="col-span-2 mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Jueces de Línea (opcional)
          </h3>
          {[0, 1, 2, 3].map((i) => (
            <select
              key={i}
              onChange={(e) => handleJuezLineaChange(i, e.target.value)}
              className="border rounded p-2 mb-2 w-full"
            >
              <option value="">Seleccionar juez de línea {i + 1}</option>
              {arbitros.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} {a.apellido}
                </option>
              ))}
            </select>
          ))}
        </div>

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
            Guardar Partido
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarPartido;
