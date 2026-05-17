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
import { authenticateToken } from "../middleware/jwtToken.js";

/**
 * =========================================================================================
 * ROUTEUR PANIER - GESTION DU PANIER UTILISATEUR (API PROTÉGÉE JWT)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Ce fichier gère toutes les routes liées au panier utilisateur.
 * Il permet d’ajouter, retirer, modifier des articles et vider le panier.
 * Toutes les routes sont protégées par un middleware JWT (authenticateToken).
 *
 * Fonctionnement :
 * - Chaque requête récupère l’utilisateur via le token JWT (req.user)
 * - Les opérations sont effectuées sur la collection utilisateurs MongoDB
 * - Le panier est manipulé comme un tableau d’items (ItemPanier)
 *
 * Sécurité :
 * - Toutes les routes sont protégées par authenticateToken
 * - Impossible d’accéder ou modifier un panier sans authentification
 * - Validation des ObjectId pour éviter les injections invalides
 *
 * Routes principales :
 * - GET /panierUtilisateur : récupère le panier de l’utilisateur connecté
 * - PATCH /ajoutItem : ajoute un produit au panier
 * - DELETE /retirerItem/:itemId : supprime un item du panier
 * - PATCH /modifierQuantite/:itemId : modifie la quantité d’un item
 * - PUT /viderPanier : vide entièrement le panier utilisateur
 *
 * Auteur : Martin
 * =========================================================================================
 */

const router = Router();
// On force toutes les routes a utiliser Middleware/authenticateToken()
// Donc, on n'a plus a le declarer dans chaque route
router.use(authenticateToken);

/**
 * Test d'un endpoint avec le serveur
 */
router.get("/testTest", async (req: Request, res: Response) => {
  res.send("Endpoint test reussi!!");
});

/**
 * GET -- retourne le panier d'un utilisateur specifique
 */
router.get("/panierUtilisateur", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs();
    const utilisateur = new ObjectId(req.user?._id); // on passe par le middleware de jwt
    const panier = await demandePanierUtilisateur(collection, utilisateur);

    if (!panier) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    res.status(200).json(panier);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] GET /panierUtilisateur ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * PATCH -- ajout d'un item dans le panier d'un utilisateur
 * @param ItemPanier a ajouter est passe par req.body
 */
router.patch("/ajoutItem", async (req: Request, res: Response) => {
  try {
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
    const utilisateur = new ObjectId(req.user?._id); // Middleware/authenticateToken(), jwt
    const item: ItemPanier = {
      produitId: new ObjectId(produitId),
      quantite: quantite,
    };

    const result = await ajoutItemPanier(collection, utilisateur, item);

    res.status(200).json(result);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PUT /ajoutItem ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * DELETE -- retirer un element du array item d'un panier d'un utilisateur
 * @param itemId est passe par req.params
 */
router.delete("/retirerItem/:itemId", async (req: Request, res: Response) => {
  try {
    if (!ObjectId.isValid(req.params.itemId as string)) {
      res.status(400).json({ message: "identifiant du produit non valide" });
      return;
    }

    const collection = getUtilisateurs();
    const utilisateur = new ObjectId(req.user?._id);

    const itemId = new ObjectId(req.params.itemId as string);

    const itemExiste = await verifierExistenceItem(
      collection,
      utilisateur,
      itemId,
    );

    if (!itemExiste) {
      res.status(404).json({
        message: "le produit à effacer ne se retrouve pas dans le panier",
      });
      return;
    }

    const result = await retraitItemPanier(collection, utilisateur, itemId);

    res.status(200).json(result);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] DELETE /retirerItem/:itemId ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * PATCH -- modifier la quantite d'un item du panier de l'utilisateur
 * itemId est passe par req.params
 * nouvelleQuantite est passe par req.body
 */
router.patch(
  "/modifierQuantite/:itemId",
  async (req: Request, res: Response) => {
    try {
      if (!ObjectId.isValid(req.params.itemId as string)) {
        res.status(400).json({ message: "Identifiant produit non valide" });
        return;
      }

      const { nouvelleQuantite } = req.body;

      if (isNaN(nouvelleQuantite) || nouvelleQuantite < 1) {
        res.status(400).json({ message: "quantite invalide" });
        return;
      }

      const collection = getUtilisateurs();
      const utilisateur = new ObjectId(req.user?._id);
      const item = new ObjectId(req.params.itemId as string);

      const itemExiste = await verifierExistenceItem(
        collection,
        utilisateur,
        item,
      );
      if (!itemExiste) {
        res.status(404).json({ message: "l'item  n'existe pas" });
        return;
      }

      const result = await miseAJourQuantiteItem(
        collection,
        utilisateur,
        item,
        nouvelleQuantite,
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] PATCH /modifierQuantite/:itemId ->`,
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
router.put("/viderPanier", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs();
    const utilisateur = new ObjectId(req.user?._id);

    const result = await viderPanier(collection, utilisateur);

    res.status(200).json(result);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PUT /viderPanier ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
