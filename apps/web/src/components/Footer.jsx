import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="mtFooter">
      <div className="mtFooter__inner">
        <div className="mtFooter__brand">MeeTravel</div>

        <div className="mtFooter__cols">
          <div className="mtFooter__col">
            <p className="mtFooter__title">Descubrir</p>
            <a href="#!">Inicio</a>
            <a href="#!">Maps</a>
            <a href="#!">Buscar viaje</a>
          </div>

          <div className="mtFooter__col">
            <p className="mtFooter__title">Tu cuenta</p>
            <a href="#!">Iniciar sesión</a>
            <a href="#!">Registrarse</a>
            <a href="#!">Ayuda</a>
          </div>

          <div className="mtFooter__col">
            <p className="mtFooter__title">Síguenos</p>
            <a href="#!">Instagram</a>
            <a href="#!">Twitter</a>
            <a href="#!">Facebook</a>
          </div>
        </div>
      </div>

      <div className="mtFooter__bottom">
        © MeeTravel — Todos los derechos reservados
      </div>
    </footer>
  );
}
