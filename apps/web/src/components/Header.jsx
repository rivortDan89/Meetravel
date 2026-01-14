import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <Link className="header__pill" to="/maps">
            Maps
          </Link>
        </div>

        <Link className="header__logo" to="/" aria-label="Ir al inicio">
          <img src="/images/logo-blanco.svg" alt="MeeTravel" />
        </Link>

        <nav className="header__right">
          <a className="header__link" href="#!">Iniciar sesión</a>
          <a className="header__btn" href="#!">Registrarse</a>
        </nav>
      </div>
    </header>
  );
}
