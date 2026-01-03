import { Router } from "express";
import { LUGARES } from "../data/lugares.mock.js";

const router = Router();

// Lista de lugares (para marcadores)
router.get("/lugares", (req, res) => {
  // MVP: devolver todo tal cual
res.json(LUGARES);
});

// Ficha de un lugar
router.get("/lugares/:id", (req, res) => {
const id = Number(req.params.id);
const lugar = LUGARES.find(l => l.id_lugar === id);

if (!lugar) return res.status(404).json({ error: "Lugar no encontrado" });

res.json(lugar);
});

export default router;
