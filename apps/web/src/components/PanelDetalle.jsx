import { Link } from "react-router-dom";

export default function PanelDetalle() {
  const reseñas = [
    "Comentario del usuario referente a la accesibilidad. Abajo sus votos.",
    "Comentario del usuario referente a la accesibilidad. Abajo sus votos.",
    "Comentario del usuario referente a la accesibilidad. Abajo sus votos.",
  ];

  return (
    <div>
      <div className="detailTop">
        <Link className="backLink" to="/maps">
          ← Volver
        </Link>

        <div className="placeRate">4,7 ★</div>
      </div>

      <h2 className="detailTitle">Latte Art</h2>
      <p className="detailType">Cafetería</p>
      <p className="detailAddr">Dirección C/Falsa 123 · Murcia, Región de Murcia</p>

      <div className="detailPhoto" />

      <div className="tags">
        <span className="tag tagRed">Baño 3.8</span>
        <span className="tag tagGreen">Entrada 4.1</span>
        <span className="tag tagGreen">Acceso 4.5</span>
      </div>

      <div className="tabs">
        <button className="tab" type="button">Reseñas generales (70)</button>
        <button className="tab tabOn" type="button">Reseñas accesibilidad (15)</button>
      </div>

      <div className="reviewList">
        {reseñas.map((texto, i) => (
          <article key={i} className="review">
            <div className="reviewUser">Nombre usuario</div>
            <p className="reviewText">{texto}</p>

            <div className="tags">
              <span className="tag tagRed">Baño 3.1</span>
              <span className="tag tagGreen">Entrada 4.0</span>
              <span className="tag tagGreen">Acceso 4.7</span>
            </div>

            <div className="reviewBottom">
              <div className="vote">👍 3</div>
              <div className="vote">👎 1</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
