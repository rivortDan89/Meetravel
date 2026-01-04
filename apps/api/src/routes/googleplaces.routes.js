
import { Router } from "express";            // Router de Express para crear rutas modulares. 
import mysql from "mysql2/promise";          // mysql2 en modo promesas para usar async/await. 

const router = Router();                     // Crea un router específico para las rutas de Google Places.

// Pool de conexiones a MySQL (reutilizable entre peticiones).
const pool = mysql.createPool({
  host: process.env.DB_HOST,                 // Host de la BD (por ejemplo, localhost).
  user: process.env.DB_USER,                 // Usuario de MySQL.
  password: process.env.DB_PASSWORD,         // Contraseña de MySQL.
  database: process.env.DB_NAME,             // Nombre de la base de datos.
});

// Ruta: GET /google-places/importar?lat=40.4168&lng=-3.7038&radius=500&type=restaurant
router.get("/importar", async (req, res) => {
  try {
    // Lee parámetros de la query con valores por defecto.
    const { lat, lng, radius = 500, type = "restaurant" } = req.query;

    // Validación básica: lat y lng son obligatorios.
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    // API key de Google Places desde .env.
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Construye la URL de la API Nearby Search de Google Places. 
    const url =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
      `?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    // Llama a la API de Google Places y parsea la respuesta JSON.
    const response = await fetch(url);
    const data = await response.json();

    // Si la API no devuelve OK, responde con error 500.
    if (data.status !== "OK") {
      return res
        .status(500)
        .json({ error: "Error en Google Places", detalle: data.status });
    }

    // Obtiene una conexión del pool para realizar las inserciones/actualizaciones.
    const conn = await pool.getConnection();

    try {
      // Recorre todos los lugares devueltos por Google. 
      for (const place of data.results) {
        // Mapeo de campos de Google -> modelo de tu tabla `lugar`.
        const nombre = place.name;                                   // Nombre del sitio.
        const descripcion = "";                                      // De momento vacío; puedes generar un texto si quieres.
        const direccion =
          place.vicinity || place.formatted_address || "";           // Dirección corta o formateada. 
        const latitud = place.geometry.location.lat;                 // Latitud.
        const longitud = place.geometry.location.lng;                // Longitud.
        const google_place_id = place.place_id;                      // ID único del lugar en Google. 
        const categoria = place.types?.[0] || type;                  // Primer tipo devuelto o el type de la query. 

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
      conn.release();                                               // Evita fugas de conexiones. 
    }

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

// Exporta el router para usarlo en index.js con:
// app.use("/google-places", googlePlacesRouter);
export default router;
