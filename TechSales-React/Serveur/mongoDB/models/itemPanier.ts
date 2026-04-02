import { ObjectId } from "mongodb";

export interface ItemPanier {
  _id?: ObjectId;
  productId: ObjectId;
  quantity: number;
  price: number;
}
