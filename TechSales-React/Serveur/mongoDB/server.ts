import { config } from "dotenv";
import { connectToMongo, getProduits } from "./db/mongo.js";
import { createProduit, getProduitById, updateProduit, deleteProduitById } from "./controllers/produitController.js";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}
console.log("Connexion a MongoDB reussi!! :)");

await connectToMongo(uri);