import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// GET /lugares-accesibles
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_lugar as id,
        l.nombre,
        l.descripcion,
        l.latitud,
        l.longitud,
        l.categoria,
        l.direccion,
        l.google_place_id,
        GROUP_CONCAT(e.nombre_etiqueta) as etiquetas
      FROM lugar l
      LEFT JOIN lugar_etiqueta le ON l.id_lugar = le.id_lugar
      LEFT JOIN etiqueta e ON le.id_etiqueta = e.id_etiqueta
      GROUP BY l.id_lugar
    `);

    const lugares = rows.map((row) => {
      const etiquetasArray = row.etiquetas ? row.etiquetas.split(',') : [];
      
      return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        latitud: parseFloat(row.latitud),
        longitud: parseFloat(row.longitud),
        categoria: row.categoria,
        direccion: row.direccion,
        google_place_id: row.google_place_id,
        // 8 características de accesibilidad
        sillaRuedas: etiquetasArray.includes('silla_ruedas'),
        aseoAdaptado: etiquetasArray.includes('aseo_adaptado'),
        aparcamientoAccesible: etiquetasArray.includes('aparcamiento_accesible'),
        ascensorPlataforma: etiquetasArray.includes('ascensor_plataforma'),
        perroGuia: etiquetasArray.includes('perro_guia'),
        infoAudio: etiquetasArray.includes('info_audio'),
        senaleticaBraille: etiquetasArray.includes('senaletica_braille'),
        infoSubtitulos: etiquetasArray.includes('info_subtitulos'),
      };
    });

    res.json(lugares);
  } catch (err) {
    console.error("Error obteniendo lugares:", err);
    res.status(500).json({ error: "Error al obtener lugares", detalle: String(err) });
  }
});

export default router;
