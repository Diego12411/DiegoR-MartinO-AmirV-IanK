import { Router, Request, Response } from "express";
import {
  creationCommande,
  obtenirCommandesParUtilisateur,
  obtenirToutesCommandes,
  mettreAJourStatut,
  supprimerCommande,
} from "../controllers/commandeController.js";
import { ObjectId } from "mongodb";
import {
  getCommandes,
  getPaniers,
  getProduits,
  getUtilisateurs,
} from "../db/mongo.js";

/**
 * Routes qui relie le frontend avec le commandeController
 * @author Martin
 */

const router = Router();

/**
 * Endpoint de test pour s'assurer de la connexion est etablie a travers le server.ts
 */
router.get("/test", async (req, res) => {
  res.send("Endpoint test de TechSales.commande reussi!");
});

/**
 * POST -- Creation d'une nouvelle commande a partir du panier de l'utilisateur
 */
router.post("/creerCommande/:utilisateurId", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.utilisateurId)) {
      res.status(400).json({ message: "Identifiant utilisateur non valide" });
      return;
    }

    // Utilisation des collections necessaires pour appeler creationCommande
    const collectionCommande = getCommandes();
    const collectionUtilisateur = getUtilisateurs();
    const collectionProduit = getProduits();

    const utilisateur = new ObjectId(req.params.utilisateurId);

    // TODO: relier a la collection utilisateur approprie qui contient {panier: ItemAchat[]}
    const resultat = await creationCommande(
      collectionCommande,
      collectionUtilisateur,
      collectionProduit,
      utilisateur,
    );

    res.status(201).json(resultat);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /crrerCommande/:utilisateurId ->`,
      (error as Error).message,
    );

    res.status(500).json({ message: "Erreur avec la base de donnees" });
  }
});

// GET -- Obtenir toutes les commandes passees
router.get("/obtenirToutesLesCommandes", async (req, res) => {
  try {
    const collection = getCommandes();

    const commandes = await obtenirToutesCommandes(collection);

    res.status(200).json(commandes);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] GET /obtenirToutesLesCommandes -> `,
      (error as Error).message,
    );

    res.status(500).json({ message: "Erreur avec la base de donnees" });
  }
});

export default router;
