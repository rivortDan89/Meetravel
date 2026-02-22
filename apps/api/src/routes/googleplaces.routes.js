import { Router } from "express";
import { pool } from "../config/db.js";  // ← Importa el pool desde db.js

const router = Router();

// Función para traducir categorías de inglés a español
const traducirCategoria = (categoria) => {
  const traducciones = {
    'restaurant': 'Restaurante',
    'lodging': 'Alojamiento',
    'hotel': 'Hotel',
    'cafe': 'Cafetería',
    'bar': 'Bar',
    'museum': 'Museo',
    'tourist_attraction': 'Atracción turística',
    'park': 'Parque',
    'shopping_mall': 'Centro comercial',
    'store': 'Tienda',
    'meal_delivery': 'Entrega de comida',
    'meal_takeaway': 'Comida para llevar',
    'food': 'Comida',
    'point_of_interest': 'Punto de interés',
    'establishment': 'Establecimiento',
    'night_club': 'Discoteca',
    'spa': 'Spa',
    'gym': 'Gimnasio',
    'pharmacy': 'Farmacia',
    'hospital': 'Hospital',
    'church': 'Iglesia',
    'bakery': 'Panadería',
    'airport': 'Aeropuerto',
    'train_station': 'Estación de tren',
    'bus_station': 'Estación de autobús',
    'parking': 'Aparcamiento',
    'gas_station': 'Gasolinera',
    'supermarket': 'Supermercado',
    'grocery_or_supermarket': 'Supermercado',
    'liquor_store': 'Tienda de licores',
    'beauty_salon': 'Salon de belleza',
    'library': 'Biblioteca',
    'movie_theater': 'Cine',
    'art_gallery': 'Galería de arte',
    'clothing store': 'Tienda de moda',
    'jewelry_store': 'Tienda de joyas',
    'book_store': 'Tienda de libros',
    'health': 'Salud',};

  return traducciones[categoria] || categoria;
};

// Ruta: GET /google-places/importar?lat=37.9922&lng=-1.1307&radius=1000&type=restaurant
router.get("/importar", async (req, res) => {
  try {
    // 1) Leer parámetros de la URL y poner valores por defecto.
    //    lat y lng: coordenadas; radius: metros; type: tipo de lugar de Google Places.
    const { lat, lng, radius = 1000, type = "restaurant" } = req.query;

    // 2) Validar que hay latitud y longitud.
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    // 3) Leer la API key de Google Places desde las variables de entorno (.env).
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Falta GOOGLE_PLACES_API_KEY en .env" });
    }

    // 4) Construir la URL de la API Nearby Search (solo UNA petición, sin paginación).
    const url =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
      `?location=${lat},${lng}&radius=${radius}&type=${type}&language=es&key=${apiKey}`;

    console.log("Llamando a Google Places (una sola vez):", url);

    // 5) Hacer la petición HTTP a Google Places y parsear la respuesta JSON.
    const response = await fetch(url);
    const data = await response.json();

    console.log("Respuesta de Google:", data.status);

    // 6) Comprobar el estado de la respuesta.
    //    - OK: hay resultados.
    //    - ZERO_RESULTS: no hay lugares cerca (no es error).
    //    Cualquier otro estado se considera error de la API.
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return res.status(500).json({
        error: "Error en Google Places",
        detalle: data.status,
        message: data.error_message,
      });
    }

    // 7) Tomar el array de resultados (o array vacío si no hay).
    const resultados = data.results || [];

    // 8) Obtener una conexión a la base de datos desde el pool.
    const conn = await pool.getConnection();
    try {
      // 9) Recorrer cada lugar devuelto por Google y mapearlo a la tabla `lugar`.
      for (const place of resultados) {
        // Campos que interesan de la respuesta de Google.
        const nombre = place.name;
        const descripcion = ""; // de momento sin descripción propia
        const direccion = place.vicinity || place.formatted_address || "";
        const latitud = place.geometry.location.lat;
        const longitud = place.geometry.location.lng;
        const google_place_id = place.place_id;

        // type original de Google (ej. "restaurant") y traducción a tu categoría interna.
        const categoriaOriginal = place.types?.[0] || type;
        const categoria = traducirCategoria(categoriaOriginal);

        // 10) Insertar el lugar o actualizarlo si ya existe ese google_place_id.
        //     - INSERT INTO lugar (...) VALUES (...)
        //     - ON DUPLICATE KEY UPDATE ... => si la clave UNIQUE google_place_id ya existe,
        //       se actualizan nombre, descripción, coordenadas, categoría y dirección.
        await conn.query(
          `
          INSERT INTO lugar
            (nombre, descripcion, latitud, longitud, categoria, direccion, google_place_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            nombre = VALUES(nombre),
            descripcion = VALUES(descripcion),
            latitud = VALUES(latitud),
            longitud = VALUES(longitud),
            categoria = VALUES(categoria),
            direccion = VALUES(direccion)
        `,
          [
            nombre,
            descripcion,
            latitud,
            longitud,
            categoria,
            direccion,
            google_place_id,
          ]
        );
      }
    } finally {
      // 11) Liberar siempre la conexión al pool, haya error o no.
      conn.release();
    }

    // 12) Enviar respuesta al cliente con el número de lugares procesados.
    res.json({
      message: "Lugares importados/actualizados (una sola página)",
      count: resultados.length,
    });
  } catch (err) {
    // 13) Capturar errores generales (red, BD, etc.) y responder 500.
    console.error("Error importando desde Google Places:", err);
    res.status(500).json({
      error: "Error importando lugares",
      detalle: String(err),
    });
  }
});

export default router;