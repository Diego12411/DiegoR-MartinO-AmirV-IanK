import { Router, Request, Response } from "express";
import {
  creationNouveauPanier,
  demandePanierUtilisateur,
  ajoutItemPanier,
  retraitItemPanier,
  miseAJourQuantiteItem,
  viderPanier,
} from "../controllers/panierController.js";
import { getPaniers } from "../db/mongo.js";
import { Panier } from "../models/panier.js";
import { ObjectId } from "mongodb";

const router = Router();

// Test d'un endpoint avec le serveur
router.get("/testTest", async (req: Request, res: Response) => {
  res.send("Endpoint test reussi!!");
});

// POST -- creation d'un nouveau panier pour un nouvel utilisateur
router.post(
  "/creerPanier/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);

      const resultat = await creationNouveauPanier(collection, utilisateur);

      res.status(201).json(resultat);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] POST /creerPanier/:utilisateurId ->`,
        (error as Error).message,
      );
    }
  },
);

// GET -- retourne le panier d'un utilisateur specifique
router.get(
  "/panierUtilisateur/:userId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers(); // permet "TechSales.panier"
      const utilisateur = new ObjectId(req.params.userId as string);
      const panier = await demandePanierUtilisateur(collection, utilisateur);

      if (!panier) {
        res.status(404).json({ message: "Panier introuvable" });
        return;
      }
      res.status(200).json(panier);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] GET /panierUtilisateur/:userId ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

export default router;
