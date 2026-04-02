import { ObjectId } from "mongodb";
import { Categorie } from "./categorie.js";
import { Specification } from "./specification.js";

export interface Produit {
  _id?: ObjectId;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
  categorie: Categorie;
  specification: Specification;
}
