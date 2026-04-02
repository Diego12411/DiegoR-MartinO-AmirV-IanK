import { Collection, Db, MongoClient } from "mongodb";
import { Panier } from "../models/panier.js";

let mongoClient: MongoClient;

// Etablie la connection avec la base de donnees MongoDB
export async function connectToMongo(uri: string) {
  mongoClient = new MongoClient(uri);

  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    throw Error("Connection to MongoDB failed, error: " + error);
  }
}
// Pointe vers la base de donnees "TechSales"
export function getTechSalesDB(): Db {
  return mongoClient.db("TechSales");
}

// Reference la collection "panier"
export function getPaniers(): Collection<Panier> {
  return getTechSalesDB().collection("panier");
}
export function getProduits(): Collection<Produit> {
  return getTechSalesDB().collection("produits");
}
