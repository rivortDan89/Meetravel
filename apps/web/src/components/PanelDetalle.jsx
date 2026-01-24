import "../styles/maps.css";

export default function PanelDetalle() {
  return (
    <div className="panelContent">
      {/* Cabecera del detalle */}
      <div className="detailTop" >
        <a className="backLink" href="#!">
          ← Volver
        </a>

        <div className="placeRate">4,7 ★</div>
      </div >

      <h2 className="detailTitle">Latte Art</h2>
      <p className="detailType">Cafetería</p>
      <p className="detailAddr">Dirección C/Falsa 123 · Murcia, Región de Murcia</p>

      <div className="detailPhoto" />

      {/* Tags */}
      <div className="tags" style={{ marginTop: 10 }}>
        <span className="tag tagRed">Baño 3.8</span>
        <span className="tag tagGreen">Entrada 4.1</span>
        <span className="tag tagGreen">Acceso 4.5</span>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab" type="button">
          Reseñas generales (70)
        </button>
        <button className="tab tabOn" type="button">
          Reseñas accesibilidad (15)
        </button>
      </div>

      {/* Buscador + acciones */}
      <div className="reviewsTools">
        <div className="reviewsSearch">
          <input
            className="reviewsInput"
            type="text"
            placeholder="Buscar una palabra clave de una reseña"
          />
          <button className="reviewsSearchBtn" type="button" aria-label="Buscar">
            <img src="/images/icon-search.svg" alt="" />
          </button>
        </div>

        <button className="writeReviewBtn" type="button">
          + Escribir reseña
        </button>
      </div>

      {/* Lista de reseñas (estático de ejemplo) */}
      <div className="reviewList">
        <div className="review">
          <div className="reviewUser">Nombre usuario</div>
          <div className="reviewText">
            Comentario del usuario referente a la accesibilidad. Abajo sus votos.
          </div>

          <div className="tags" style={{ marginTop: 10 }}>
            <span className="tag tagRed">Baño 3.1</span>
            <span className="tag tagGreen">Entrada 4.0</span>
            <span className="tag tagGreen">Acceso 4.7</span>
          </div>
        </div>

        <div className="review">
          <div className="reviewUser">Nombre usuario</div>
          <div className="reviewText">
            Comentario del usuario referente a la accesibilidad. Abajo sus votos.
          </div>

          <div className="tags" style={{ marginTop: 10 }}>
            <span className="tag tagRed">Baño 3.1</span>
            <span className="tag tagGreen">Entrada 4.0</span>
            <span className="tag tagGreen">Acceso 4.7</span>
          </div>
        </div>

        <div className="review">
          <div className="reviewUser">Nombre usuario</div>
          <div className="reviewText">
            Comentario del usuario referente a la accesibilidad. Abajo sus votos.
          </div>

          <div className="tags" style={{ marginTop: 10 }}>
            <span className="tag tagRed">Baño 3.1</span>
            <span className="tag tagGreen">Entrada 4.0</span>
            <span className="tag tagGreen">Acceso 4.7</span>
          </div>
        </div>
      </div>

      <button className="seeMoreBtn" type="button">
        Ver más
      </button>
    </div>
  );
}
