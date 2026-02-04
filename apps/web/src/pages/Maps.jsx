import { useEffect, useMemo, useState } from "react";
import "../styles/maps.css";

import MapaInteractivo from "../components/MapaInteractivo";
import PanelLista from "../components/PanelLista";
import PanelVacio from "../components/PanelVacio";
import PanelDetalle from "../components/PanelDetalle";

import { getPlaces } from "../services/api";

// Normaliza texto (minúsculas + sin tildes)
function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Clave estable para selección (misma lógica que ya usas)
function getPlaceKey(l) {
  return l.id ?? l.google_place_id ?? l.placeId ?? `${l.nombre}-${l.latitud}-${l.longitud}`;
}

// Aplica buscador + filtros de accesibilidad (estilo MapsBack)
function applyFilters(places, filters, search = "") {
  const q = normalize(search);

  return (places ?? [])
    // 1) Buscador por nombre/categoría/dirección
    .filter((p) => {
      if (!q) return true;
      const haystack = normalize([p.nombre, p.categoria, p.direccion].filter(Boolean).join(" · "));
      return haystack.includes(q);
    })
    // 2) Filtros de accesibilidad
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

  // selección sincronizada tarjeta <-> marcador
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
        setPlaces([]);
        setStatus("Error cargando lugares");
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

  // 👇 Importante: NO hacemos setState dentro de un effect para “limpiar”
  // Así evitas el warning “setState inside effect”.
  const selectedPlace = useMemo(() => {
    if (!selectedId) return null;
    return filteredPlaces.find((p) => String(getPlaceKey(p)) === String(selectedId)) ?? null;
  }, [filteredPlaces, selectedId]);

  // Si quieres seguir respetando view (opcional)
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

        {/* DERECHA: Panel con lógica Detalle/Vacío/Lista */}
        <section className="mapsRight">
          <div className="panel">
            {(forceDetail || selectedPlace) ? (
              <PanelDetalle
                place={selectedPlace}
                onBack={() => setSelectedId(null)}
              />
            ) : (forceEmpty || filteredPlaces.length === 0) ? (
              <PanelVacio
                search={search}
                onClearSearch={() => setSearch("")}
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
