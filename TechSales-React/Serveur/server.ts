import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// validates the server is up and running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * ===================================================
 * API pour la gestion des utilisateurs de TechSales
 * @author Amir
 *
 * Cette API fournit des endpoints pour la connexion des utilisateurs et la gestion de leurs données.
 * Elle utilise Express pour le serveur web et MySQL pour la base de données.
 * Endpoints disponibles :
 * - POST /login : Permet aux utilisateurs de se connecter en fournissant leur courriel et mot de passe.
 * - GET /dbtest : Permet de tester la connexion à la base de données en récupérant tous les utilisateurs.
 * - GET / : Permet de vérifier que l'API fonctionne en retournant un message de confirmation.
 * ====================================================
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
      token: token,
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

/*
 * Route pour la mise à jour des informations d'un utilisateur
 * Action : Permet de mettre à jour les informations d'un utilisateur en fournissant son ID dans l'URL
 * La route vérifie que les champs obligatoires sont remplis, puis exécute une requête SQL pour mettre
 * à jour. Si l'utilisateur est trouvé et mis à jour, une réponse de succès est retournée. Sinon, une
 * réponse d'erreur est retournée.
 * Méthode : PUT
 * URL : http://localhost:4000/utilisateur/:id
 */
app.put("/utilisateur/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, courriel, adresse, role } = req.body;

    if (!nom || !prenom || !courriel || !role) {
      return res.status(400).json({
        message: "Champs obligatoires manquants.",
      });
    }

    const [result] = await pool.query(
      `UPDATE utilisateur
       SET nom = ?, prenom = ?, courriel = ?, adresse = ?, role = ?
       WHERE id_utilisateur = ?`,
      [nom, prenom, courriel, adresse, role, id],
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
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
// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "martin",
  password: "oracle",
  database: "TechSales",
});


/**
 * =====================================
 * API pour table categorie
 * @author Martin
 *
 * Commande pour la creation de la DB dans docker
 * docker run -d --name TechSales-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=TechSales -e MYSQL_USER=martin -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
 * command to start server : npx tsx server.ts
 * ======================================
 */

// GET toutes les categories de la table categorie
app.get("/categories", async (req, res) => {
  try {
    const [allCategories] = await pool.query(
      "SELECT * FROM TechSales.categorie",
    );
    res.status(200).json(allCategories);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] GET /categorie ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

// GET a specific category with a specified id_categorie
// req -> request sent by the client to the server
// res -> response sent by the server to the client
app.get("/categorie/:id", async (req, res) => {
  try {
    // URL parameters ":id" are always strings, we need to cast Number() for the SQL query
    const idCategorie = Number(req.params.id);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // query must have the exact field name to work
    // destructuring principle -> pool.query sends [rows, field], we only keep the "rows" aka the data/
    const [exactCategory] = await pool.query(
      "SELECT * FROM categorie WHERE id_categorie = ?",
      [idCategorie],
    );

    // exactCategory is an array of all matching rows
    // we want the first element since we're looking by unique key/id -> element at index 0
    // ... as any[] is a Typescript cast telling the compiler to treat exactCategory as an Javascript array
    const categorie = (exactCategory as any[])[0];
    // if [0] aka no row matched -> undefined = false
    if (!categorie) {
      return res
        .status(404)
        .json({ message: `Categorie not found for id : ${idCategorie}` });
    }

    // return response with the varaible containing the desired data
    res.status(200).json(categorie);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] GET /categorie/:id ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

// POST create a new data entry in the categorie table
app.post("/categorie/ajoutCategorie", async (req, res) => {
  try {
    // only category needed because the id is auto-incremented
    const { nomCategorie } = req.body;
    if (!nomCategorie) {
      return res.status(400).json({ message: "Category name is required" });
    }

    await pool.query(
      `INSERT INTO categorie (nom_categorie) 
      values (?)`,
      [nomCategorie],
    );

    res.status(201).json({ message: "New category added successfully" });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST categorie/ajoutCategorie ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

// PUT update a specific data in the categorie table
app.put("/categorie/:id/mettreAJour", async (req, res) => {
  try {
    const idCategorie = Number(req.params.id);
    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const { modifiedCategoryName } = req.body;

    if (!modifiedCategoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const [result] = await pool.query(
      `SELECT * FROM categorie WHERE id_categorie = ?`,
      [idCategorie],
    );
    const category = (result as any[])[0];
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await pool.query(
      `UPDATE categorie
      SET nom_categorie = ?
      WHERE id_categorie = ?`,
      [modifiedCategoryName, idCategorie],
    );

    res
      .status(200)
      .json({ message: `Categorie id : ${idCategorie} modified successfully` });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PUT /categorie/:id/mettreAJour -> `,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

// DELETE a category from the table with an id
app.delete("/categorie/:id/effacer", async (req, res) => {
  try {
    const idCategory = Number(req.params.id);
    if (isNaN(idCategory)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const [result] = await pool.query(
      `SELECT * FROM categorie WHERE id_categorie=?`,
      [idCategory],
    );

    const categorie = (result as any[])[0];
    if (!categorie) {
      return res.status(404).json({ message: "Category not found" });
    }

    await pool.query(`DELETE FROM categorie WHERE id_categorie = ?`, [
      idCategory,
    ]);

    res
      .status(200)
      .send({ message: `Category ${idCategory} deleted successfully` });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] DELETE /categorie/:id/effacer ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});
