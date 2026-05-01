import { ObjectId } from "mongodb";
import { ItemPanier } from "../models//itemPanier.js";
import { Adresse } from "../models/adresse.js";

export interface Utilisateur {
  _id?: ObjectId;
  nom: string;
  prenom: string;
  courriel: string;
  motDePasse: string;
  role: string;
  adresse?: Adresse;
  panier: ItemPanier[];
}
