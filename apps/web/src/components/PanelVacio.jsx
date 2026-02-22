// Este Panel se muestra cuando no hay resultados que mostrar, ya sea por el buscador o por los filtros. También incluye botones para limpiar la búsqueda y cambiar los filtros directamente desde aquí, para facilitar la navegación y evitar que el usuario se quede "atascado" sin opciones.
export default function PanelVacio({
  search = "",
  onClearSearch = () => {},
  filters = {},
  onChangeFilters = () => {},
}) {
  const toggle = (key) => onChangeFilters((f) => ({ ...f, [key]: !f?.[key] }));

  return (
    <div>
      <p className="emptyText">
        No hay resultados para <strong>{search || "tu búsqueda/filtros"}</strong>.
      </p>

      <div style={{ marginBottom: 10 }}>
        <button className="backLink" type="button" onClick={onClearSearch}>
          Limpiar búsqueda
        </button>
      </div>

      {/* Chips también aquí */}
      <div className="chips">
        <button type="button" className={filters.rampa ? "chip chipOn" : "chip"} onClick={() => toggle("rampa")}>
          Rampa
        </button>
        <button type="button" className={filters.aseoAdaptado ? "chip chipOn" : "chip"} onClick={() => toggle("aseoAdaptado")}>
          Aseo
        </button>
        <button type="button" className={filters.aparcamientoAccesible ? "chip chipOn" : "chip"} onClick={() => toggle("aparcamientoAccesible")}>
          Parking
        </button>
        <button type="button" className={filters.ascensorPlataforma ? "chip chipOn" : "chip"} onClick={() => toggle("ascensorPlataforma")}>
          Ascensor
        </button>
        <button type="button" className={filters.perroGuia ? "chip chipOn" : "chip"} onClick={() => toggle("perroGuia")}>
          Perro guía
        </button>
        <button type="button" className={filters.infoAudio ? "chip chipOn" : "chip"} onClick={() => toggle("infoAudio")}>
          Audio
        </button>
        <button type="button" className={filters.senaleticaBraille ? "chip chipOn" : "chip"} onClick={() => toggle("senaleticaBraille")}>
          Braille
        </button>
        <button type="button" className={filters.infoSubtitulos ? "chip chipOn" : "chip"} onClick={() => toggle("infoSubtitulos")}>
          Subtítulos
        </button>
      </div>
    </div>
  );
}
