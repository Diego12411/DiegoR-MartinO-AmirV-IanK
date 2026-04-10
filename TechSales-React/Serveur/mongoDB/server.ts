import express from "express";
import panierRouter from "./routes/panierRouter.js";
import utilisateurRouter from "./routes/utilisateurRouter.js";
import { config } from "dotenv";
import { connectToMongo, getProduits } from "./db/mongo.js";
import {
  createProduit,
  getProduitById,
  updateProduit,
  deleteProduitById,
} from "./controllers/produitController.js";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

await connectToMongo(uri);
// Tester la connexion apres l'etablissement de la connection
console.log("Connexion à MongoDB réussie !! :)");

const app = express();
app.use(express.json());

// Ajouter les routes dans cette section ci-dessous
app.use("/paniers", panierRouter);
app.use("/utilisateurs", utilisateurRouter);

// Je l'ai changé, car c'est risqué comme avant. Port peut etre undifined.
// Avant : app.listen(process.env.PORT);
// Listen sur le port défini dans le fichier .env ou 4000 par défaut, et affiche un message de confirmation dans la console une fois que le serveur est démarré.
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

/**
 * Pour tester vos endpoints :
 * -> Ajoutez vos routes comme a la ligne #26
 * -> Demarrez le serveur avec commande : npm run dev
 * -> Pour acceder a vos endpoints (voici un exemple avec la collection panier) : http://localhost:4000/paniers/testTest
 *  -> le port c'est 4000, definie dans vos fichier .env
 *  -> chemin "/paniers" est defini dans server.ts a la ligne #26
 *  -> endpoint "/testTest" est definie dans le fichier routes/panierRouter.ts
 */
