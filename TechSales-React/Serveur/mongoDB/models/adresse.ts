import { ObjectId } from "mongodb";

export interface Adresse {
    _id?: ObjectId;
    noCivic: number;
    rue: string;
    ville: string;
    province: string;
    pays: string;
    codePostale: string;
}