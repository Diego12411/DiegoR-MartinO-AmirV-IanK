import { ObjectId } from "mongodb";

export interface ItemPanier {
  produitId: ObjectId;
  quantite: number;
  prix: number;
}
