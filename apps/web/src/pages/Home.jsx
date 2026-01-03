import { useEffect, useState } from "react";
import { getHealth } from "../services/api";

export default function Home() {
  const [status, setStatus] = useState("Cargando...");

  useEffect(() => {
    getHealth()
      .then((r) => setStatus(r.status))
      .catch(() => setStatus("Error conectando con el back"));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>MeeTravel</h1>
      <p>Conexión Front ↔ Back: {status}</p>
    </main>
  );
}
