import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Créer une connexion à la base de données MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "amir",
  password: "oracle",  
  database: "techsales",
  port: 3306,
});

// tester la connexion à la base de données
app.get("/dbtest", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM utilisateur");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// listen est une méthode qui démarre le serveur et écoute les requêtes entrantes sur le port spécifié.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



