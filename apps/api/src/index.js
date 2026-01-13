import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import etiquetasRoutes from "./routes/etiquetas.routes.js";
import lugaresRoutes from "./routes/lugares.routes.js";
import googlePlacesRouter from "./routes/googleplaces.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(express.json());

// rutas con prefijo
app.use("/health", healthRoutes);
app.use("/etiquetas", etiquetasRoutes);
app.use('/api/lugares', lugaresRoutes);
app.use("/google-places", googlePlacesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

