import { Router, Request, Response } from "express";
import {
  creationNouveauPanier,
  demandePanierUtilisateur,
  ajoutItemPanier,
  retraitItemPanier,
  miseAJourQuantiteItem,
  viderPanier,
  verifierExistenceItem,
} from "../controllers/panierController.js";
import { getPaniers } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import { ItemPanier } from "../models/itemPanier.js";

/**
 * Routes qui relie le frontend avec le panierController
 * @author Martin
 */

// TODO : Modifier les references a la collection utilisateur qui contient panier: ItemPanier[]

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
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

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
  "/panierUtilisateur/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const collection = getPaniers(); // permet "TechSales.panier"
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
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
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const { produitId, quantite, prix } = req.body;

      if (!produitId || !quantite || !prix) {
        res.status(400).json({ message: "produitId, quantite et prix requis" });
        return;
      }

      if (!ObjectId.isValid(produitId)) {
        res.status(400).json({ message: "produitId invalide" });
        return;
      }

      if (typeof quantite !== "number" || quantite < 1) {
        res.status(400).json({ message: "quantite non valide" });
        return;
      }

      // TODO: verifie le changement apres avoir retire le prix du panier, faire un appel a la methode dans produitController pour acceder au prix du produit

      if (typeof prix !== "number" || quantite <= 0) {
        res.status(400).json({ message: "prix non valide" });
        return;
      }

      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item: ItemPanier = {
        produitId: new ObjectId(produitId),
        quantite: quantite,
        prix: prix,
      };

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
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      if (!ObjectId.isValid(req.params.itemId as string)) {
        res.status(400).json({ message: "identifiant du produit non valide" });
        return;
      }

      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);

      const itemId = new ObjectId(req.params.itemId as string);

      const itemExiste = await verifierExistenceItem(
        collection,
        utilisateur,
        itemId,
      );

      if (!itemExiste) {
        res.status(400).json({
          message: "le produit a efface ne se retrouve pas dans le panier",
        });
        return;
      }

      const result = await retraitItemPanier(collection, utilisateur, itemId);

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
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      if (!ObjectId.isValid(req.params.itemId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const quantite = Number(req.params.nouvelleQuantite);

      if (isNaN(quantite) || quantite < 1) {
        res.status(400).json({ message: "quantite invalide" });
        return;
      }

      const collection = getPaniers();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item = new ObjectId(req.params.itemId as string);

      const itemExiste = await verifierExistenceItem(
        collection,
        utilisateur,
        item,
      );
      if (!itemExiste) {
        res.status(400).json({ message: "l'item n'existe pas" });
        return;
      }

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
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

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
