import { ObjectId } from "mongodb";

export interface Categorie {
  _id?: ObjectId;
  nom_categorie: string;
}
