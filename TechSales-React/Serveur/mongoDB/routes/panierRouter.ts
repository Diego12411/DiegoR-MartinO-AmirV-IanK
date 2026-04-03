import { Router, Request, Response } from "express";
import {
  creationNouveauPanier,
  getCartFromUser,
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

router.get(
  "/panierUtilisateur/:userId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers()
      const user = new ObjectId(req.params.userId as string)
      const panier = 
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
