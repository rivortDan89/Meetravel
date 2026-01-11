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

// Función auxiliar para "dormir" unos milisegundos (pausa asíncrona).
// Se usa para esperar antes de llamar a Google con next_page_token.
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Ruta: GET /google-places/importar?lat=37.9922&lng=-1.1307&radius=10000&type=restaurant
router.get("/importar", async (req, res) => {
  try {
    console.log("=== Iniciando importación con paginación ===");

    // 1) Leer parámetros de la query con valores por defecto.
    const { lat, lng, radius = 500, type = "restaurant" } = req.query;

    // 2) Validación básica: lat y lng son obligatorios.
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    // 3) Obtener la API key de Google Places desde .env.
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Falta GOOGLE_PLACES_API_KEY en .env" });
    }

    // 4) URL base de la API Nearby Search (sin pagetoken).
    const baseUrl =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
      `?location=${lat},${lng}&radius=${radius}&type=${type}&language=es&key=${apiKey}`;

    // 5) Acumuladores para la paginación.
    let allResults = [];   // aquí iremos acumulando todos los lugares
    let pagetoken = null;  // token de la siguiente página
    let pageCount = 0;     // contador de páginas descargadas

    // 6) Bucle para pedir varias páginas mientras haya next_page_token.
    do {
      // Si hay pagetoken, lo añadimos a la URL; si no, usamos la base.
      const url = pagetoken ? `${baseUrl}&pagetoken=${pagetoken}` : baseUrl;

      console.log("Llamando a Google Places:", url);
      const response = await fetch(url);
      const data = await response.json();

      console.log("Respuesta de Google:", data.status);

      // Si la respuesta es un error distinto de ZERO_RESULTS, devolvemos 500.
      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        return res.status(500).json({
          error: "Error en Google Places",
          detalle: data.status,
          message: data.error_message,
        });
      }

      // Añadimos los resultados de esta página al array global.
      allResults = allResults.concat(data.results || []);

      // Guardamos el token de la siguiente página (si lo hay).
      pagetoken = data.next_page_token || null;
      pageCount++;

      // Google necesita unos segundos antes de usar next_page_token.
      // Limitamos a máx. 3 páginas (≈ 60 resultados) para no abusar de la API.
      if (pagetoken && pageCount < 3) {
        await sleep(2500); // esperamos 2,5 segundos y seguimos con la siguiente página
      } else {
        pagetoken = null; // salimos del bucle
      }
    } while (pagetoken);

    console.log(`Procesando ${allResults.length} lugares en total...`);

    // 7) Obtenemos una conexión del pool para insertar/actualizar en la BD.
    const conn = await pool.getConnection();
    try {
      // Recorremos TODOS los lugares acumulados (de todas las páginas).
      for (const place of allResults) {
        // Mapeo de campos de Google -> columnas de la tabla `lugar`.
        const nombre = place.name;
        const descripcion = "";
        const direccion = place.vicinity || place.formatted_address || "";
        const latitud = place.geometry.location.lat;
        const longitud = place.geometry.location.lng;
        const google_place_id = place.place_id;
        const categoriaOriginal = place.types?.[0] || type;  // ej. "restaurant"
        const categoria = traducirCategoria(categoriaOriginal); // ej. "Restaurante"

        // 8) Insertar o actualizar el lugar según google_place_id (UNIQUE).
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
      // 9) Devolvemos la conexión al pool aunque haya fallos dentro del try.
      conn.release();
    }

    console.log("✓ Importación completada");

    // 10) Respuesta OK con el total de lugares procesados (todas las páginas).
    res.json({
      message: "Lugares importados/actualizados",
      count: allResults.length,
    });
  } catch (err) {
    // 11) Manejo de errores generales (red, base de datos, etc.).
    console.error("Error importando desde Google Places:", err);
    res.status(500).json({
      error: "Error importando lugares",
      detalle: String(err),
    });
  }
});

export default router;