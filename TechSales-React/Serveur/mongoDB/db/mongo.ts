import { Collection, Db, MongoClient } from "mongodb";
// exemple de import pour tous les models
//import { Student } from "../models/produit.ts";
import { Produit } from "../models/produit.js";

let mongoClient: MongoClient;

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

export function getTechSalesDb(): Db {
  return mongoClient.db("techsales");
}

export function getProduits(): Collection<Produit> {
  return getTechSalesDb().collection("produits");
}