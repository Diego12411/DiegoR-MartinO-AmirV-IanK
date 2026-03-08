import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Création d'une pool de connexions à la base de données MySQL en utilisant les variables d'environnement pour la configuration.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});
