import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mysql from "mysql2/promise";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

/**
 * =====================================================================================================
 * API pour la gestion des utilisateurs de TechSales
 * @author Amir
 *
 * Cette API fournit des endpoints pour la connexion des utilisateurs et la gestion de leurs données.
 * Elle utilise Express pour le serveur web et MySQL pour la base de données.
 * Endpoints disponibles :
 * - POST /login : Permet aux utilisateurs de se connecter en fournissant leur courriel et mot de passe.
 * - GET /dbtest : Permet de tester la connexion à la base de données en récupérant tous les utilisateurs.
 * - GET / : Permet de vérifier que l'API fonctionne en retournant un message de confirmation.
 * - PUT /utilisateur/:id : Permet de mettre à jour les informations d'un utilisateur en fournissant son ID dans l'URL.
 * - Middleware verifierToken : Permet de vérifier la validité du token JWT dans les requêtes protégées.
 * ======================================================================================================
 */

// Type personnalisé pour les données d'un utilisateur extraites de la base de données
type Utilisateur = {
  id_utilisateur: number;
  courriel: string;
  mot_de_passe: string;
  role: string;
};

// Type personnalisé pour les données extraites du token JWT
type JwtPayload = {
  id_utilisateur: number;
  courriel: string;
  role: string;
};

// Type personnalisé pour les requêtes authentifiées, incluant les données du token JWT
type AuthRequest = Request & {
  user?: JwtPayload;
};

/*
 * La fonction middleware pour vérifier le token JWT dans les requêtes protégées
 * Action : Cette fonction middleware vérifie que le token JWT est présent dans les en-têtes de la
 * requête, qu'il est valide et non expiré. Si le token est valide, les données extraites du token sont
 * ajoutées à l'objet de requête pour une utilisation ultérieure dans les routes protégées. Si le
 * token est manquant ou invalide, une réponse d'erreur 401 Unauthorized est retournée.
 * Méthode : Middleware (utilisé dans les routes protégées)
 * URL : N/A (utilisé dans les routes nécessitant une authentification)
 */
function verifierToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token invalide." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

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
      { expiresIn: "1m" },
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

/*
 * Route protégée pour récupérer les informations du profil de l'utilisateur connecté
 * Action : Permet de récupérer les informations du profil de l'utilisateur connecté en utilisant le
 * token JWT pour identifier l'utilisateur. La route utilise le middleware "verifierToken" pour s'assurer
 * que la requête est authentifiée. Si le token est valide, une requête SQL est exécutée pour récupérer
 * les informations de l'utilisateur à partir de la base de données, et les données sont retournées au
 * format JSON. Si le token est manquant ou invalide, une réponse d'erreur 401 Unauthorized est retournée.
 * Méthode : GET
 * URL : http://localhost:4000/profil
 */
app.get("/profil", verifierToken, async (req: AuthRequest, res: Response) => {
  try {
    const id_utilisateur = req.user?.id_utilisateur;

    const [rows] = await pool.query(
      `SELECT id_utilisateur, nom, prenom, courriel, adresse, role
       FROM utilisateur
       WHERE id_utilisateur = ?`,
      [id_utilisateur],
    );

    const utilisateurs = rows as any[];

    if (utilisateurs.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    return res.status(200).json(utilisateurs[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
});
// =====================================================================================================
// Fin de l'API pour la gestion des utilisateurs de TechSales écrite par Amir //////////////////////////
// =====================================================================================================


//Diego
app.post("/utilisateur", async (req, res) => {
  try {
    const { nom, prenom, mot_de_passe, courriel } = req.body;

    const [result] = await pool.query(
      `INSERT INTO utilisateur (nom, prenom, mot_de_passe, courriel, role)
       VALUES (?, ?, ?, ?, "client")`,
      [nom, prenom, mot_de_passe, courriel],
    );

    res.status(201).json({ message: "Utilisateur créé"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

//Faire delete
app.delete("/utilisateur", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "ID manquant" });

    const [result] = await pool.query(
      "DELETE FROM utilisateur WHERE id_utilisateur = ?",
      [id]
    );

    if ((result as any).affectedRows === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

//Update
app.put("/utilisateur", async (req, res) => {
  try {
    const { id_utilisateur, nom, prenom, mot_de_passe, courriel, role } = req.body;

    const [result] = await pool.query(
      `UPDATE utilisateur
       SET nom = ?,
           prenom = ?,
           mot_de_passe = ?,
           courriel = ?,
           role = ?
       WHERE id_utilisateur = ?;`,
      [nom, prenom, mot_de_passe, courriel, role, id_utilisateur]
    );

if ((result as any).affectedRows === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.status(200).json({ message: "Utilisateur changé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

/**
* GET sur table utilisateur -> retourne toutes les informations des utilisateurs
* @author Diego
*/
app.get("/utilisateur", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur"
    );

    res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

/**
* Faire get et afficher dans compte
* POST sur la table utilisateur -> create nouveau data pour un nouvel utilisateur
* @author Diego
*/
app.post("/utilisateur", async (req, res) => {
  try {
    const { nom, prenom, mot_de_passe, courriel } = req.body;

    const [result] = await pool.query(
      `INSERT INTO utilisateur (nom, prenom, mot_de_passe, courriel, role)
       VALUES (?, ?, ?, ?, "client")`,
      [nom, prenom, mot_de_passe, courriel],
    );

    res.status(201).json({ message: "Utilisateur créé"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});
// =====================================================================================================
// Fin de l'API pour la gestion des utilisateurs de TechSales écrite par Diego //////////////////////////
// =====================================================================================================

/**
 * =========================================================================
 * API pour table categorie
 * @author Martin
 *
 * Commande pour la creation de la DB dans docker
 * docker run -d --name TechSales-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=TechSales -e MYSQL_USER=martin -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
 * command to start server : npx tsx server.ts
 * ========================================================================
 */

// // Create connection pool
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "martin",
//   password: "oracle",
//   database: "TechSales",
//   port: 3306,
// });

// GET toutes les categories de la table categorie
app.get("/categories", async (req, res) => {
  try {
    const [allCategories] = await pool.query("SELECT * FROM categorie");
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
// =====================================================================================================
// Fin de l'API pour la gestion des categories de TechSales écrite par Martin //////////////////////////
// =====================================================================================================

/**
 * ==================================================================
 * API pour la table produit
 * @author Ian
 * ==================================================================
 */

//GET dans la table produit
app.get("/produits", async (req, res) => {
  try {

    const [rows] = await pool.query(
      "SELECT * FROM produit"
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/produits/:id", async (req, res) => {

  const id = req.params.id;

  const [rows] = await pool.query(
    "SELECT * FROM produit WHERE id_produit = ?",
    [id]
  );

  res.json(rows);

});

//CREATE dans la table produit
app.post("/produits", async (req, res) => {

  const {
    specs_id_specs,
    nom,
    description,
    prix,
    stock,
    image_url
  } = req.body;

  try {

    const [result] = await pool.query(
      `INSERT INTO produit
      (specs_id_specs, nom, description, prix, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [specs_id_specs, nom, description, prix, stock, image_url]
    );

    res.json(result);

  } catch (err) {
    res.status(500).json(err);
  }

});

//MODIFIER dans la table produit
app.put("/produits/:id", async (req, res) => {

  const id = req.params.id;
  const { nom, prix, stock } = req.body;

  try {

    const [result] = await pool.query(
      "UPDATE produit SET nom = ?, prix = ?, stock = ? WHERE id_produit = ?",
      [nom, prix, stock, id]
    );

    res.json(result);

  } catch (err) {
    res.status(500).json(err);
  }

});

//SUPPRIMER dans la table produit
app.delete("/produits/:id", async (req, res) => {

  const id = req.params.id;

  try {

    const [result] = await pool.query(
      "DELETE FROM produit WHERE id_produit = ?",
      [id]
    );

    res.json(result);

  } catch (err) {
    res.status(500).json(err);
  }
});
// =====================================================================================================
// Fin de l'API pour la g
// 



//estion des produits de TechSales écrite par Ian //////////////////////////
// =====================================================================================================

// Verification du roulement du serveur pour la base de donnees
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});