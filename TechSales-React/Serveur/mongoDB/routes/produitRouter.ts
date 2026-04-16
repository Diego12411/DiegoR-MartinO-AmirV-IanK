import { Router } from "express";
import {createProduit, getProduitById, getAllProduits, updateProduit, deleteProduitById} from "../controllers/produitController.js";
import { getProduits } from "../db/mongo.js";
import { Produit } from "../models/produit.js";

const router = Router();

/* 
POST - Créer un produit à l'aide d'un raw JSON 
(voir ScriptsAjoutProduits/Script_CreerProduits_NoSql.txt)
*/
router.post("/create", async (req, res) => {
  try {
    const produit: Produit = req.body;
    await createProduit(getProduits(), produit);
    return res.status(201).json({message: "Produit crée"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Erreur"});
  }
});

/* 
GET - Afficher un produit existant à l'aide de son id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await getProduitById(getProduits(), id);
    if (!produit) {
      return res.status(404).json({message: "Produit introuvable"});
    }
    return res.status(200).json(produit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Erreur"});
  }
});

/*
GET - Afficher tous les produits
*/
router.get("/", async (req, res) => {
  try {
    const produits = await getAllProduits(getProduits());
    return res.status(200).json(produits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/*
PUT - Mettre à jour un produit existant à l'aide de son id en ajoutant un raw JSON
Exemple:
{
  "prix": 1699.99,
  "stock": 10
}
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await updateProduit(getProduits(), id, updates);
    return res.status(200).json({message: "Produit mis à jour"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Erreur"});
  }
});

/*
DELETE - Supprimer un produit existant à l'aide de son id
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduitById(getProduits(), id);
    return res.status(200).json({message: "Produit supprimé"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Erreur"});
  }
});

export default router;