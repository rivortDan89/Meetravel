export default function PanelLista() {
  const lugares = [
    { nombre: "Latte Art", tipo: "Cafetería", rating: "4,7" },
    { nombre: "Café de Ficciones", tipo: "Cafetería", rating: "4,7" },
    { nombre: "Jardín de Floridablanca", tipo: "Aire libre", rating: "4,7" },
    { nombre: "Acuario UMU", tipo: "Cultura", rating: "4,7" },
  ];

  return (
    <div>
      <div className="searchRow">
        <div className="searchBar">
          <input
            className="searchInput"
            placeholder="Buscar bar, restaurante, hotel, museo..."
            type="text"
          />
          <button className="searchBtn" type="button" aria-label="Buscar">
            <img src="/images/icon-search.svg" alt="" />
          </button>
        </div>
      </div>

      <div className="chips">
        <button className="chip chipOn" type="button">Acceso</button>
        <button className="chip chipOn" type="button">Entrada</button>
        <button className="chip" type="button">Baño</button>
      </div>

      <h2 className="panelTitle">Lugares populares en la zona</h2>

      <div className="list">
        {lugares.map((l) => (
          <article key={l.nombre} className="placeCard">
            <div className="placeImg" />
            <div className="placeBody">
              <div className="placeTop">
                <div className="placeName">{l.nombre}</div>
                <div className="placeRate">{l.rating} ★</div>
              </div>

              <div className="placeMeta">
                {l.tipo} · 70 reseñas generales · 15 reseñas accesibilidad
              </div>

              <div className="tags">
                <span className="tag tagRed">Baño 3.8</span>
                <span className="tag tagGreen">Entrada 4.1</span>
                <span className="tag tagGreen">Acceso 4.5</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
