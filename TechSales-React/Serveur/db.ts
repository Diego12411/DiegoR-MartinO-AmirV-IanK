import mysql from "mysql2/promise";

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: "localhost",
  user: "amir",
  password: "oracle",
  database: "techsales",
  port: 3306,
});

export default pool;