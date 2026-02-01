import mysql from "mysql2/promise";
import dotenv from "dotenv";

// En local, carga .env si existe. En Railway, process.env ya viene inyectado.
dotenv.config();

const useSSL = String(process.env.DB_SSL).toLowerCase() === "true";

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
