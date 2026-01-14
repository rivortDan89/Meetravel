import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <Link className="footer__brand" to="/" aria-label="Inicio">
          <img src="/images/logo-blanco.svg" alt="MeeTravel" />
        </Link>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Descubrir</h4>
            <Link to="/">Inicio</Link>
            <Link to="/maps">Maps</Link>
            <a href="#!">Subir viaje</a>
            <a href="#!">Buscar viaje</a>
          </div>

          <div className="footer__col">
            <h4>Tu cuenta</h4>
            <a href="#!">Iniciar sesión</a>
            <a href="#!">Registrarse</a>
            <a href="#!">Ayuda</a>
          </div>

          <div className="footer__col">
            <h4>Síguenos</h4>
            <a href="#!">→ Instagram</a>
            <a href="#!">→ Twitter</a>
            <a href="#!">→ Facebook</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © MeeTravel — Todos los derechos reservados
      </div>
    </footer>
  );
}
