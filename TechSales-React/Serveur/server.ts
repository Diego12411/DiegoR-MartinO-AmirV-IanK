import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

/**
 * API pour la gestion des utilisateurs de TechSales
 * @author Amir
 *
 * Cette API fournit des endpoints pour la connexion des utilisateurs et la gestion de leurs données.
 * Elle utilise Express pour le serveur web et MySQL pour la base de données.
 * Endpoints disponibles :
 * - POST /login : Permet aux utilisateurs de se connecter en fournissant leur courriel et mot de passe.
 * - GET /dbtest : Permet de tester la connexion à la base de données en récupérant tous les utilisateurs.
 * - GET / : Permet de vérifier que l'API fonctionne en retournant un message de confirmation.
 */

type Utilisateur = {
  id_utilisateur: number;
  courriel: string;
  mot_de_passe: string;
  role: string;
};

type JwtPayload = {
  id_utilisateur: number;
  courriel: string;
  role: string;
};

/*
 * Route de test pour vérifier que le serveur fonctionne
 * Action : Lorsque cette route est appelée, elle retourne un message indiquant que l'API fonctionne.
 * Méthode : GET
 * URL : http://localhost:4000/
 */
app.get("/", (req, res) => {
  res.send("TechSales API running");
});

/*
 * Route de test pour vérifier la connexion à la base de données et récupérer tous les utilisateurs
 * Action : Exécute une requête SQL pour sélectionner tous les utilisateurs de la table "utilisateur"
 * et retourne les résultats au format JSON.
 * Méthode : GET
 * URL : http://localhost:4000/dbtest
 */
app.get("/dbtest", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM utilisateur");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

/*
 * Route pour la connexion des utilisateurs
 * Action : Permet aux utilisateurs de se connecter en fournissant leur courriel et mot de passe.
 * La route vérifie que les champs sont remplis, puis exécute une requête SQL pour trouver l'utilisateur
 * correspondant. Si l'utilisateur est trouvé et que le mot de passe correspond, une réponse de succès
 * est retournée avec les informations de l'utilisateur. Sinon, une réponse d'erreur est retournée.
 * Méthode : POST
 * URL : http://localhost:4000/login
 */
app.post("/login", async (req, res) => {
  try {
    const { courriel, mot_de_passe } = req.body;

    if (!courriel || !mot_de_passe) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs.",
      });
    }

    const [rows] = await pool.query(
      `SELECT id_utilisateur, courriel, mot_de_passe, role
       FROM utilisateur
       WHERE courriel = ?`,
      [courriel],
    );

    const users = rows as Utilisateur[];

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

    // Génération d'un token JWT pour l'utilisateur connecté
    const token = jwt.sign(
      {
        id_utilisateur: user.id_utilisateur,
        courriel: user.courriel,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" },
    );

    return res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id_utilisateur: user.id_utilisateur,
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
