import { ObjectId } from "mongodb";
import { ItemPanier } from "../models/itemPanier.js";

export interface Panier {
  _id?: ObjectId;
  userId: ObjectId;
  items: {}[];
}
