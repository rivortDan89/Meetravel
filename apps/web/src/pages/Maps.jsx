import "../styles/maps.css";
import MapaInteractivo from "../components/MapaInteractivo";

import PanelLista from "../components/PanelLista";
import PanelVacio from "../components/PanelVacio";
import PanelDetalle from "../components/PanelDetalle";

export default function Maps({ view = "lista" }) {
  let Panel = PanelLista;
  if (view === "vacio") Panel = PanelVacio;
  if (view === "detalle") Panel = PanelDetalle;

  return (
    <main className="maps">
      <div className="mapsLayout">
        {/* IZQUIERDA: mapa (estático, sin datos todavía) */}
        <section className="mapsLeft">
          <div className="mapBox">
            <MapaInteractivo lugares={[]} />
          </div>
        </section>

        {/* DERECHA: panel (cambia según la ruta) */}
        <aside className="mapsRight">
          <div className="panel">
            <Panel />
          </div>
        </aside>
      </div>
    </main>
  );
}
