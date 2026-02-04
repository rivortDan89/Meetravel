const FALLBACK_IMAGE = "/images/placeholder-lugar.jpg";

export default function PanelLista({
  places = [],
  selectedId = null,
  onSelectPlace = () => {},

  // buscador
  search = "",
  onSearchChange = () => {},

  // filtros accesibilidad
  filters = {},
  onChangeFilters = () => {},
}) {
  const toggle = (key) => {
    onChangeFilters((f) => ({ ...f, [key]: !f?.[key] }));
  };

  return (
    <div>
      {/* Buscador */}
      <div className="searchRow">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Buscar bar, restaurante, hotel, museo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="searchInput"
          />
          <button type="button" className="searchBtn" aria-label="Buscar">
            <img src="/images/icon-search.svg" alt="" />
          </button>
        </div>
      </div>

      {/* Chips filtros accesibilidad */}
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

      <h2 className="panelTitle">Lugares (desde la API) ({places.length})</h2>

      <div className="list">
        {places.map((p) => {
          const id = String(getPlaceKey(p));
          const isOn = selectedId != null && String(selectedId) === id;

          return (
            <div
              key={id}
              className="placeCard"
              onClick={() => onSelectPlace(p)}
              style={{
                cursor: "pointer",
                outline: isOn ? "2px solid rgba(182, 54, 28, 0.6)" : "none",
              }}
              title="Abrir detalle y centrar en el mapa"
            >
              {/* FOTO */}
              <div className="placeImg">
                <img
                  src={p.fotoUrl || FALLBACK_IMAGE}
                  alt={p.nombre ?? "Foto del lugar"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="placeBody">
                <div className="placeTop">
                  <div className="placeName">{p.nombre ?? "Lugar sin nombre"}</div>
                  <div className="placeRate">{p.totalResenasAccesibilidad ?? 0} acc ★</div>
                </div>

                <div className="placeMeta">
                  {(p.categoria ?? "Sin categoría") +
                    " · " +
                    (p.direccion ?? "Sin dirección")}
                </div>

                {/* Tags medias (si existen) */}
                <div className="tags">
                  {p.avgRampa != null && (
                    <span className={`tag ${Number(p.avgRampa) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Rampa {Number(p.avgRampa).toFixed(1)}
                    </span>
                  )}
                  {p.avgAseoAdaptado != null && (
                    <span className={`tag ${Number(p.avgAseoAdaptado) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Aseo {Number(p.avgAseoAdaptado).toFixed(1)}
                    </span>
                  )}
                  {p.avgAparcamientoAccesible != null && (
                    <span className={`tag ${Number(p.avgAparcamientoAccesible) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Parking {Number(p.avgAparcamientoAccesible).toFixed(1)}
                    </span>
                  )}
                  {p.avgAscensorPlataforma != null && (
                    <span className={`tag ${Number(p.avgAscensorPlataforma) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Ascensor {Number(p.avgAscensorPlataforma).toFixed(1)}
                    </span>
                  )}
                  {p.avgPerroGuia != null && (
                    <span className={`tag ${Number(p.avgPerroGuia) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Perro guía {Number(p.avgPerroGuia).toFixed(1)}
                    </span>
                  )}
                  {p.avgInfoAudio != null && (
                    <span className={`tag ${Number(p.avgInfoAudio) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Audio {Number(p.avgInfoAudio).toFixed(1)}
                    </span>
                  )}
                  {p.avgSenaleticaBraille != null && (
                    <span className={`tag ${Number(p.avgSenaleticaBraille) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Braille {Number(p.avgSenaleticaBraille).toFixed(1)}
                    </span>
                  )}
                  {p.avgInfoSubtitulos != null && (
                    <span className={`tag ${Number(p.avgInfoSubtitulos) >= 2.5 ? "tagGreen" : "tagRed"}`}>
                      Subtítulos {Number(p.avgInfoSubtitulos).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getPlaceKey(l) {
  return l.id ?? l.google_place_id ?? l.placeId ?? `${l.nombre}-${l.latitud}-${l.longitud}`;
}
