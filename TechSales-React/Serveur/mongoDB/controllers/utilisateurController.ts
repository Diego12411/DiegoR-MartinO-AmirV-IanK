import { Collection, ObjectId } from "mongodb";
import { Utilisateur } from "../models/utilisateur.js";

export async function createUtilisateur(
    collection: Collection<Utilisateur>, //collection Utilisateur dans la BD
    utilisateur: Utilisateur, //Interface ou model de utilisateur, utilisateur contient le req de express/react
) {
    await collection.insertOne(utilisateur);
}

export async function updateUtilisateur(
    collection: Collection<Utilisateur>,
    id:string,
    updates: Partial<Utilisateur> //req de express qui contient quoi modif
) {
    await collection.updateOne( 
        { _id: new ObjectId(id) }, 
        { $set: updates  }
    )
}

export async function deleteUtilisateur(
    collection: Collection<Utilisateur>,
    id:string,
) {
    await collection.deleteOne({_id: new ObjectId(id)})
}

export async function getAllUtilisateurs(
    collection: Collection<Utilisateur>,
) {
    return await collection.find({}).toArray();
}