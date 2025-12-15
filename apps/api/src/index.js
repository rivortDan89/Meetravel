import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

// Ruta de prueba
app.get("/health", (req, res) => {
res.json({ status: "API OK" });
});

// Arranque del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`API running on port ${PORT}`);
});
