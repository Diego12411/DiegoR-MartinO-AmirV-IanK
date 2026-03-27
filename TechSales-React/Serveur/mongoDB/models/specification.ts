import { ObjectId } from "mongodb";

export interface Specification {
  _id?: ObjectId;
  type_produit: string;
  processeur: string;
  frequence_processeur: number;
  type_ram: string;
  taille_ram: number;
  type_stockage: string;
  taille_stockage: number;
  carte_graphqiue: string;
}
