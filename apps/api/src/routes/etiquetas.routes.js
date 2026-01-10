import { Router } from "express";
import { ETIQUETAS } from "../data/etiquetas.mock.js";

const router = Router();

router.get("/", (req, res) => {
    const { tipo } = req.query;

    const data = tipo
        ? ETIQUETAS.filter(e => e.tipo === tipo)
        : ETIQUETAS;

    res.json(data);
});

export default router;
