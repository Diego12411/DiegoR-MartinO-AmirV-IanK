import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit.js";

export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit,
) {
  await collection.insertOne(produit);
}

export async function getProduitById(
  collection: Collection<Produit>,
  id: string,
): Promise<Produit | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
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
  updates: Partial<Produit>,
) {
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

/**
 * READ -- Permet de recuperer le prix pour un produit specifique
 * @param collection reference a "TechSales.produit"
 * @param produitId le id d'un produit vise
 * @returns le prix du produit
 */
export async function getPrixProduit(
  collection: Collection<Produit>,
  produitId: ObjectId,
): Promise<number | null> {
  const produit = await collection.findOne(
    { _id: produitId },
    { projection: { prix: 1 } },
  );

  return produit?.prix ?? null;
}
