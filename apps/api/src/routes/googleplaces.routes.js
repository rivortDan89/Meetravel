import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// Traducción rápida de categorías de Google a nombres más amigables en la UI.
// No buscamos cubrir el 100% de tipos: solo los más frecuentes en las pruebas.
const traducirCategoria = (categoria) => {
  const traducciones = {
    restaurant: "Restaurante",
    lodging: "Alojamiento",
    hotel: "Hotel",
    cafe: "Cafetería",
    bar: "Bar",
    museum: "Museo",
    tourist_attraction: "Atracción turística",
    park: "Parque",
    shopping_mall: "Centro comercial",
    store: "Tienda",
    meal_delivery: "Entrega de comida",
    meal_takeaway: "Comida para llevar",
    food: "Comida",
    point_of_interest: "Punto de interés",
    establishment: "Establecimiento",
    night_club: "Discoteca",
    spa: "Spa",
    gym: "Gimnasio",
    pharmacy: "Farmacia",
    hospital: "Hospital",
    church: "Iglesia",
    bakery: "Panadería",
    airport: "Aeropuerto",
    train_station: "Estación de tren",
    bus_station: "Estación de autobús",
    parking: "Aparcamiento",
    gas_station: "Gasolinera",
    supermarket: "Supermercado",
    grocery_or_supermarket: "Supermercado",
    liquor_store: "Tienda de licores",
    beauty_salon: "Salon de belleza",
    library: "Biblioteca",
    movie_theater: "Cine",
    art_gallery: "Galería de arte",
    "clothing store": "Tienda de moda",
    jewelry_store: "Tienda de joyas",
    book_store: "Tienda de libros",
    health: "Salud",
  };

  return traducciones[categoria] || categoria;
};

// Importación “rápida” desde Google Places (Nearby Search).
// Lo usamos para poblar la BD con datos de prueba y evitar meter lugares a mano.
router.get("/importar", async (req, res) => {
  try {
    const { lat, lng, radius = 1000, type = "restaurant" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Falta GOOGLE_PLACES_API_KEY en .env" });
    }

    // Nota: aquí hacemos una única llamada sin paginar.
    // Para el alcance del proyecto intermodular era suficiente y más simple de mantener.
    const url =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
      `?location=${lat},${lng}&radius=${radius}&type=${type}&language=es&key=${apiKey}`;

    console.log("Google Places import:", { lat, lng, radius, type });

    const response = await fetch(url);
    const data = await response.json();

    // ZERO_RESULTS no lo tratamos como error: simplemente no hay lugares en esa zona.
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return res.status(500).json({
        error: "Error en Google Places",
        detalle: data.status,
        message: data.error_message,
      });
    }

    const resultados = data.results || [];

    const conn = await pool.getConnection();
    try {
      for (const place of resultados) {
        const nombre = place.name;
        const descripcion = ""; // dejamos este campo para una iteración futura
        const direccion = place.vicinity || place.formatted_address || "";
        const latitud = place.geometry.location.lat;
        const longitud = place.geometry.location.lng;
        const google_place_id = place.place_id;

        // Nos quedamos con el primer type como “categoría base”.
        const categoriaOriginal = place.types?.[0] || type;
        const categoria = traducirCategoria(categoriaOriginal);

        // Insert/Update por google_place_id (evita duplicados cuando re-importamos la misma zona)
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
          [nombre, descripcion, latitud, longitud, categoria, direccion, google_place_id]
        );
      }
    } finally {
      // Siempre devolvemos la conexión al pool
      conn.release();
    }

    res.json({
      message: "Importación completada",
      count: resultados.length,
    });
  } catch (err) {
    console.error("Error importando desde Google Places:", err);
    res.status(500).json({
      error: "Error importando lugares",
      detalle: String(err),
    });
  }
});

export default router;