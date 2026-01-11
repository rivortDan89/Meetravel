// Importa los hooks de React y el componente del mapa
import { useEffect, useState } from "react";
import MapaInteractivo from "../components/MapaInteractivo";

export default function Maps() {
  // Estado para guardar los lugares que vienen de la API
  const [lugares, setLugares] = useState([]);
  // Estado para guardar un posible mensaje de error
  const [error, setError] = useState("");
  // Estado para saber si todavía estamos cargando los datos
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez al montar el componente ([]) 
  // y hace la petición al backend
  useEffect(() => {
    // URL base de la API: primero mira la variable de entorno
    // y si no existe usa http://localhost:3001
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    // Petición HTTP GET a /api/lugares
    fetch(`${apiUrl}/api/lugares`)
      .then((r) => {
        // Si la respuesta no es 2xx, lanzamos un error para que lo capture el catch
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        // Convertimos la respuesta a JSON
        return r.json();
      })
      .then((data) => {
        // Mostramos por consola los lugares recibidos (útil para debug)
        console.log("✅ Lugares cargados:", data);
        // Guardamos los lugares en el estado
        setLugares(data);
        // Marcamos que ya ha terminado la carga
        setLoading(false);
      })
      .catch((e) => {
        // Si algo falla (red, servidor, etc.), lo mostramos en consola
        console.error("❌ Error:", e);
        // Guardamos el mensaje de error para mostrarlo en pantalla
        setError(e.message);
        // También paramos el estado de carga
        setLoading(false);
      });
  }, []); // El array vacío hace que solo se ejecute una vez al montar el componente

  // Mientras se están cargando los datos, mostramos un texto de "Cargando..."
  if (loading) return <p>Cargando lugares...</p>;

  // Si hubo un error, mostramos el mensaje de error
  if (error) return <p className="error">Error: {error}</p>;

  // Si todo fue bien, renderizamos el mapa interactivo
  // y le pasamos los lugares como prop
  return (
    <section className="maps-map-section">
      <MapaInteractivo lugares={lugares} />
    </section>
  );
}
