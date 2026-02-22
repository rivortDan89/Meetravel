import { useEffect, useMemo, useState } from "react";
import "../styles/maps.css";

import MapaInteractivo from "../components/MapaInteractivo";
import PanelLista from "../components/PanelLista";
import PanelVacio from "../components/PanelVacio";
import PanelDetalle from "../components/PanelDetalle";

import { getPlaces } from "../services/api";

// Función de normalización para texto y evitar problemas con acentos, mayúsculas, etc. (útil para el buscador)
function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Generamos una clave lo más estable posible para cada lugar, intentando usar un ID único si existe, o una combinación de campos si no. Esto es útil para la selección y renderizado eficiente.
function getPlaceKey(l) {
  return l.id ?? l.google_place_id ?? l.placeId ?? `${l.nombre}-${l.latitud}-${l.longitud}`;
}

// Función que aplica primero el buscador por texto y después los filtros de accesibilidad.
// Decidimos hacerlo en Frontend para evitar peticiones constantes al Backend.
function applyFilters(places, filters, search = "") {
  const q = normalize(search);

  return (places ?? [])
    .filter((p) => {
      if (!q) return true;
      const haystack = normalize([p.nombre, p.categoria, p.direccion].filter(Boolean).join(" · "));
      return haystack.includes(q);
    })
    .filter((p) => {
      if (filters.rampa && !p.rampa) return false;
      if (filters.aseoAdaptado && !p.aseoAdaptado) return false;
      if (filters.aparcamientoAccesible && !p.aparcamientoAccesible) return false;
      if (filters.ascensorPlataforma && !p.ascensorPlataforma) return false;
      if (filters.perroGuia && !p.perroGuia) return false;
      if (filters.infoAudio && !p.infoAudio) return false;
      if (filters.senaleticaBraille && !p.senaleticaBraille) return false;
      if (filters.infoSubtitulos && !p.infoSubtitulos) return false;
      return true;
    });
}

export default function Maps({ view = "lista" }) {
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("Cargando...");
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  // Estado compartido para sincronizar la selección entre la lista y el mapa.
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setStatus("Cargando...");
        const data = await getPlaces();
        const rows = Array.isArray(data) ? data : (data.rows ?? data.lugares ?? []);
        if (!alive) return;
        setPlaces(rows);
        setStatus("OK");
      } catch (e) {
        console.error("Error getPlaces:", e);
        if (!alive) return;
        setStatus("Error cargando lugares");
        setPlaces([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filteredPlaces = useMemo(
    () => applyFilters(places, filters, search),
    [places, filters, search]
  );

  // Si el lugar seleccionado deja de estar en la lista filtrada (por ejemplo, por un cambio en los filtros o el buscador), evitamos mostrar un detalle incoherente devolviendo null.
  const selectedPlace = useMemo(() => {
    if (!selectedId) return null;
    return filteredPlaces.find((p) => String(getPlaceKey(p)) === String(selectedId)) ?? null;
  }, [filteredPlaces, selectedId]);

  // Vista forzada para pruebas o navegación interna. 
  // Actualmente no es imprescindible, pero lo dejamos por si ampliamos funcionalidades.
  const forceEmpty = view === "vacio";
  const forceDetail = view === "detalle";

  return (
    <main className="maps">
      <div className="mapsLayout">
        {/* IZQUIERDA: Mapa */}
        <section className="mapsLeft">
          <div className="mapBox">
            {status !== "OK" && <div style={{ padding: 12 }}>{status}</div>}

            {status === "OK" && (
              <MapaInteractivo
                lugares={filteredPlaces}
                selectedId={selectedId}
                onSelectId={setSelectedId}
              />
            )}
          </div>
        </section>

        {/* DERECHA: Panel con lógica Detalle / Vacío / Lista */}
        <section className="mapsRight">
          <div className="panel">
            {(forceDetail || selectedPlace) ? (
              <PanelDetalle
                key={selectedId ?? "no-selection"}   // 👈 Usamos key para forzar que el componente se reinicie cuando cambia al lugar seleccionado.
                place={selectedPlace}                // Así evitamos que se mantenga estado interno anterior.
                onBack={() => setSelectedId(null)}
              />
            ) : (forceEmpty || filteredPlaces.length === 0) ? (
              <PanelVacio
                search={search}
                onClearSearch={() => setSearch("")}
                filters={filters}
                onChangeFilters={setFilters}
              />
            ) : (
              <PanelLista
                places={filteredPlaces}
                selectedId={selectedId}
                onSelectPlace={(p) => setSelectedId(String(getPlaceKey(p)))}
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                onChangeFilters={setFilters}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
