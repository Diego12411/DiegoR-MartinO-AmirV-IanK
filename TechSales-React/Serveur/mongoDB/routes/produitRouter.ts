import { Router } from "express";
import {
  createProduit,
  getProduitById,
  getAllProduits,
  updateProduit,
  deleteProduitById,
  get4ProduitsHasard,
} from "../controllers/produitController.js";
import { getProduits } from "../db/mongo.js";
import { Produit } from "../models/produit.js";

const router = Router();

/**
 * GET -- Retourne 4 items random parmis ceux disponible dans la base mongodb
 */
router.get("/lireProduitsHasard", async (req, res) => {
  try {
    const produits = await get4ProduitsHasard(getProduits());

    return res.status(200).json(produits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/* 
CREER - Créer un produit à l'aide d'un raw JSON 
(voir ScriptsAjoutProduits/Script_CreerProduits_NoSql.txt)
*/
router.post("/create", async (req, res) => {
  try {
    const produit: Produit = req.body;
    await createProduit(getProduits(), produit);
    return res.status(201).json({ message: "Produit crée" });
  } catch (error) {
    // Erreur de connection
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/* 
LIRE - Afficher un produit existant à l'aide de son id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await getProduitById(getProduits(), id);
    if (!produit) {
      // Si le produit avec cet id n'existe pas, erreur
      return res.status(404).json({ message: "Produit introuvable" });
    }
    return res.status(200).json(produit);
  } catch (error) {
    // Erreur de connection
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/*
LIRE - Afficher tous les produits
*/
router.get("/", async (req, res) => {
  try {
    const produits = await getAllProduits(getProduits());
    return res.status(200).json(produits);
  } catch (error) {
    // Erreur de connection
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/*
MODIFIER - Mettre à jour un produit existant à l'aide de son id en ajoutant un raw JSON
Exemple:
{
  "prix": 1699.99,
  "stock": 10
}
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produitUpdates = req.body;
    await updateProduit(getProduits(), id, produitUpdates);
    if (!produitUpdates) {
      // Si le produit avec cet id n'existe pas, erreur
      return res.status(404).json({ message: "Produit introuvable" });
    }
    return res.status(200).json({ message: "Produit mis à jour" });
  } catch (error) {
    // Erreur de connection
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

/*
SUPPRIMER - Supprimer un produit existant à l'aide de son id
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produit = req.body;
    await deleteProduitById(getProduits(), id);
    if (!produit) {
      // Si le produit avec cet id n'existe pas, erreur
      return res.status(404).json({ message: "Produit introuvable" });
    }
    return res.status(200).json({ message: "Produit supprimé" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur" });
  }
});

////

export default router;
