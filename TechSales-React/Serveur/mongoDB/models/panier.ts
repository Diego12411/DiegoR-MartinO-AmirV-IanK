import { ObjectId } from "mongodb";
import { ItemPanier } from "../models/itemPanier.js";

export interface Panier {
  _id?: ObjectId;
  utilisateurId: ObjectId;
  items: ItemPanier[];
  modificationTemps: Date;
}
