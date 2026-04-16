import express from "express";
import panierRouter from "./routes/panierRouter.js";
import utilisateurRouter from "./routes/utilisateurRouter.js";
import { config } from "dotenv";
import { connectToMongo } from "./db/mongo.js";
import cors from "cors";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

await connectToMongo(uri);

// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cors());
//cors

// Ajouter les routes dans cette section ci-dessous
app.use("/paniers", panierRouter);
app.use("/utilisateurs", utilisateurRouter);

// listener
app.listen(process.env.PORT);

/**
 * Pour tester vos endpoints :
 * -> Ajoutez vos routes comme a la ligne #26
 * -> Demarrez le serveur avec commande : npm run dev
 * -> Pour acceder a vos endpoints (voici un exemple avec la collection panier) : http://localhost:4000/paniers/testTest
 *  -> le port c'est 4000, definie dans vos fichier .env
 *  -> chemin "/paniers" est defini dans server.ts a la ligne #20
 *  -> endpoint "/testTest" est definie dans le fichier routes/panierRouter.ts
 */
