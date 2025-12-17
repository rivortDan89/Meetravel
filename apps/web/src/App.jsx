import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Mundo Viajes</h1>
      <h2>Conexión Front ↔ Back</h2>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        !error && <p>Cargando /health...</p>
      )}
    </div>
  );
}
