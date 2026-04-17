import { Router, Request, Response } from "express";
import {
  creationCommande,
  obtenirCommandesParUtilisateur,
  obtenirToutesCommandes,
  mettreAJourStatut,
  supprimerCommande,
} from "../controllers/commandeController.js";
import { ObjectId } from "mongodb";
import { getCommandes } from "../db/mongo.js";
import { ItemAchat } from "../models/itemAchat.js";

/**
 * Routes qui relie le frontend avec le commandeController
 * @author Martin
 */

const router = Router();

// TODO: Methodes a developper vont venir ici

router.get("/test", async (req, res) => {
  res.send("Endpoint test de TechSales.commande reussi!");
});

export default router;
