import { Router } from "express";
import {createProduit, getProduitById, updateProduit, deleteProduitById} from "../controllers/produitController.js";
import { getProduits } from "../db/mongo.js";
import { Produit } from "../models/produit.js";

const router = Router();

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