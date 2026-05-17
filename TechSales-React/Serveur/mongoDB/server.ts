import express from "express";
import panierRouter from "./routes/panierRouter.js";
import utilisateurRouter from "./routes/utilisateurRouter.js";
import commandeRouter from "./routes/commandeRouter.js";
import cors from "cors";
import produitRouter from "./routes/produitRouter.js";
import stripeRouter from "./routes/stripeRouter.js";
import { config } from "dotenv";
import { connectToMongo } from "./db/mongo.js";
import cookieParser from "cookie-parser";

/**
 * =========================================================================================
 * INITIALISATION DU SERVEUR EXPRESS + CONNEXION MONGODB
 * -----------------------------------------------------------------------------------------
 * Description :
 * Ce fichier est le point d’entrée principal du backend.
 * Il configure le serveur Express, connecte MongoDB, applique les middlewares globaux
 * et enregistre toutes les routes de l’application.
 *
 * Fonctionnement global :
 * - Chargement des variables d’environnement (.env)
 * - Connexion à MongoDB avant de démarrer le serveur
 * - Initialisation d’Express
 * - Configuration des middlewares (CORS, JSON, cookies)
 * - Enregistrement des routes principales
 * - Démarrage du serveur HTTP
 *
 * Sécurité & configuration :
 * - Vérifie la présence de MONGODB_URI avant connexion
 * - Active CORS uniquement pour le frontend autorisé (localhost:5173)
 * - Active credentials pour permettre cookies JWT
 * - Utilise cookie-parser pour gérer les cookies HttpOnly
 *
 * Routes enregistrées :
 * - /paniers → gestion du panier utilisateur
 * - /utilisateurs → gestion des comptes utilisateurs
 * - /commandes → gestion des commandes
 * - /produits → gestion des produits
 * - /session-caisse → intégration Stripe Checkout
 *
 * Démarrage serveur :
 * - PORT défini via .env ou fallback sur 4000
 * - Affiche une confirmation dans la console au lancement
 *
 * Auteur : Diego, Ian, Martin, Amir
 * =========================================================================================
 */

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

await connectToMongo(uri);

// Initialisation de l'application Express
const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Remplacez par l'URL de votre frontend
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Ajouter les routes dans cette section ci-dessous
app.use("/paniers", panierRouter);
app.use("/utilisateurs", utilisateurRouter);
app.use("/commandes", commandeRouter);
app.use("/produits", produitRouter);
app.use("/session-caisse", stripeRouter);

// Avant : app.listen(process.env.PORT);
// Listen sur le port défini dans le fichier .env ou 4000 par défaut, et affiche un message de confirmation dans la console une fois que le serveur est démarré.
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
