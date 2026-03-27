import { Collection, ObjectId } from "mongodb";
import { Produit } from "../models/produit.js";

export async function createProduit(
  collection: Collection<Produit>,
  produit: Produit
) {
  await collection.insertOne(produit);
}

//---- Exemple creer (executer dans server.ts) ----
/*await createProduit(produits, {
  nom: "ASUS ROG Strix G16",
  description: "Laptop gaming haute performance avec RTX 4060",
  prix: 1499.99,
  stock: 10,
  image_url: "https://dlcdnwebimgs.asus.com/gain/3C38EBCB-420C-438B-B02F-072F4A9E47DB",
  categorie: { nom_categorie: "Ordinateur" },
  specification: {
    type_produit: "Laptop",
    processeur: "Intel Core i7-13700H",
    frequence_processeur: 5,
    type_ram: "DDR5",
    taille_ram: 16,
    type_stockage: "SSD",
    taille_stockage: 512,
    carte_graphqiue: "NVIDIA RTX 4060"
  }
});*/

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
  updates: Partial<Produit>
) {
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );
}
