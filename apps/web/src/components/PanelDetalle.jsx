import { useMemo, useState } from "react";
import "../styles/maps.css";

const FALLBACK_IMAGE = "/images/placeholder-lugar.jpg";

export default function PanelDetalle({ place, onBack = () => {} }) {
  // ✅ Hooks SIEMPRE arriba (nunca después de un return)
  const [tab, setTab] = useState("acc"); // "general" | "acc"
  const [reviewQuery, setReviewQuery] = useState("");

  // Si aún no hay place (timing), render controlado
  const safePlace = place ?? null;

  const foto = safePlace?.fotoUrl || FALLBACK_IMAGE;

  const tags = useMemo(() => {
    if (!safePlace) return [];

    const mk = (label, value) => {
      if (value == null) return null;
      const n = Number(value);
      if (!Number.isFinite(n)) return null;
      return {
        label,
        value: n,
        cls: n >= 2.5 ? "tagGreen" : "tagRed",
      };
    };

    return [
      mk("Rampa", safePlace.avgRampa),
      mk("Aseo", safePlace.avgAseoAdaptado),
      mk("Parking", safePlace.avgAparcamientoAccesible),
      mk("Ascensor", safePlace.avgAscensorPlataforma),
      mk("Perro guía", safePlace.avgPerroGuia),
      mk("Audio", safePlace.avgInfoAudio),
      mk("Braille", safePlace.avgSenaleticaBraille),
      mk("Subtítulos", safePlace.avgInfoSubtitulos),
    ].filter(Boolean);
  }, [safePlace]);

  // Totales (si no existen aún, 0)
  const totalAcc = safePlace?.totalResenasAccesibilidad ?? 0;
  const totalGeneral = safePlace?.totalResenasGenerales ?? 0; // si no lo tienes, se verá 0

  if (!safePlace) {
    return (
      <div className="panelContent">
        <div className="detailTop">
          <button className="backLink" type="button" onClick={onBack}>
            ← Volver
          </button>
        </div>
        <p className="emptyText">Selecciona un lugar para ver el detalle.</p>
      </div>
    );
  }

  return (
    <div className="panelContent">
      {/* Cabecera */}
      <div className="detailTop">
        <button className="backLink" type="button" onClick={onBack}>
          ← Volver
        </button>

        <div className="placeRate">
          {totalAcc} acc ★
        </div>
      </div>

      <h2 className="detailTitle">{safePlace.nombre ?? "Lugar sin nombre"}</h2>
      <p className="detailType">{safePlace.categoria ?? "Sin categoría"}</p>
      <p className="detailAddr">{safePlace.direccion ?? "Sin dirección"}</p>

      {/* FOTO */}
      <div className="detailPhoto">
        <img
          src={foto}
          alt={safePlace.nombre ?? "Foto del lugar"}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
        />
      </div>

      {/* Tags medias */}
      <div className="tags" style={{ marginTop: 10 }}>
        {tags.length ? (
          tags.map((t) => (
            <span key={t.label} className={`tag ${t.cls}`}>
              {t.label} {t.value.toFixed(1)}
            </span>
          ))
        ) : (
          <span className="tag tagRed">Sin info acc.</span>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${tab === "general" ? "tabOn" : ""}`}
          type="button"
          onClick={() => setTab("general")}
        >
          Reseñas generales ({totalGeneral})
        </button>
        <button
          className={`tab ${tab === "acc" ? "tabOn" : ""}`}
          type="button"
          onClick={() => setTab("acc")}
        >
          Reseñas accesibilidad ({totalAcc})
        </button>
      </div>

      {/* Buscador reseñas + acciones (UI) */}
      <div className="reviewsTools">
        <div className="reviewsSearch">
          <input
            className="reviewsInput"
            type="text"
            placeholder="Buscar una palabra clave de una reseña"
            value={reviewQuery}
            onChange={(e) => setReviewQuery(e.target.value)}
          />
          <button className="reviewsSearchBtn" type="button" aria-label="Buscar">
            <img src="/images/icon-search.svg" alt="" />
          </button>
        </div>

        <button className="writeReviewBtn" type="button">
          + Escribir reseña
        </button>
      </div>

      {/* Aquí luego conectaréis reseñas reales. Por ahora puedes dejarlo vacío o mock */}
      <div className="reviewList">
        <div className="review">
          <div className="reviewUser">Nombre usuario</div>
          <div className="reviewText">
            (Mock) Comentario de ejemplo. Tab actual: <strong>{tab}</strong>. Búsqueda: <strong>{reviewQuery}</strong>
          </div>
        </div>
      </div>

      <button className="seeMoreBtn" type="button">
        Ver más
      </button>
    </div>
  );
}
