import { useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const MURCIA_CENTER = [37.9892, -1.1306];

const categoryIcons = {
  Alojamiento: '<i class="ph ph-bed"></i>',
  Hotel: '<i class="ph ph-bed"></i>',
  Restaurante: '<i class="ph ph-fork-knife"></i>',
  Cafetería: '<i class="ph ph-coffee"></i>',
  Bar: '<i class="ph ph-beer-bottle"></i>',
  Panadería: '<i class="ph ph-storefront"></i>',
  "Comida para llevar": '<i class="ph ph-shopping-bag"></i>',
  "Entrega de comida": '<i class="ph ph-fork-knife"></i>',
  Tienda: '<i class="ph ph-shopping-cart"></i>',
  "Centro comercial": '<i class="ph ph-storefront"></i>',
  Supermercado: '<i class="ph ph-shopping-bag"></i>',
  "Tienda de licores": '<i class="ph ph-wine"></i>',
  Aeropuerto: '<i class="ph ph-airplane"></i>',
  "Estación de tren": '<i class="ph ph-train"></i>',
  "Estación de autobús": '<i class="ph ph-bus"></i>',
  Aparcamiento: '<i class="ph ph-car"></i>',
  Gasolinera: '<i class="ph ph-gas-pump"></i>',
  Hospital: '<i class="ph ph-first-aid-kit"></i>',
  Farmacia: '<i class="ph ph-first-aid"></i>',
  Salud: '<i class="ph ph-first-aid"></i>',
  Museo: '<i class="ph ph-bank"></i>',
  Parque: '<i class="ph ph-tree"></i>',
  "Atracción turística": '<i class="ph ph-map-pin"></i>',
  Gimnasio: '<i class="ph ph-barbell"></i>',
  Spa: '<i class="ph ph-drop"></i>',
  default: '<i class="ph ph-map-pin-line"></i>',
};

function createCustomIcon(category) {
  const iconHTML = categoryIcons[category] || categoryIcons.default;

  return L.divIcon({
    html: `<div style="background-color:#3b82f6;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:20px;">
      ${iconHTML}
    </div>`,
    className: "custom-marker-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function PopupBadge({ children, color = "#27ae60" }) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function SyncSelection({ selectedId, placesById, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;

    const place = placesById.get(String(selectedId));
    if (!place) return;

    const lat = Number(place.latitud);
    const lng = Number(place.longitud);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.6 });

    const mk = markerRefs.current[String(selectedId)];
    if (mk && mk.openPopup) mk.openPopup();
  }, [selectedId, placesById, markerRefs, map]);

  return null;
}

export default function MapaInteractivo({
  lugares = [],
  selectedId = null,
  onSelectId = () => {},
}) {
  const safePlaces = useMemo(() => {
    return (lugares ?? []).filter((p) => {
      const lat = Number(p.latitud);
      const lng = Number(p.longitud);
      return Number.isFinite(lat) && Number.isFinite(lng);
    });
  }, [lugares]);

  const markerRefs = useRef({});

  const placesById = useMemo(() => {
    const m = new Map();
    for (const p of safePlaces) {
      m.set(String(getPlaceKey(p)), p);
    }
    return m;
  }, [safePlaces]);

  return (
    <MapContainer center={MURCIA_CENTER} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenMapTiles &copy; OpenStreetMap contributors"
      />

      {safePlaces.map((lugar) => {
        const id = String(getPlaceKey(lugar));
        const lat = Number(lugar.latitud);
        const lng = Number(lugar.longitud);

        return (
          <Marker
            key={id}
            position={[lat, lng]}
            icon={createCustomIcon(lugar.categoria)}
            ref={(ref) => {
              if (ref) markerRefs.current[id] = ref;
            }}
            eventHandlers={{
              click: () => onSelectId(id),
            }}
          >
            <Popup maxWidth={320}>
              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50", fontSize: "16px" }}>
                  {lugar.nombre}
                </h3>

                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {lugar.categoria}
                  </span>
                </div>

                {lugar.direccion && (
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                    📍 {lugar.direccion}
                  </p>
                )}

                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
                  <strong style={{ fontSize: "13px", color: "#2c3e50" }}>Accesibilidad:</strong>

                  <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {lugar.rampa && <PopupBadge color="#10b981">♿ Rampa</PopupBadge>}
                    {lugar.aseoAdaptado && <PopupBadge color="#3b82f6">🚻 Aseo</PopupBadge>}
                    {lugar.aparcamientoAccesible && <PopupBadge color="#8b5cf6">🅿️ Parking</PopupBadge>}
                    {lugar.ascensorPlataforma && <PopupBadge color="#f59e0b">🛗 Ascensor</PopupBadge>}
                    {lugar.perroGuia && <PopupBadge color="#ec4899">🦮 Perro guía</PopupBadge>}
                    {lugar.infoAudio && <PopupBadge color="#14b8a6">🔊 Audio</PopupBadge>}
                    {lugar.senaleticaBraille && <PopupBadge color="#6366f1">👆 Braille</PopupBadge>}
                    {lugar.infoSubtitulos && <PopupBadge color="#ef4444">📝 Subtítulos</PopupBadge>}

                    {!lugar.rampa &&
                      !lugar.aseoAdaptado &&
                      !lugar.aparcamientoAccesible &&
                      !lugar.ascensorPlataforma &&
                      !lugar.perroGuia &&
                      !lugar.infoAudio &&
                      !lugar.senaleticaBraille &&
                      !lugar.infoSubtitulos && (
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          Sin información de accesibilidad
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      <SyncSelection selectedId={selectedId} placesById={placesById} markerRefs={markerRefs} />
    </MapContainer>
  );
}

function getPlaceKey(l) {
  return l.id ?? l.google_place_id ?? l.placeId ?? `${l.nombre}-${l.latitud}-${l.longitud}`;
}
