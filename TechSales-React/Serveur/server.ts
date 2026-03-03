import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";


// Create connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "scott",
});


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/utilisateur", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM utilisateur");
    res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/utilisateur", async (req, res) => {
  try {
    const { id_utilisateur, nom, prenom, mot_de_passe, courriel, adresse, role } = req.body;

    const [result] = await pool.query( //Pour l'instant Je ne crée pas de role ou adresse car n'existe pas dans le formulaire de création compte. Id user est auto incrémenté
      `INSERT INTO utilisateur (nom, prenom, mot_de_passe, courriel)
             VALUES (?, ?, ?, ?)`,
      [nom, prenom, mot_de_passe, courriel],
    );

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});


