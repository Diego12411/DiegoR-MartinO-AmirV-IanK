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

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("TechSales API running");
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

// Route pour gérer la connexion des utilisateurs
app.post("/login", async (req, res) => {
  try {
    const { courriel, mot_de_passe } = req.body;

    if (!courriel || !mot_de_passe) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs.",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE courriel = ?",
      [courriel]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({
        message: "Courriel ou mot de passe invalide.",
      });
    }

    const user = users[0];

    if (user.mot_de_passe !== mot_de_passe) {
      return res.status(401).json({
        message: "Courriel ou mot de passe invalide.",
      });
    }

    res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id: user.id_utilisateur,
        courriel: user.courriel,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// listen est une méthode qui démarre le serveur et écoute les requêtes entrantes sur le port spécifié.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



