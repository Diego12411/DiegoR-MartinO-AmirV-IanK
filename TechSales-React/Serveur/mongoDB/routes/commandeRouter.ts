import { Router, Request, Response } from "express";
// import des methodes dans le future fichier commandeController.ts
import { ObjectId } from "mongodb";
import { getCommandes } from "../db/mongo.js";
import { ItemAchat } from "../models/itemAchat.js";

/**
 * Routes qui relie le frontend avec le commandeController
 * @author Martin
 */

const router = Router();

// Methodes a developper vont venir ici

export default router;
