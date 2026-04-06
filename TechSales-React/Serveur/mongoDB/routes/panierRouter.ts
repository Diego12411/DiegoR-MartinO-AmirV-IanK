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
      res.status(500).json({ message: "Database error" });
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

// PATCH -- ajout d'un item dans le panier d'un utilisateur
router.patch(
  "/ajoutItem/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item = req.body;

      if (!item) {
        res.status(400).json({ mesage: "Item non valide" });
        return;
      }

      const result = await ajoutItemPanier(collection, utilisateur, item);
      res.status(200).json(result);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] PUT /ajoutItem/:utilisateurId/:item ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

// DELETE -- retirer un element du array item d'un panier d'un utilisateur
router.delete(
  "/retirerItem/:utilisateurId/:itemId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item = new ObjectId(req.params.itemId as string);

      const result = await retraitItemPanier(collection, utilisateur, item);

      res.status(200).json(result);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] DELETE /retirerItem/:utilisateurId/:itemId ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

// PATCH -- modifier la quantite d'un item du panier de l'utilisateur
router.patch(
  "/modifierQuantite/:utilisateurId/:itemId/:nouvelleQuantite",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item = new ObjectId(req.params.itemId as string);
      const quantite = Number(req.params.nouvelleQuantite);

      const result = await miseAJourQuantiteItem(
        collection,
        utilisateur,
        item,
        quantite,
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] PATCH /modifierQuantite/:utilisateurId/:itemId ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

// PUT -- vider le panier d'un utilisateur
router.put(
  "/viderPanier/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);

      const result = await viderPanier(collection, utilisateur);

      res.status(200).json(result);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] DELETE /viderPanier/:utilisateurId ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

export default router;
