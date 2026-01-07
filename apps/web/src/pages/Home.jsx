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

      <section className="homeHero">
        <h1 className="homeHero__h1">Explora. Comparte. Organiza.</h1>
      </section>

      <p>Conexión Front ↔ Back: {status}</p>

    </main>
  );
}
