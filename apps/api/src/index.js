import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import etiquetasRoutes from "./routes/etiquetas.routes.js";
import lugaresRoutes from "./routes/lugares.routes.js";

dotenv.config();

const app = express();

app.use(cors({
origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

// rutas
app.use(healthRoutes);
app.use(etiquetasRoutes);
app.use(lugaresRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`API running on port ${PORT}`);
});
