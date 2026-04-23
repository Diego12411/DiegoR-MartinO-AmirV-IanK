import { Router } from "express";
import {
  creationCommande,
  obtenirCommandesParUtilisateur,
  obtenirToutesCommandes,
  mettreAJourStatut,
  supprimerCommande,
} from "../controllers/commandeController.js";
import { ObjectId } from "mongodb";
import { getCommandes, getProduits, getUtilisateurs } from "../db/mongo.js";
import { STATUTS, Statut } from "../models/commande.js";

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
    // verification si "utilisateurId" est valide avant de proceder
    if (!ObjectId.isValid(req.params.utilisateurId)) {
      res.status(400).json({ message: "Identifiant utilisateur non valide" });
      return;
    }

    // TODO[]: Utilisation des collections necessaires pour appeler creationCommande
    const collectionCommande = getCommandes();
    const collectionUtilisateur = getUtilisateurs();
    const collectionProduit = getProduits();

    const utilisateur = new ObjectId(req.params.utilisateurId);

    // TODO[]: relier a la collection utilisateur approprie qui contient {panier: ItemAchat[]}
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

// GET -- obtenir les commandes pour un utilisateur specifique
router.get("/commandesPasseesPar/:utilisateurId", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.utilisateurId)) {
      res.status(400).json({ message: "Identifiant utilisateur non valide" });
      return;
    }

    const collection = getCommandes();
    const utilisateur = new ObjectId(req.params.utilisateurId);

    const resultat = await obtenirCommandesParUtilisateur(
      collection,
      utilisateur,
    );

    // retourne un array contenant toutes les commandes de l'utilisateur
    res.status(200).json(resultat);
  } catch (error) {
    console.error(
      `[${new Date().toISOString}] GET /commandesPasseesPar/:id ->`,
      (error as Error).message,
    );

    res.status(500).json({ message: "Erreur avec la base de donnees" });
  }
});

/**
 * GET -- Obtenir toutes les commandes passees
 */
router.get("/obtenirToutesLesCommandes", async (req, res) => {
  try {
    const collection = getCommandes();

    // commmandes represente un tableau contenant toutes les commandes passees
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

/**
 * PATCH -- Met a jour le statut d'une commande specifique
 */
router.patch("/changerStatut/:commandeId/:statut", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.commandeId)) {
      res.status(400).json({ message: "Identifiant utilisateur non valide" });
      return;
    }

    const statutsValide = Object.values(STATUTS);

    if (!statutsValide.includes(req.params.statut as Statut)) {
      res.status(400).json({ message: "Statut non valide" });
    }

    const statut = req.params.statut as Statut;

    const collection = getCommandes();

    const commande = new ObjectId(req.params.commandeId);

    const result = await mettreAJourStatut(collection, commande, statut);

    res.status(200).json({ message: "Statut mis a jour avec succes" });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PATCH /changerStatut/:commandeId/:Statut ->`,
      (error as Error).message,
    );

    res.status(500).json({ message: "Erreur avec la base de donnees" });
  }
});

// DELETE -- Supprimer une commande
router.delete("/supprimerCommande/:commandeId", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.commandeId)) {
      res
        .status(400)
        .json({ message: "Identifiant de la commande non valide" });
      return;
    }

    const collection = getCommandes();

    const commande = new ObjectId(req.params.commandeId);

    const resultat = await supprimerCommande(collection, commande);

    res.status(200).json(resultat);
  } catch (error) {
    console.error(
      `[${new Date()}] DELETE /supprimerCommande/:commandeId ->`,
      (error as Error).message,
    );

    res.status(500).json({ message: "Erreur dans la base de donnees" });
  }
});

export default router;
