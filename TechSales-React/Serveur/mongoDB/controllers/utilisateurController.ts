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
  id: string,
  updates: Partial<Utilisateur>, //req de express qui contient quoi modif
) {
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

export async function deleteUtilisateur(
  collection: Collection<Utilisateur>,
  id: string,
) {
  await collection.deleteOne({ _id: new ObjectId(id) });
}

export async function getAllUtilisateurs(collection: Collection<Utilisateur>) {
  return await collection.find({}).toArray();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//Amir//////////////////////////////////////////////////////////////////////////////////////////////

// Cherche un utilisateur par courriel dans la collection
export async function getUtilisateurParCourriel(
  collection: Collection<Utilisateur>,
  courriel: string,
  // retourne un utilisateur ou null si aucun utilisateur avec ce courriel n'est trouvé
): Promise<Utilisateur | null> {
  return await collection.findOne({ courriel: courriel });
}

// Récupère un utilisateur par son identifiant MongoDB
export async function getUtilisateurParId(
  collection: Collection<Utilisateur>,
  id: string,
): Promise<Utilisateur | null> {
  return await collection.findOne({ _id: new ObjectId(id) });
}

//Amir////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
