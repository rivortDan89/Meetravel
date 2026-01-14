import { useEffect, useState } from "react";
import { getHealth } from "../services/api";
import "../styles/home.css";

export default function Home() {
  const [status, setStatus] = useState("Cargando...");

  useEffect(() => {
    getHealth()
      .then((r) => setStatus(r.status))
      .catch(() => setStatus("Error conectando con el back"));
  }, []);

  return (
    <main className="home">
      {/* HERO */}
      <section className="homeHero">
        <div className="homeHero__bg" />

        <div className="wrap">
          <div className="homeHero__content">
            <h1 className="homeHero__title">Explora. Comparte. Organiza.</h1>

            <p className="homeHero__subtitle">
              Únete a viajes o actividades, consulta la accesibilidad de los sitios a los
              que quieres ir y organiza tus propios itinerarios.
            </p>

            <p className="homeHero__hint">
              Empieza buscando un viaje. O bien{" "}
              <a className="homeHero__link" href="#!">
                creando el tuyo propio.
              </a>
            </p>

            <div className="homeSearch">
              <div className="homeSearch__item">Fecha desde</div>
              <div className="homeSearch__divider" />
              <div className="homeSearch__item">Fecha hasta</div>
              <div className="homeSearch__divider" />
              <div className="homeSearch__item">Ciudad</div>
              <div className="homeSearch__divider" />
              <div className="homeSearch__item">Tipo de actividad</div>
              <div className="homeSearch__divider" />
              <div className="homeSearch__item homeSearch__item--grow">
                Escribir aquí...
              </div>

              <button className="homeSearch__btn" type="button" aria-label="Buscar">
                <img src="/images/icon-search.svg" alt="" />
              </button>
            </div>

            <p className="homeHero__status">Conexión Front ↔ Back: {status}</p>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="homeSection">
        <div className="wrap">
          <div className="homeInfo">
            <p className="homeInfo__text">
              En{" "}
              <img className="homeInfo__logo" src="/images/logo-naranja.svg" alt="MeeTravel" />{" "}
              queremos hacer del mundo un lugar más accesible. Y tú puedes contribuir.
            </p>

            <div className="homeInfo__cards">
              <img src="/images/seccion-1-1.svg" alt="1. Abre el mapa" />
              <img className="homeInfo__arrow" src="/images/flecha.svg" alt="" />
              <img src="/images/seccion-1-2.svg" alt="2. Deja una reseña" />
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLOS */}
      <section className="homeSection">
        <div className="wrap">
          <div className="homeExamples">
            <div className="ejemplo1">
              <h2 className="homeExamples__title">
                Descubre viajes que otras personas han organizado. Puedes unirte al viaje completo...
              </h2>
              <img className="homeExamples__img1" src="/images/card-trip.svg" alt="Viaje" />
            </div>

            <div className="ejemplo2">
              <h2 className="homeExamples__title homeExamples__title--right">
                ... O a las actividades que más te interesen y se adapten a ti.
              </h2>

              <div className="homeExamples__stack">
                <img
                  className="homeExamples__img"
                  src="/images/card-activity-1.svg"
                  alt="Actividad 1"
                />
                <img
                  className="homeExamples__img"
                  src="/images/card-activity-2.svg"
                  alt="Actividad 2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
