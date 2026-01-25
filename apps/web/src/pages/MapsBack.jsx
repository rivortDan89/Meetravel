// Importa los hooks de React para manejar estado y efectos (peticiones, etc.)
import { useEffect, useState } from "react";
// Importa los estilos específicos de la página de mapas
import "../styles/maps.css";
// Importa el componente que pinta el mapa de Leaflet con los marcadores
import MapaInteractivo from "../components/MapaInteractivo";

/*Cuando más abajo explico los componentes de barra buscador, filtrado por accesibilidad 
y las tarjetas individuales con media puntuación de las reseñas de accesibilidad en el caso de que se exportaran
  deberiamos de poner en Maps.jsx arriba del todo esto :
import SearchBar from "../components/SearchBar";
import FiltersBar from "../components/FiltersBar";
import PlacesList from "../components/PlacesList"; */

// URL base de la API; usa la variable de entorno o localhost por defecto
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";


// Normaliza un texto para compararlo sin distinguir mayúsculas ni tildes
function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")              // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, ""); // elimina las tildes
}

// Función que aplica búsqueda y filtros sobre el array de lugares 
// Se define fuera del componente porque no necesita hooks de React   

// Aplica el buscador por texto y los filtros de accesibilidad a la lista de lugares
function applyFilters(places, filters, search = "") {
  // Normalizamos el texto que escribe el usuario (minúsculas, sin tildes)
  const q = normalize(search);   // búsqueda normalizada [file:224]

  return places
    // 1) Filtro de búsqueda por nombre o categoría
    .filter((place) => {
      // Si no hay texto de búsqueda, no filtramos por nombre/categoría
      if (!q) return true;

      // Normalizamos nombre y categoría del lugar
      const name = normalize(place.nombre || "");
      const cat = normalize(place.categoria || "");

      // Aceptamos el lugar si el texto aparece en el nombre o en la categoría
      return name.includes(q) || cat.includes(q);
    })
    // 2) Filtro por características de accesibilidad (botones de filtros)
    .filter((place) => {
      // Si el filtro está activo pero el lugar no tiene esa característica → se excluye
      if (filters.rampa && !place.rampa) return false;
      if (filters.aseoAdaptado && !place.aseoAdaptado) return false;
      if (filters.aparcamientoAccesible && !place.aparcamientoAccesible) return false;
      if (filters.ascensorPlataforma && !place.ascensorPlataforma) return false;
      if (filters.perroGuia && !place.perroGuia) return false;
      if (filters.infoAudio && !place.infoAudio) return false;
      if (filters.senaleticaBraille && !place.senaleticaBraille) return false;
      if (filters.infoSubtitulos && !place.infoSubtitulos) return false;

      // Si pasa todos los filtros activos, el lugar se mantiene en la lista
      return true;
    });
}

// Componente de página que combina mapa + panel lateral de lugares
export default function MapsBack() {
  // Lista completa de lugares que llega de la API
  const [places, setPlaces] = useState([]);
  // Estado de carga para mostrar si está cargando o hubo error
  const [status, setStatus] = useState("Cargando...");
  // Objeto con los filtros de accesibilidad activos (rampa, aseo, etc.)
  const [filters, setFilters] = useState({});
  // Texto que escribe el usuario en el buscador del panel derecho
  const [search, setSearch] = useState("");

  // Lista de lugares tras aplicar búsqueda + filtros
  const filteredPlaces = applyFilters(places, filters, search);

  // Efecto que se ejecuta una vez al montar el componente para pedir los datos
  useEffect(() => {
    fetch(`${API_URL}/api/places`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Asegura que siempre guardamos un array, aunque la API devuelva otra cosa
        setPlaces(Array.isArray(data) ? data : []);
        setStatus("OK");
      })
      .catch((e) => {
        console.error("Error fetch /api/places:", e);
        setStatus("Error cargando lugares");
      });
  }, []); // [] → solo se ejecuta una vez (cuando se monta la página)

  // Render de la página de mapas: layout con mapa a la izquierda y panel a la derecha
  return (
    <main className="mapsPage">
      <div className="mapsLayout">
        {/* Columna izquierda: mapa interactivo */}
        <section className="mapsBox">
          {/* Solo muestra el mapa cuando la carga de datos ha ido bien */}
          {status === "OK" && <MapaInteractivo lugares={filteredPlaces} />}
        </section>

        {/* Columna derecha: panel con buscador y lista de lugares */}
        <aside className="panel">

          {/* Buscador por nombre/categoría que se exportaría en un componente llamado SearchBar.jsx 
          que se debe guardar en src/components */}
          
          <input
            type="text"
            placeholder="Buscar bar, restaurante, hotel, museo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="maps-buscador"
          />

          {/* Contenedor de los botones de filtros, para maquetarlos en fila que se puede exportar como un
           componente llamado  FiltersBar.jsx que se debe guardar en src/components */}

          <div className="filters-row">
            

            {/* Rampa */}
            <button
              type="button" // evita que se comporte como submit dentro de un <form>
              // Si filters.rampa es true aplica la clase 'active', si no, la normal
              className={filters.rampa ? "filter-btn active" : "filter-btn"}
              // Al hacer clic se invierte el valor de filters.rampa
              onClick={() =>
                setFilters((f) => ({ ...f, rampa: !f.rampa }))
              }
            >
              Rampa
            </button>

            {/* Aseo adaptado */}
            <button
              type="button"
              // Marca visualmente el botón si el filtro aseoAdaptado está activo
              className={filters.aseoAdaptado ? "filter-btn active" : "filter-btn"}
              // Cambia filters.aseoAdaptado de true a false o al revés
              onClick={() =>
                setFilters((f) => ({ ...f, aseoAdaptado: !f.aseoAdaptado }))
              }
            >
              Aseo
            </button>

            {/* Parking accesible */}
            <button
              type="button"
              // Activa la clase 'active' cuando el filtro de parking está a true
              className={filters.aparcamientoAccesible ? "filter-btn active" : "filter-btn"}
              // Actualiza el objeto filters manteniendo el resto de filtros igual
              onClick={() =>
                setFilters((f) => ({
                  ...f, // copia el estado anterior de todos los filtros
                  aparcamientoAccesible: !f.aparcamientoAccesible, // invierte solo este
                }))
              }
            >
              Parking
            </button>
            {/* Ascensor / plataforma */}
            <button
              type="button"
              className={filters.ascensorPlataforma ? "filter-btn active" : "filter-btn"}
              onClick={() =>
                setFilters((f) => ({ ...f, ascensorPlataforma: !f.ascensorPlataforma }))
              }
            >
              Ascensor
            </button>

            {/* Perro guía */}
            <button
              type="button"
              className={filters.perroGuia ? "filter-btn active" : "filter-btn"}
              onClick={() =>
                setFilters((f) => ({ ...f, perroGuia: !f.perroGuia }))
              }
            >
              Perro guía
            </button>

            {/* Info audio */}
            <button
              type="button"
              className={filters.infoAudio ? "filter-btn active" : "filter-btn"}
              onClick={() =>
                setFilters((f) => ({ ...f, infoAudio: !f.infoAudio }))
              }
            >
              Audio
            </button>

            {/* Señalética Braille */}
            <button
              type="button"
              className={filters.senaleticaBraille ? "filter-btn active" : "filter-btn"}
              onClick={() =>
                setFilters((f) => ({ ...f, senaleticaBraille: !f.senaleticaBraille }))
              }
            >
              Braille
            </button>

            {/* Subtítulos */}
            <button
              type="button"
              className={filters.infoSubtitulos ? "filter-btn active" : "filter-btn"}
              onClick={() =>
                setFilters((f) => ({ ...f, infoSubtitulos: !f.infoSubtitulos }))
              }
            >
              Subtítulos
            </button>
          </div>


          {/* Título y estado de la carga de la API */}
          <h1 className="panel__title">Lugares populares en la zona</h1>


          {/* Lista de tarjetas de lugares (ya filtrados) , con media de puntuación( solo nos 
          aparecerá si la media de alguna etiqueta es mayor de 2.5). Se debe exportar el componente llamado PlaceItem.jsx
           que se puede guardar en src/components */}
          <div className="panel__list">
            {filteredPlaces.map((p) => (
              <div key={p.id ?? p.placeId ?? p.nombre} className="placeItem">
                <div className="placeItem__name">{p.nombre ?? "Lugar"}</div>
                <div className="placeItem__meta">
                  {p.categoria ?? "—"} · {p.direccion ?? "Sin dirección"}
                </div>

                {/* Etiquetas de accesibilidad con media de puntuación(todas las que tengan media >= 2.5) */}
                <div className="placeItem__tags">
                  {p.avgRampa >= 2.5 && (
                    <span className="tag tag--ok">
                      Rampa {p.avgRampa.toFixed(1)}
                    </span>
                  )}

                  {p.avgAseoAdaptado >= 2.5 && (
                    <span className="tag tag--ok">
                      Aseo {p.avgAseoAdaptado.toFixed(1)}
                    </span>
                  )}

                  {p.avgAparcamientoAccesible >= 2.5 && (
                    <span className="tag tag--ok">
                      Parking {p.avgAparcamientoAccesible.toFixed(1)}
                    </span>
                  )}

                  {p.avgAscensorPlataforma >= 2.5 && (
                    <span className="tag tag--ok">
                      Ascensor {p.avgAscensorPlataforma.toFixed(1)}
                    </span>
                  )}

                  {p.avgPerroGuia >= 2.5 && (
                    <span className="tag tag--ok">
                      Perro guía {p.avgPerroGuia.toFixed(1)}
                    </span>
                  )}

                  {p.avgInfoAudio >= 2.5 && (
                    <span className="tag tag--ok">
                      Audio {p.avgInfoAudio.toFixed(1)}
                    </span>
                  )}

                  {p.avgSenaleticaBraille >= 2.5 && (
                    <span className="tag tag--ok">
                      Braille {p.avgSenaleticaBraille.toFixed(1)}
                    </span>
                  )}

                  {p.avgInfoSubtitulos >= 2.5 && (
                    <span className="tag tag--ok">
                      Subtítulos {p.avgInfoSubtitulos.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
