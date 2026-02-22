import mysql from "mysql2/promise";
import dotenv from "dotenv";

// En local cargamos .env; en despliegues tipo Railway/Render las variables ya vienen inyectadas.
dotenv.config();

// SSL opcional para entornos cloud (algunas BD gestionadas lo requieren).
const useSSL = String(process.env.DB_SSL).toLowerCase() === "true";

// Pool de conexiones: evita abrir/cerrar conexión por cada request y mejora rendimiento en llamadas concurrentes.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  enableKeepAlive: true,
  connectTimeout: 10000,
});