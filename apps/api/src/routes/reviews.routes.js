// src/routes/reviews.routes.js
import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

// GET /api/reviews/accesibilidad/:idLugar
router.get("/accesibilidad/:idLugar", async (req, res) => {
  try {
    const { idLugar } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        ra.id_resena_accesibilidad AS id,
        u.nombre                   AS usuario,
        ra.comentario,
        ra.puntuacion,
        e.nombre                   AS etiqueta,
        ra.fecha
      FROM resena_accesibilidad ra
        JOIN usuario u  ON u.id_usuario = ra.id_usuario
        JOIN etiqueta e ON e.id_etiqueta = ra.id_etiqueta
      WHERE ra.id_lugar = ?
      ORDER BY ra.fecha DESC
      `,
      [idLugar]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error obteniendo reseñas:", err);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

export default router;
