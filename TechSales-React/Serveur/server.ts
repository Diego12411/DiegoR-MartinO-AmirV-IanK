import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "martin",
  password: "oracle",
  database: "TechSales",
});

/**
 * -----------------------------
 * API pour table categorie / Produit-Categorie / Categorie
 * @author Martin
 *
 * Commande pour la creation de la DB dans docker
 * docker run -d --name TechSales-server -p 3306:3306 -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=TechSales -e MYSQL_USER=martin -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
 * -----------------------------
 */

/**
 * la table Produit-Categorie est une table qui joint Produit_id_produit et Categorie_id_categorie
 * Logique :
 *  -> La table categorie doit deja contenir differentes categories de laptop
 *  -> la table Produit contient au moins 1 produit pour test
 *  -> la table Specs doit contenir 1 data pour pouvoir crer un produit
 *  -> Lorsqu'on cree une nouvelle entree de laptop :
 *    --> on doit aussi creer un specs pour le laptop cree (CRUD)
 *    --> l'association doit etre fait dans la table Produit-Categorie
 */

// command to start server : npx tsx server.ts

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ==================================
// fonction GET de la table categorie
// ==================================

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
