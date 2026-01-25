export default function PanelVacio() {
  return (
    <div>
      <div className="searchRow">
        <div className="searchBar">
          <input
            className="searchInput"
            defaultValue="Cafetería"
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
        <button className="chip chipOn" type="button">Baño</button>
        <button className="chip" type="button">Rampa</button>
      </div>

      <p className="emptyText">
        <strong>No hemos encontrado lugares acorde a tu búsqueda</strong>, te recomendamos estos
        lugares cercanos según tus preferencias.
      </p>

      <div className="list">
        <article className="placeCard">
          <div className="placeImg" />
          <div className="placeBody">
            <div className="placeTop">
              <div className="placeName">Latte Art</div>
              <div className="placeRate">4,7 ★</div>
            </div>
            <div className="placeMeta">Cafetería · 70 reseñas generales · 15 reseñas accesibilidad</div>
            <div className="tags">
              <span className="tag tagRed">Baño 3.8</span>
              <span className="tag tagGreen">Entrada 4.1</span>
              <span className="tag tagGreen">Acceso 4.5</span>
            </div>
          </div>
        </article>

        <article className="placeCard">
          <div className="placeImg" />
          <div className="placeBody">
            <div className="placeTop">
              <div className="placeName">Café de Ficciones</div>
              <div className="placeRate">4,7 ★</div>
            </div>
            <div className="placeMeta">Cafetería · 70 reseñas generales · 15 reseñas accesibilidad</div>
            <div className="tags">
              <span className="tag tagRed">Baño 3.8</span>
              <span className="tag tagGreen">Entrada 4.1</span>
              <span className="tag tagGreen">Acceso 4.5</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
