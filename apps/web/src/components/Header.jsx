import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="mtHeader">
      <div className="mtHeader__inner">
        <Link to="/" className="mtHeader__logo" aria-label="MeeTravel">
          MeeTravel
        </Link>

        <nav className="mtHeader__nav">
          <Link to="/maps" className="mtHeader__link">Maps</Link>
          <a className="mtHeader__link" href="#!">Iniciar sesión</a>
          <a className="mtHeader__btn" href="#!">Registrarse</a>
        </nav>
      </div>
    </header>
  );
}
