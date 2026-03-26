import { ObjectId } from "mongodb";

export interface Produit {
  _id?: ObjectId;
  nom: string;
  naissance: Date;
}
