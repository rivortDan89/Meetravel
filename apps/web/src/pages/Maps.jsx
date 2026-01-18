import { useEffect, useState } from "react";
import "../styles/maps.css";
import MapaInteractivo from "../components/MapaInteractivo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Maps() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/places`)
      .then((r) => r.json())
      .then((data) => {
        setPlaces(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("Error fetch /api/places:", e);
      });
  }, []);

  return (
    <main className="mapsPage">
      <div className="mapsLayout">
        {/* Columna izquierda: mapa */}
        <section className="mapsBox">
          <h1>Mapa básico</h1>
          <MapaInteractivo lugares={places} />
        </section>

        {/* Columna derecha: lista sencilla */}
        <aside className="panel">
          <h2>Lugares</h2>
          <ul>
            {places.map((p) => (
              <li key={p.id ?? p.placeId ?? p.nombre}>
                {p.nombre} ({p.categoria})
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}