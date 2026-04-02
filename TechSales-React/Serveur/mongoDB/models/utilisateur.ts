import { ObjectId } from "mongodb";
import { Adresse } from "./adresse.js";

export interface Utilisateur {
    _id?: ObjectId;
    nom: string;
    prenom: string;
    courriel: string;
    motDePasse: string;
    role: string;
    adresse: Adresse;
}