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
import L from 'leaflet';

// Iconos Phosphor organizados por secciones
const categoryIcons = {
  // Alojamiento
  Alojamiento: '<i class="ph ph-house"></i>',
  Hotel: '<i class="ph ph-bed"></i>',

  // Comida y Bebida
  Restaurante: '<i class="ph ph-fork-knife"></i>',
  Cafetería: '<i class="ph ph-coffee"></i>',
  Bar: '<i class="ph ph-beer-bottle"></i>',
  Panadería: '<i class="ph ph-bread"></i>',

  // Compras
  Tienda: '<i class="ph ph-shopping-cart"></i>',
  'Centro comercial': '<i class="ph ph-storefront"></i>',
  Supermercado: '<i class="ph ph-shopping-bag"></i>',

  // Transporte
  Aeropuerto: '<i class="ph ph-airplane"></i>',
  'Estación de tren': '<i class="ph ph-train"></i>',
  'Estación de autobús': '<i class="ph ph-bus"></i>',
  Aparcamiento: '<i class="ph ph-car"></i>',
  Gasolinera: '<i class="ph ph-gas-pump"></i>',
  // Salud
  Hospital: '<i class="ph ph-first-aid-kit"></i>',
  Farmacia: '<i class="ph ph-first-aid"></i>',

  // Cultura y Ocio
  Museo: '<i class="ph ph-bank"></i>',
  Parque: '<i class="ph ph-tree"></i>',
  'Atracción turística': '<i class="ph ph-map-pin"></i>',
  Gimnasio: '<i class="ph ph-barbell"></i>',
  Spa: '<i class="ph ph-drop"></i>',

 

  // Por defecto
  'default': '<i class="ph ph-map-pin-line"></i>'
};

// Función para crear icono personalizado
const createCustomIcon = (category) => {
  const iconHTML = categoryIcons[category] || categoryIcons['default'];

  return L.divIcon({
    html: `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 20px;">
      ${iconHTML}
    </div>`,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

//
function PopupBadge({ children, color = '#27ae60' }) {
  return (
    <span style={{
      backgroundColor: color,  // color dinámico
      color: 'white',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      whiteSpace: 'nowrap',
      display: 'inline-block'
    }}>
      {children}
    </span>
  );
}
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
// Recibe `lugares` (los lugares filtrados que vienen del backend)
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


        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            position={[lugar.latitud, lugar.longitud]}
            icon={createCustomIcon(lugar.categoria)}
          >
            <Popup maxWidth={320}>
              <div style={{ padding: '10px' }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '16px'
                }}>
                  {lugar.nombre}
                </h3>

                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {lugar.categoria}
                  </span>
                </div>

                {lugar.direccion && (
                  <p style={{
                    margin: '5px 0',
                    fontSize: '14px',
                    color: '#555'
                  }}>
                    📍 {lugar.direccion}
                  </p>
                )}

                {/* Características de accesibilidad */}
                <div style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #eee'
                }}>
                  <strong style={{ fontSize: '13px', color: '#2c3e50' }}>
                    Accesibilidad:
                  </strong>
                  <div style={{
                    marginTop: '6px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px'
                  }}>
                    {lugar.sillaRuedas && <PopupBadge color="#10b981">♿ Silla ruedas</PopupBadge>}
                    {lugar.aseoAdaptado && <PopupBadge color="#3b82f6">🚻 Aseo</PopupBadge>}
                    {lugar.aparcamientoAccesible && <PopupBadge color="#8b5cf6">🅿️ Parking</PopupBadge>}
                    {lugar.ascensorPlataforma && <PopupBadge color="#f59e0b">🛗 Ascensor</PopupBadge>}
                    {lugar.perroGuia && <PopupBadge color="#ec4899">🦮 Perro guía</PopupBadge>}
                    {lugar.infoAudio && <PopupBadge color="#14b8a6">🔊 Audio</PopupBadge>}
                    {lugar.senaleticaBraille && <PopupBadge color="#6366f1">👆 Braille</PopupBadge>}
                    {lugar.infoSubtitulos && <PopupBadge color="#ef4444">📝 Subtítulos</PopupBadge>}

                    {!lugar.sillaRuedas && !lugar.aseoAdaptado && !lugar.aparcamientoAccesible &&
                      !lugar.ascensorPlataforma && !lugar.perroGuia && !lugar.infoAudio &&
                      !lugar.senaleticaBraille && !lugar.infoSubtitulos && (
                        <span style={{ fontSize: '12px', color: '#999' }}>
                          Sin información de accesibilidad
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <ClickHandler onClick={setPosicion} />
        <RecentrarMapa posicion={posicion} />
      </MapContainer>
    </>
  );
}