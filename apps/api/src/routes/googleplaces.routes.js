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
  };

  return traducciones[categoria] || categoria;
};

// Ruta: GET /google-places/importar?lat=40.4168&lng=-3.7038&radius=500&type=restaurant
router.get("/importar", async (req, res) => {
  try {
    console.log('=== Iniciando importación ===');
    
    // Lee parámetros de la query con valores por defecto.
    const { lat, lng, radius = 500, type = "restaurant" } = req.query;

    // Validación básica: lat y lng son obligatorios.
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    // API key de Google Places desde .env.
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Falta GOOGLE_PLACES_API_KEY en .env" });
    }

    console.log('Llamando a Google Places API...');

    // Construye la URL de la API Nearby Search de Google Places.
    const url =
     "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
    `?location=${lat},${lng}&radius=${radius}&type=${type}&language=es&key=${apiKey}`;


    // Llama a la API de Google Places y parsea la respuesta JSON.
    const response = await fetch(url);
    const data = await response.json();

    console.log('Respuesta de Google:', data.status);

    // Si la API no devuelve OK, responde con error 500.
    if (data.status !== "OK") {
      return res
        .status(500)
        .json({ error: "Error en Google Places", detalle: data.status, message: data.error_message });
    }

    console.log(`Procesando ${data.results.length} lugares...`);

    // Obtiene una conexión del pool para realizar las inserciones/actualizaciones.
    const conn = await pool.getConnection();

    try {
      // Recorre todos los lugares devueltos por Google.
      for (const place of data.results) {
        // Mapeo de campos de Google -> modelo de tu tabla `lugar`.
        const nombre = place.name;
        const descripcion = "";
        const direccion = place.vicinity || place.formatted_address || "";
        const latitud = place.geometry.location.lat;
        const longitud = place.geometry.location.lng;
        const google_place_id = place.place_id;
        const categoriaOriginal = place.types?.[0] || type;  // "restaurant"
        const categoria = traducirCategoria(categoriaOriginal);  // "restaurante"
        // Guarda "restaurante" en la columna categoria

        // Inserta en la tabla `lugar` o actualiza si ya existe el mismo google_place_id.
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
      // Devuelve la conexión al pool aunque haya error dentro del try.
      conn.release();
    }

    console.log('✓ Importación completada');

    // Respuesta OK: indica cuántos resultados se procesaron.
    res.json({
      message: "Lugares importados/actualizados",
      count: data.results.length,
    });
  } catch (err) {
    // Manejo de errores generales (red, BD, etc.).
    console.error("Error importando desde Google Places:", err);
    res.status(500).json({
      error: "Error importando lugares",
      detalle: String(err),
    });
  }
});

export default router;

