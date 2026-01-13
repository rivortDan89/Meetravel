// Importa el creador de routers de Express (para definir rutas HTTP)
import { Router } from "express";
// Importa el pool de conexiones a MySQL (configurado en db.js)
import { pool } from "../config/db.js";

// Crea una instancia de router donde definiremos los endpoints de lugares
const router = Router();

// Ruta GET /  (cuando se monte como /api/lugares será GET /api/lugares)
router.get("/", async (req, res) => {
  try {
    // 1) Consulta SQL:
    //    - Devuelve información básica de cada lugar
    //    - Calcula la media de puntuación de cada etiqueta de accesibilidad
    const [rows] = await pool.query(`
      SELECT
        l.id_lugar AS id,          -- identificador del lugar
        l.nombre,                  -- nombre del lugar
        l.descripcion,             -- descripción
        l.latitud,                 -- latitud
        l.longitud,                -- longitud
        l.categoria,               -- categoría (Restaurante, Hotel, etc.)
        l.direccion,               -- dirección
        l.google_place_id,         -- id de Google Places (para no duplicar)

        -- Medias de puntuación por etiqueta (1..8) a partir de resena_accesibilidad
        AVG(CASE WHEN ra.id_etiqueta = 1 THEN ra.puntuacion END) AS avg_rampa,
        AVG(CASE WHEN ra.id_etiqueta = 2 THEN ra.puntuacion END) AS avg_aseo_adaptado,
        AVG(CASE WHEN ra.id_etiqueta = 3 THEN ra.puntuacion END) AS avg_aparcamiento_accesible,
        AVG(CASE WHEN ra.id_etiqueta = 4 THEN ra.puntuacion END) AS avg_ascensor_plataforma,
        AVG(CASE WHEN ra.id_etiqueta = 5 THEN ra.puntuacion END) AS avg_perro_guia,
        AVG(CASE WHEN ra.id_etiqueta = 6 THEN ra.puntuacion END) AS avg_info_audio,
        AVG(CASE WHEN ra.id_etiqueta = 7 THEN ra.puntuacion END) AS avg_senaletica_braille,
        AVG(CASE WHEN ra.id_etiqueta = 8 THEN ra.puntuacion END) AS avg_info_subtitulos
      FROM lugar l
      -- Une cada lugar con sus reseñas de accesibilidad (puede no haber reseñas)
      LEFT JOIN resena_accesibilidad ra
        ON ra.id_lugar = l.id_lugar
      -- Agrupa por lugar para que AVG calcule una media por sitio
      GROUP BY l.id_lugar
    `);

    // 2) Umbral mínimo de nota para “activar” una etiqueta (0–5 → a partir de 2.5 cuenta)
    const THRESHOLD = 2.5;

    // 3) Transformar cada fila de la BD en un objeto que usará el frontend
    const lugares = rows.map((row) => ({
      // Datos básicos del lugar
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      latitud: parseFloat(row.latitud),   // nos aseguramos de que son números
      longitud: parseFloat(row.longitud),
      categoria: row.categoria,
      direccion: row.direccion,
      google_place_id: row.google_place_id,

      // Notas medias por etiqueta (por si se quieren mostrar en la UI)
      avgSillaRuedas: row.avg_rampa,
      avgAseoAdaptado: row.avg_aseo_adaptado,
      avgAparcamientoAccesible: row.avg_aparcamiento_accesible,
      avgAscensorPlataforma: row.avg_ascensor_plataforma,
      avgPerroGuia: row.avg_perro_guia,
      avgInfoAudio: row.avg_info_audio,
      avgSenaleticaBraille: row.avg_senaletica_braille,
      avgInfoSubtitulos: row.avg_info_subtitulos,

      // Banderas booleanas de accesibilidad:
      // true solo si la media de esa etiqueta es >= THRESHOLD (2.5)
      sillaRuedas: row.avg_rampa >= THRESHOLD,
      aseoAdaptado: row.avg_aseo_adaptado >= THRESHOLD,
      aparcamientoAccesible: row.avg_aparcamiento_accesible >= THRESHOLD,
      ascensorPlataforma: row.avg_ascensor_plataforma >= THRESHOLD,
      perroGuia: row.avg_perro_guia >= THRESHOLD,
      infoAudio: row.avg_info_audio >= THRESHOLD,
      senaleticaBraille: row.avg_senaletica_braille >= THRESHOLD,
      infoSubtitulos: row.avg_info_subtitulos >= THRESHOLD,
    }));

    // 4) Enviamos al cliente el array de lugares ya procesado
    res.json(lugares);
  } catch (err) {
    // 5) Si algo falla (consulta, conexión, etc.), se captura aquí
    console.error("Error obteniendo lugares:", err);
    res.status(500).json({
      error: "Error al obtener lugares",
      detalle: String(err),
    });
  }
});

// Exporta el router para usarlo en el servidor principal con app.use("/api/lugares", router)
export default router;

