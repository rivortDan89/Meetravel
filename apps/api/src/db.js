import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

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

  // Railway muchas veces requiere SSL; si no, no conecta.
ssl: useSSL ? { rejectUnauthorized: false } : undefined,

  // Evita el error típico: "Public Key Retrieval is not allowed"
  // (en algunos entornos MySQL 8+ / auth caching_sha2_password)
enableKeepAlive: true
});
