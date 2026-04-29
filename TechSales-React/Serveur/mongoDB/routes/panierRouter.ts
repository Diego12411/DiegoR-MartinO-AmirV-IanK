import { Router, Request, Response } from "express";
import {
  demandePanierUtilisateur,
  ajoutItemPanier,
  retraitItemPanier,
  miseAJourQuantiteItem,
  viderPanier,
  verifierExistenceItem,
} from "../controllers/panierController.js";
import { getUtilisateurs } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import { ItemPanier } from "../models/itemPanier.js";

/**
 * Routes qui relie le frontend avec le panierController
 * @author Martin
 */

const router = Router();

/**
 * Test d'un endpoint avec le serveur
 */
router.get("/testTest", async (req: Request, res: Response) => {
  res.send("Endpoint test reussi!!");
});

/**
 * GET -- retourne le panier d'un utilisateur specifique
 * @param utilisateurId est envoye par le req.params.utilisateurId
 */
router.get(
  "/panierUtilisateur/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const collection = getUtilisateurs();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const panier = await demandePanierUtilisateur(collection, utilisateur);

      if (!panier) {
        res.status(404).json({ message: "Utilisateur introuvable" });
        return;
      }

      res.status(200).json(panier);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] GET /panierUtilisateur/:utilisateurId ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Database error" });
    }
  },
);

/**
 * PATCH -- ajout d'un item dans le panier d'un utilisateur
 * @param utilisateurId est passer par req.params
 * @param ItemPanier a ajouter est passe par req.body
 */
router.patch(
  "/ajoutItem/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const { produitId, quantite } = req.body;

      if (!produitId || !quantite) {
        res.status(400).json({ message: "produitId et quantite requis" });
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

      const collection = getUtilisateurs();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item: ItemPanier = {
        produitId: new ObjectId(produitId),
        quantite: quantite,
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

/**
 * DELETE -- retirer un element du array item d'un panier d'un utilisateur
 * @param utilisateurId est passe par req.params
 * @param itemId est passe par req.params
 */
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

      const collection = getUtilisateurs();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);

      const itemId = new ObjectId(req.params.itemId as string);

      const itemExiste = await verifierExistenceItem(
        collection,
        utilisateur,
        itemId,
      );

      if (!itemExiste) {
        res.status(404).json({
          message: "le produit a effacer ne se retrouve pas dans le panier",
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

/**
 * PATCH -- modifier la quantite d'un item du panier de l'utilisateur
 * utilisateurId, itemId et nouvelleQuantity sont passes par req.params
 */
router.patch(
  "/modifierQuantite/:utilisateurId/:itemId/:nouvelleQuantite",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      if (!ObjectId.isValid(req.params.itemId as string)) {
        res.status(400).json({ message: "Identifiant produit non valide" });
        return;
      }

      const quantite = Number(req.params.nouvelleQuantite);

      if (isNaN(quantite) || quantite < 1) {
        res.status(400).json({ message: "quantite invalide" });
        return;
      }

      const collection = getUtilisateurs();
      const utilisateur = new ObjectId(req.params.utilisateurId as string);
      const item = new ObjectId(req.params.itemId as string);

      const itemExiste = await verifierExistenceItem(
        collection,
        utilisateur,
        item,
      );
      if (!itemExiste) {
        res.status(404).json({ message: "l'item n'existe pas" });
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

/**
 * PUT -- vider le panier d'un utilisateur
 * @param utilisateurId est passe par req.params
 */
router.put(
  "/viderPanier/:utilisateurId",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.utilisateurId as string)) {
        res.status(400).json({ message: "Identifiant utilisateur non valide" });
        return;
      }

      const collection = getUtilisateurs();
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
