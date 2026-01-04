// Maps.jsx
import { useEffect, useState } from "react";
import MapaInteractivo from "./MapaInteractivo";

export default function Maps() {
  // Lista completa de lugares que vienen del backend
  const [lugares, setLugares] = useState([]);
  // Estado con los filtros (por ahora solo silla de ruedas)
  const [filtros, setFiltros] = useState({});
  // Estado para mostrar errores de la API
  const [error, setError] = useState("");

  // Al montar la página, pedimos los lugares accesibles al backend
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    fetch(`${apiUrl}/lugares-accesibles`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setLugares)
      .catch((e) => setError(e.message));
  }, []);

  // Aplicamos los filtros al array de lugares
  const lugaresFiltrados = aplicarFiltros(lugares, filtros);

  return (
    <div className="maps-page">
      {/* ENCABEZADO */}
      <header className="maps-header">
        <div className="logo">MeeTravel</div>
        <nav className="maps-nav">
          <button>Iniciar sesión</button>
          <button>Registrarse</button>
     
        </nav>
      </header>

      {/* CUERPO: filtros + lista lateral */}
      <main className="maps-main">
        <section className="maps-filtros">
          <h2>Filtros de accesibilidad</h2>

          {/* Ejemplo de filtro: accesible con silla de ruedas */}
          <label>
            <input
              type="checkbox"
              checked={!!filtros.sillaRuedas}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, sillaRuedas: e.target.checked }))
              }
            />
            Accesible con silla de ruedas
          </label>

          {/* Aquí añadirás más checkboxes para el resto de etiquetas */}
        </section>

        <aside className="maps-lateral">
          <h3>Lugares accesibles cercanos</h3>
          {error && <p className="error">Error: {error}</p>}

          <ul className="maps-lista">
            {lugaresFiltrados.map((lugar) => (
              <li key={lugar.id_lugar} className="maps-card">
                <h4>{lugar.nombre}</h4>
                <p>{lugar.descripcion}</p>
                {/* aquí puedes mostrar las etiquetas de accesibilidad del lugar */}
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* MAPA ABAJO */}
      <section className="maps-map-section">
        <MapaInteractivo lugares={lugaresFiltrados} />
      </section>

    </div>
  );
}

// Función que decide qué lugares pasan los filtros
function aplicarFiltros(lugares, filtros) {
  return lugares.filter((lugar) => {
    // ejemplo: si el filtro sillaRuedas está activo,
    // solo dejamos lugares que tengan esa propiedad a true
    if (filtros.sillaRuedas && !lugar.sillaRuedas) {
      return false;
    }
    return true;
  });
}
