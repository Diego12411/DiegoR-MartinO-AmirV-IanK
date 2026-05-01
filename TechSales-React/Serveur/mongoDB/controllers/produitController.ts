/////////////// Ian Kim ///////////////

import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit.js";

/*
CREER - Création du produit avec un objet Produit (voir ScriptsAjoutProduits/Script_CreerProduits_NoSql.txt)
*/
export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit,
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
  collection: Collection<Produit>,
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

///////////////////////////////////////

/**
 * READ -- Permet de recuperer 4 produits selectionnes au hasard
 * @param collection fait reference a "TechSales.produits"
 */
export async function get4ProduitsHasard(
  collection: Collection<Produit>,
): Promise<Produit[] | null> {
  return await collection
    .aggregate<Produit>([{ $sample: { size: 4 } }])
    .toArray();
}
