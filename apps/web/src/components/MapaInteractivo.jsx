// Importamos React y el hook useState para manejar estado (valores que cambian)
import { useState, useEffect } from "react";

// Importamos los componentes de React-Leaflet que usaremos en el mapa
import {
  MapContainer,  // Contenedor principal del mapa (equivale a L.map(...) en Leaflet “normal”)
  TileLayer,     // Capa de tiles (las imágenes del mapa: calles, edificios, etc.)
  Marker,        // Marcador/pin que se coloca en una posición concreta
  Popup,         // Ventana de información asociada a un marcador o punto
  useMapEvents,  // Hook para escuchar eventos del mapa (click, move, zoom, etc.)
  useMap         // Hook para acceder a la instancia del mapa
} from "react-leaflet";

// Importamos el CSS de Leaflet para que se vean bien el mapa, controles e iconos
import "leaflet/dist/leaflet.css";


// Componente auxiliar que "escucha" clics en el mapa
function ClickHandler({ onClick }) {
  // useMapEvents se conecta con el mapa y nos deja reaccionar a eventos
  useMapEvents({
    // Evento de clic en cualquier punto del mapa
    click(e) {
      // e.latlng contiene las coordenadas donde se hizo clic ({ lat, lng })
      // Llamamos a la función recibida por props para actualizar el estado en el padre
      onClick(e.latlng);
    },
  });

  // Este componente no pinta nada en pantalla, solo maneja eventos
  return null;
}


// componente para recentrar el mapa cuando cambie `posicion`
function RecentrarMapa({ posicion }) {
  const map = useMap();

  useEffect(() => {
    if (!posicion) return;
    map.setView(posicion, map.getZoom()); // o map.flyTo(posicion, 13)
  }, [posicion, map]);

  return null;
}


// Componente principal del mapa
// 🔽 Ahora recibe `lugares` (los lugares filtrados que vienen del backend)
export default function MapaInteractivo({ lugares = [] }) {
  // Creamos un estado llamado "posicion" y su función para actualizarlo "setPosicion".
  // Lo inicializamos a null, es decir, al cargar la página todavía no tenemos coordenadas.
  const [posicion, setPosicion] = useState(null);

  // useEffect se ejecuta una vez al montar el componente (por el array [] vacío).
  useEffect(() => {
    // Si el navegador no soporta geolocalización, salimos y no hacemos nada.
    if (!navigator.geolocation) return;

    // Pedimos la ubicación actual del usuario.
    navigator.geolocation.getCurrentPosition(
      // Función que se ejecuta si la geolocalización funciona bien.
      (pos) => {
        // Extraemos latitud y longitud del objeto devuelto por la API.
        const { latitude, longitude } = pos.coords;
        // Guardamos la posición en el estado como [lat, lng].
        // Esto hará que el componente se vuelva a renderizar con esas coordenadas.
        setPosicion([latitude, longitude]); // solo tu ubicación real
      },
      // Función que se ejecuta si hay un error (permiso denegado, timeout, etc.).
      (err) => {
        // Mostramos el error en la consola para poder ver qué ha pasado.
        console.error("Error geolocalización:", err);
        // Opcional: centramos en Madrid si falla
        setPosicion([40.4168, -3.7038]);
      }
    );
    // [] indica que este efecto solo se ejecuta una vez, cuando el componente se monta.
  }, []);

  // Ciudades predefinidas
  const ciudades = {
    madrid: [40.4168, -3.7038],
    barcelona: [41.3874, 2.1686],
    murcia: [37.9922, -1.1307],
    valencia: [39.4697, -0.3763],
    sevilla: [37.3769, -5.9957],
    zaragoza: [41.6546, -0.8802],
    palma: [39.5729, 2.6537],
    sanSebastian: [43.3569, -1.7947],
    vitoria: [42.8769, -2.6981],
    valladolid: [41.6529, -4.7172],
    gijon: [43.5329, -5.6757],
    bilbao: [43.2659, -2.9322],
    sanFernando: [28.4168, -16.7038],
  };

  // Cuando cambia la ciudad en el select
  function manejarCambioCiudad(e) {
    const valor = e.target.value;      // "madrid" | "barcelona" | ...
    const coords = ciudades[valor];
    if (coords) {
      setPosicion(coords);            // el mapa se mueve a esa ciudad
    }
  }

  // Mientras no tenemos posición, mostramos un mensaje
  if (!posicion) {
    return <p>Cargando mapa con tu ubicación…</p>;
  }

  // Cuando ya hay posición, pintamos el mapa
  return (
    <>
      {/* Selector de ciudad */}
      <select onChange={manejarCambioCiudad} defaultValue="">
        <option value="" disabled>Elige ciudad</option>
        <option value="madrid">Madrid</option>
        <option value="barcelona">Barcelona</option>
        <option value="murcia">Murcia</option>
        <option value="valencia">Valencia</option>
        <option value="sevilla">Sevilla</option>
        <option value="zaragoza">Zaragoza</option>
        <option value="palma">Palma de Mallorca</option>
        <option value="sanSebastian">San Sebastián</option>
        <option value="vitoria">Vitoria-Gasteiz</option>
        <option value="valladolid">Valladolid</option>
        <option value="gijon">Gijón</option>
        <option value="bilbao">Bilbao</option>
        <option value="sanFernando">San Fernando</option>
      </select>

      {/* MapContainer crea el mapa de Leaflet dentro de este div */}
      <MapContainer
        center={posicion}                          // Centro actual del mapa
        zoom={13}                                  // Nivel de zoom (más alto = más cerca)
        style={{ height: "500px", width: "100%" }} // Tamaño del mapa en la página
      >
        {/* TileLayer pinta el fondo del mapa usando los tiles de OpenStreetMap */}
        <TileLayer
          // Patrón de URL de los tiles: {z}=zoom, {x} y {y}=coordenadas de las imágenes
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // Texto de atribución legal obligatorio para usar datos de OpenStreetMap
          attribution="© OpenStreetMap contributors, © CARTO"
        />

        {/* Marker coloca un pin en la posición guardada en el estado */}
        <Marker position={posicion}>
          {/* Popup es la ventanita que aparece al hacer clic en el marcador */}
          <Popup>Ubicación seleccionada</Popup>
        </Marker>

        {/* 🔽 NUEVO: marcadores para cada lugar que viene de la BD */}
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id_lugar}
            position={[lugar.latitud, lugar.longitud]}
          >
            <Popup>
              <strong>{lugar.nombre}</strong>
              <br />
              {lugar.descripcion}
            </Popup>
          </Marker>
        ))}

        {/* ClickHandler escucha los clics en el mapa y actualiza la posición del marcador */}
        {/* Pasamos setPosicion como onClick, así cada clic mueve el marcador */}
        <ClickHandler onClick={setPosicion} />

        {/* NUEVO: recentra el mapa cada vez que cambia `posicion` */}
        <RecentrarMapa posicion={posicion} />
      </MapContainer>
    </>
  );
}