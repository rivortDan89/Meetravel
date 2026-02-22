import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// GET /api/places
// Devuelve los lugares junto con métricas de accesibilidad agregadas (conteo y medias).
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        l.id_lugar AS id,
        l.nombre,
        l.descripcion,
        l.latitud,
        l.longitud,
        l.categoria,
        l.direccion,
        l.google_place_id,
        l.foto_url,

        COUNT(DISTINCT ra.id_resena_accesibilidad) AS total_resenas_accesibilidad,

        AVG(CASE WHEN ra.id_etiqueta = 1 THEN ra.puntuacion END) AS avg_rampa,
        AVG(CASE WHEN ra.id_etiqueta = 2 THEN ra.puntuacion END) AS avg_aseo_adaptado,
        AVG(CASE WHEN ra.id_etiqueta = 3 THEN ra.puntuacion END) AS avg_aparcamiento_accesible,
        AVG(CASE WHEN ra.id_etiqueta = 4 THEN ra.puntuacion END) AS avg_ascensor_plataforma,
        AVG(CASE WHEN ra.id_etiqueta = 5 THEN ra.puntuacion END) AS avg_perro_guia,
        AVG(CASE WHEN ra.id_etiqueta = 6 THEN ra.puntuacion END) AS avg_info_audio,
        AVG(CASE WHEN ra.id_etiqueta = 7 THEN ra.puntuacion END) AS avg_senaletica_braille,
        AVG(CASE WHEN ra.id_etiqueta = 8 THEN ra.puntuacion END) AS avg_info_subtitulos
      FROM lugar l
      -- Solo contamos reseñas de etiquetas que estén permitidas para esa categoría
      LEFT JOIN categoria_etiqueta ce
        ON ce.categoria = l.categoria
      LEFT JOIN resena_accesibilidad ra
        ON ra.id_lugar = l.id_lugar
       AND ra.id_etiqueta = ce.id_etiqueta
      GROUP BY l.id_lugar
    `);

    // Umbral para transformar medias (0..5) en booleanos que usa el filtrado del frontend.
    // Lo dejamos aquí porque así el cliente no tiene que repetir la lógica de “>= 2.5”.
    const THRESHOLD = 2.5;

    const lugares = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      latitud: parseFloat(row.latitud),
      longitud: parseFloat(row.longitud),
      categoria: row.categoria,
      direccion: row.direccion,
      google_place_id: row.google_place_id,
      totalResenasAccesibilidad: row.total_resenas_accesibilidad,
      fotoUrl: row.foto_url,

      // Medias por etiqueta (si la UI quiere mostrarlas como “chips” con color)
      avgRampa: row.avg_rampa,
      avgAseoAdaptado: row.avg_aseo_adaptado,
      avgAparcamientoAccesible: row.avg_aparcamiento_accesible,
      avgAscensorPlataforma: row.avg_ascensor_plataforma,
      avgPerroGuia: row.avg_perro_guia,
      avgInfoAudio: row.avg_info_audio,
      avgSenaleticaBraille: row.avg_senaletica_braille,
      avgInfoSubtitulos: row.avg_info_subtitulos,

      // Flags listas para filtrar rápido en frontend
      rampa: row.avg_rampa >= THRESHOLD,
      aseoAdaptado: row.avg_aseo_adaptado >= THRESHOLD,
      aparcamientoAccesible: row.avg_aparcamiento_accesible >= THRESHOLD,
      ascensorPlataforma: row.avg_ascensor_plataforma >= THRESHOLD,
      perroGuia: row.avg_perro_guia >= THRESHOLD,
      infoAudio: row.avg_info_audio >= THRESHOLD,
      senaleticaBraille: row.avg_senaletica_braille >= THRESHOLD,
      infoSubtitulos: row.avg_info_subtitulos >= THRESHOLD,
    }));

    res.json(lugares);
  } catch (err) {
    console.error("Error obteniendo lugares:", err);
    res.status(500).json({
      error: "Error al obtener lugares",
      detalle: String(err),
    });
  }
});

export default router;