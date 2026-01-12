import { useEffect, useState } from "react";
import MapaInteractivo from "../components/MapaInteractivo";

export default function MapsBack() {
  const [lugares, setLugares] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    fetch(`${apiUrl}/api/lugares`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log('✅ Lugares cargados:', data); // Para debug
        setLugares(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error('❌ Error:', e); // Para debug
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const lugaresFiltrados = aplicarFiltros(lugares, filtros, busqueda);

  return (
    <div className="maps-page">
      <header className="maps-header">
        <div className="logo">MeeTravel</div>
        <nav className="maps-nav">
          <button>Iniciar sesión</button>
          <button>Registrarse</button>
        </nav>
      </header>

      <main className="maps-main">
        <section className="maps-filtros">
          <h2>Filtros de accesibilidad</h2>
          <input
            type="text"
            placeholder="Buscar bar, restaurante, hotel, museo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="maps-buscador"
          />
          <label>
            <input
              type="checkbox"
              checked={!!filtros.rampa}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, rampa: e.target.checked }))
              }
            />
            ♿ Rampa
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.aseoAdaptado}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, aseoAdaptado: e.target.checked }))
              }
            />
            🚻 Aseo adaptado
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.aparcamientoAccesible}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, aparcamientoAccesible: e.target.checked }))
              }
            />
            🅿️ Aparcamiento accesible
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.ascensorPlataforma}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, ascensorPlataforma: e.target.checked }))
              }
            />
            🛗 Ascensor o plataforma
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.perroGuia}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, perroGuia: e.target.checked }))
              }
            />
            🦮 Perro guía
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.infoAudio}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, infoAudio: e.target.checked }))
              }
            />
            🔊 Información en audio
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.senaleticaBraille}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, senaleticaBraille: e.target.checked }))
              }
            />
            👆 Señalética en braille
          </label>

          <label>
            <input
              type="checkbox"
              checked={!!filtros.infoSubtitulos}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, infoSubtitulos: e.target.checked }))
              }
            />
            📝 Información con subtítulos
          </label>
        </section>

        <aside className="maps-lateral">
          <h3>Lugares accesibles cercanos</h3>

          {loading && <p>Cargando lugares...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && (
            <p>Encontrados {lugaresFiltrados.length} lugares</p>
          )}

          <ul className="maps-lista">
            {lugaresFiltrados.map((lugar) => (
              <li key={lugar.id} className="maps-card">
                <h4>{lugar.nombre}</h4>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  {lugar.categoria}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {lugar.direccion}
                </p>

                {/* Etiquetas de accesibilidad */}
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {lugar.sillaRuedas && <Badge>♿</Badge>}
                  {lugar.aseoAdaptado && <Badge>🚻</Badge>}
                  {lugar.aparcamientoAccesible && <Badge>🅿️</Badge>}
                  {lugar.ascensorPlataforma && <Badge>🛗</Badge>}
                  {lugar.perroGuia && <Badge>🦮</Badge>}
                  {lugar.infoAudio && <Badge>🔊</Badge>}
                  {lugar.senaleticaBraille && <Badge>👆</Badge>}
                  {lugar.infoSubtitulos && <Badge>📝</Badge>}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <section className="maps-map-section">
        {!loading && <MapaInteractivo lugares={lugaresFiltrados} />}
      </section>
    </div>
  );
}

// Componente auxiliar para los badges
function Badge({ children }) {
  return (
    <span style={{
      backgroundColor: '#27ae60',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '3px',
      fontSize: '14px'
    }}>
      {children}
    </span>
  );
}

function aplicarFiltros(lugares, filtros, busqueda = "") {
  // Pasamos la cadena de búsqueda a minúsculas para hacer la comparación
  // sin distinguir entre mayúsculas y minúsculas
  const q = busqueda.toLowerCase();

  return lugares
    // 1) PRIMER FILTER: filtrar por texto (nombre o categoría)
    .filter((lugar) => {
      // Si no hay texto de búsqueda (q es cadena vacía),
      // no filtramos por texto: dejamos pasar todos los lugares
      if (!q) return true;

      // Si hay texto, comprobamos:
      // - que el nombre del lugar contenga q
      // - O que la categoría del lugar contenga q
      // Ej.: q = "restaurante" → pasa si nombre o categoría incluyen "restaurante"
      return (
        lugar.nombre.toLowerCase().includes(q) ||
        lugar.categoria.toLowerCase().includes(q)
      );
    })
    // 2) SEGUNDO FILTER: filtros de accesibilidad
    .filter((lugar) => {
      // Cada línea dice:
      // "si este filtro está activado en `filtros` PERO el lugar
      // no tiene esa característica, entonces excluye el lugar (return false)"

      if (filtros.sillaRuedas && !lugar.sillaRuedas) return false;
      if (filtros.aseoAdaptado && !lugar.aseoAdaptado) return false;
      if (filtros.aparcamientoAccesible && !lugar.aparcamientoAccesible) return false;
      if (filtros.ascensorPlataforma && !lugar.ascensorPlataforma) return false;
      if (filtros.perroGuia && !lugar.perroGuia) return false;
      if (filtros.infoAudio && !lugar.infoAudio) return false;
      if (filtros.senaleticaBraille && !lugar.senaleticaBraille) return false;
      if (filtros.infoSubtitulos && !lugar.infoSubtitulos) return false;

      // Si pasa todas las comprobaciones anteriores,
      // el lugar cumple todos los filtros activos → lo dejamos pasar
      return true;
    });
}
