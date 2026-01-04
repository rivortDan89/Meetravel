import { useEffect, useState } from "react";
import MapaInteractivo from "../components/MapaInteractivo";

export default function Maps() {
  const [lugares, setLugares] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    fetch(`${apiUrl}/lugares-accesibles`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setLugares(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const lugaresFiltrados = aplicarFiltros(lugares, filtros);

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

          <label>
            <input
              type="checkbox"
              checked={!!filtros.sillaRuedas}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, sillaRuedas: e.target.checked }))
              }
            />
            ♿ Silla de ruedas
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

// Función que filtra lugares según las etiquetas seleccionadas
function aplicarFiltros(lugares, filtros) {
  return lugares.filter((lugar) => {
    // Si hay filtros activos, el lugar debe cumplir TODOS
    if (filtros.sillaRuedas && !lugar.sillaRuedas) return false;
    if (filtros.aseoAdaptado && !lugar.aseoAdaptado) return false;
    if (filtros.aparcamientoAccesible && !lugar.aparcamientoAccesible) return false;
    if (filtros.ascensorPlataforma && !lugar.ascensorPlataforma) return false;
    if (filtros.perroGuia && !lugar.perroGuia) return false;
    if (filtros.infoAudio && !lugar.infoAudio) return false;
    if (filtros.senaleticaBraille && !lugar.senaleticaBraille) return false;
    if (filtros.infoSubtitulos && !lugar.infoSubtitulos) return false;

    return true;
  });
}