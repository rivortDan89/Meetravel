import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/maps.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Maps() {
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("Cargando...");

  useEffect(() => {
    fetch(`${API_URL}/lugares-accesibles`)
      .then((r) => r.json())
      .then((data) => {
        setPlaces(Array.isArray(data) ? data : []);
        setStatus("OK");
      })
      .catch(() => setStatus("Error cargando lugares"));
  }, []);

  const center = useMemo(() => {
    if (places[0]?.lat && places[0]?.lng) return [Number(places[0].lat), Number(places[0].lng)];
    return [40.4168, -3.7038];
  }, [places]);

  return (
    <main className="mapsPage">
      <div className="mapsLayout">
        <section className="mapsBox">
          <MapContainer center={center} zoom={13} scrollWheelZoom>
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {places.map((p) => (
              <CircleMarker
                key={p.id ?? p.placeId ?? `${p.lat}-${p.lng}`}
                center={[Number(p.lat), Number(p.lng)]}
                radius={8}
                pathOptions={{ color: "#b6361c" }}
              >
                <Popup>
                  <strong>{p.nombre ?? "Lugar"}</strong>
                  <div>{p.direccion ?? "Sin dirección"}</div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </section>

        <aside className="panel">
          <h1 className="panel__title">Mapa de accesibilidad</h1>
          <p className="panel__status">Estado: {status}</p>

          <div className="panel__list">
            {places.map((p) => (
              <div key={p.id ?? p.placeId ?? p.nombre} className="placeItem">
                <div className="placeItem__name">{p.nombre ?? "Lugar"}</div>
                <div className="placeItem__meta">{p.ciudad ?? "—"}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
