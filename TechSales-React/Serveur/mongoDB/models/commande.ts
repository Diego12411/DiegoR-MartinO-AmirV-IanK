import { ObjectId } from "mongodb";
import { ItemAchat } from "../models/itemAchat.js";

// tous les statuts possible d'une commande
export const STATUTS = {} as const;

// exporte pour permettre le autocomplete ailleurs dans le projet
export type Statut = (typeof STATUTS)[keyof typeof STATUTS];

export interface Commande {
  _id?: ObjectId;
  utilisateurId: ObjectId;
  achat: ItemAchat[];
  statut: Statut;
  dateAchat: Date;
  dateModification: Date;
}
