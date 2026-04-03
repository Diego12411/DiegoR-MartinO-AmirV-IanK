import { ObjectId } from "mongodb";

export interface ItemPanier {
  _id?: ObjectId;
  produitId: ObjectId;
  quantite: number;
  prix: number;
}
