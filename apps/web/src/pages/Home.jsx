import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHealth } from "../services/api";

export default function Home() {
  const [status, setStatus] = useState("Cargando...");
  const navigate = useNavigate();

  useEffect(() => {
    getHealth()
      .then((r) => setStatus(r.status))
      .catch(() => setStatus("Error conectando con el back"));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>MeeTravel</h1>
      <p>Conexión Front ↔ Back: {status}</p>

      <div style={{ marginTop: 20, display: 'flex', gap: 15 }}>
        <button onClick={() => navigate('/maps')}>
          🗺️ Ver Mapa
        </button>
        <button onClick={() => navigate('/buscar-viaje')}>
          ✈️ Buscar Viaje
        </button>
      </div>
    </main>
  );
}
