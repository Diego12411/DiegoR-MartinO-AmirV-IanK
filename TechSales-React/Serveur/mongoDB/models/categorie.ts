import { ObjectId } from "mongodb";

// Inclus dans l'objet Produit
export interface Categorie {
  _id?: ObjectId;
  nom_categorie: string;
}
