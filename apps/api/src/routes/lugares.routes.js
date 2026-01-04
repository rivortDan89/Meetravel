
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /lugares-accesibles
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id_lugar,
        nombre,
        descripcion,
        latitud,
        longitud,
        categoria,
        direccion,
        google_place_id
      FROM lugar
    `);

    const lugares = rows.map((row) => ({
      id: row.id_lugar,
      nombre: row.nombre,
      descripcion: row.descripcion,
      latitud: row.latitud,
      longitud: row.longitud,
      categoria: row.categoria,
      direccion: row.direccion,
      google_place_id: row.google_place_id,
      sillaRuedas: false, // de momento
    }));

    res.json(lugares);
  } catch (err) {
    console.error("Error obteniendo lugares:", err);
    res.status(500).json({ error: "Error al obtener lugares", detalle: String(err) });
  }
});

export default router;
