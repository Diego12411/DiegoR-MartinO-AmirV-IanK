import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit.js";

export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit
) {
  await collection.insertOne(produit);
}

export async function getProduitById(
  collection: Collection<Produit>,
  id: string,
): Promise<Produit | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function getAllProduits(
  collection: Collection<Produit>
): Promise<Produit[]> {
  return await collection.find().toArray();
}

export async function deleteProduitById(
  collection: Collection<Produit>,
  id: string,
) {
  await collection.deleteOne({ _id: new ObjectId(id) });
}

export async function updateProduit(
  collection: Collection<Produit>,
  id: string,
  updates: Partial<Produit>
) {
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );
}
