/////////////// Ian Kim ///////////////

import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit.js";

/*
CREER - Création du produit avec un objet Produit (voir ScriptsAjoutProduits/Script_CreerProduits_NoSql.txt)
*/
export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit
) {
  await collection.insertOne(produit);
}

/*
LIRE - Afficher un produit avec son id
*/
export async function getProduitById(
  collection: Collection<Produit>,
  id: string,
): Promise<Produit | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

/*
LIRE - Afficher TOUS les produits existants
*/
export async function getAllProduits(
  collection: Collection<Produit>
): Promise<Produit[]> {
  return await collection.find().toArray();
}

/*
SUPPRIMER - Supprimer un produit existant avec son id
*/
export async function deleteProduitById(
  collection: Collection<Produit>,
  id: string,
) {
  await collection.deleteOne({ _id: new ObjectId(id) });
}

/*
MODIFIER - Modifier un produit existant avec son id
*/
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

///////////////////////////////////////