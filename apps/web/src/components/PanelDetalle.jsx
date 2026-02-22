import { useEffect, useMemo, useState } from "react";
import "../styles/maps.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const FALLBACK_IMAGE = "/images/placeholder-lugar.jpg";

export default function PanelDetalle({ place, onBack }) {
  // Mantenemos los hooks al incicio del componente para respetar las reglas de React. El fetch de reseñas se dispara cada vez que cambia el placeId, y el estado se actualiza con las reseñas obtenidas.
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const placeId = place?.id;

  useEffect(() => {
    if (!placeId) return;

    let cancelled = false;

    fetch(`${API_URL}/reviews/accesibilidad/${placeId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return;
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setReviews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const filteredReviews = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    if (!q) return reviews;

    return reviews.filter((r) =>
      String(r.comentario || "").toLowerCase().includes(q)
    );
  }, [reviews, searchTerm]);

  // Si no hay lugar seleccionado, no mostramos el panel.
  if (!place) return null;

  const foto = place.fotoUrl || FALLBACK_IMAGE;

  return (
    <div className="panelContent">
      <div className="detailTop">
        <button type="button" className="backLink" onClick={onBack}>
          ← Volver a la lista
        </button>
      </div>

      <h2 className="detailTitle">{place.nombre ?? "Lugar"}</h2>

      <p className="detailType">{place.categoria ?? "Sin categoría"}</p>
      <p className="detailAddr">{place.direccion ?? "Sin dirección"}</p>

      <div className="detailPhoto">
        <img
          src={foto}
          alt={place.nombre ?? "Foto del lugar"}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
        />
      </div>

      {/* Mostramos únicamente las medias de accesibilidad disponibles */}
      <div className="tags" style={{ marginTop: 10 }}>
        {place.avgRampa != null && (
          <span className={`tag ${Number(place.avgRampa) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Rampa {Number(place.avgRampa).toFixed(1)}
          </span>
        )}
        {place.avgAseoAdaptado != null && (
          <span className={`tag ${Number(place.avgAseoAdaptado) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Aseo {Number(place.avgAseoAdaptado).toFixed(1)}
          </span>
        )}
        {place.avgAparcamientoAccesible != null && (
          <span className={`tag ${Number(place.avgAparcamientoAccesible) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Parking {Number(place.avgAparcamientoAccesible).toFixed(1)}
          </span>
        )}
        {place.avgAscensorPlataforma != null && (
          <span className={`tag ${Number(place.avgAscensorPlataforma) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Ascensor {Number(place.avgAscensorPlataforma).toFixed(1)}
          </span>
        )}
        {place.avgPerroGuia != null && (
          <span className={`tag ${Number(place.avgPerroGuia) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Perro guía {Number(place.avgPerroGuia).toFixed(1)}
          </span>
        )}
        {place.avgInfoAudio != null && (
          <span className={`tag ${Number(place.avgInfoAudio) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Audio {Number(place.avgInfoAudio).toFixed(1)}
          </span>
        )}
        {place.avgSenaleticaBraille != null && (
          <span className={`tag ${Number(place.avgSenaleticaBraille) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Braille {Number(place.avgSenaleticaBraille).toFixed(1)}
          </span>
        )}
        {place.avgInfoSubtitulos != null && (
          <span className={`tag ${Number(place.avgInfoSubtitulos) >= 2.5 ? "tagGreen" : "tagRed"}`}>
            Subtítulos {Number(place.avgInfoSubtitulos).toFixed(1)}
          </span>
        )}
      </div>

      <div className="tabs">
        <button className="tab tabOn" type="button">
          Reseñas de accesibilidad ({reviews.length})
        </button>
      </div>

      <div className="reviewsTools">
        <div className="reviewsSearch">
          <input
            type="text"
            className="reviewsInput"
            placeholder="Buscar en comentarios"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="reviewsSearchBtn" aria-label="Buscar en reseñas">
            <img src="/images/icon-search.svg" alt="" />
          </button>
        </div>

        <button type="button" className="writeReviewBtn" disabled>
          Escribir reseña
        </button>
      </div>

      <div className="reviewList">
        {filteredReviews.map((r) => (
          <article key={r.id} className="review">
            <div className="reviewUser">
              {r.usuario} · {r.etiqueta} · {Number(r.puntuacion).toFixed(1)}★
            </div>

            <p className="reviewText">{r.comentario}</p>

            <div className="reviewBottom">
              <span className="vote">Puntuación {r.puntuacion}/5</span>
              <span className="vote">
                {r.fecha ? new Date(r.fecha).toLocaleDateString() : ""}
              </span>
            </div>
          </article>
        ))}

        {filteredReviews.length === 0 && searchTerm.trim() && (
          <p className="emptyText">
            No hay reseñas que coincidan con <strong>{searchTerm}</strong>.
          </p>
        )}

        {filteredReviews.length === 0 && !searchTerm.trim() && (
          <p className="emptyText">Este lugar aún no tiene reseñas de accesibilidad.</p>
        )}
      </div>
    </div>
  );
}
