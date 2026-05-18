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
  courriel: string,
  utilisateur: Utilisateur, //req de express qui contient quoi modif
) {
  await collection.updateOne({ courriel }, { $set: utilisateur });
}

export async function deleteUtilisateur(
  collection: Collection<Utilisateur>,
  courriel: string,
) {
  return await collection.deleteOne({ courriel });
}

export async function getAllUtilisateurs(collection: Collection<Utilisateur>) {
  return await collection.find({}).toArray();
}

export async function verifierExistenceUtilisateur(
  collection: Collection<Utilisateur>,
  courriel: string,
) {
  return await collection.findOne({ courriel });
}

/**
 * =========================================================================================
 * RECHERCHE UTILISATEUR PAR COURRIEL
 * -----------------------------------------------------------------------------------------
 * Description :
 * Recherche et retourne un utilisateur dans la collection MongoDB à partir de son
 * adresse courriel.
 *
 * Paramètres :
 * - collection : Collection MongoDB contenant les utilisateurs
 * - courriel   : Adresse courriel à rechercher
 *
 * Retour :
 * - Utilisateur correspondant si trouvé
 * - null si aucun utilisateur ne correspond au courriel fourni
 *
 * Remarque :
 * Cette fonction doit être utilisée avec des données validées afin d'éviter les
 * injections NoSQL.
 *
 * Auteur : Amir
 * =========================================================================================
 */
export async function getUtilisateurParCourriel(
  collection: Collection<Utilisateur>,
  courriel: string,
  // retourne un utilisateur ou null si aucun utilisateur avec ce courriel n'est trouvé
): Promise<Utilisateur | null> {
  return await collection.findOne({ courriel: courriel });
}

/**
 * =========================================================================================
 * RECHERCHER UN UTILISATEUR PAR SON IDENTIFIANT
 * -----------------------------------------------------------------------------------------
 * Description :
 * Recherche un utilisateur dans la collection MongoDB à partir de son identifiant.
 *
 * Utilisation :
 * - Utilisé dans le middleware JWT pour retrouver l'utilisateur connecté
 *
 * Paramètres :
 * - collection : collection MongoDB des utilisateurs
 * - id : identifiant MongoDB (string)
 *
 * Retour :
 * - utilisateur trouvé
 * - null si aucun utilisateur ne correspond
 *
 * Auteur : Amir
 * =========================================================================================
 */
export async function getUtilisateurParId(
  collection: Collection<Utilisateur>,
  id: string,
): Promise<Utilisateur | null> {
  try {
    // Convertir l'id string en ObjectId MongoDB
    const objectId = new ObjectId(id);

    // Rechercher l'utilisateur dans la collection
    return await collection.findOne({ _id: objectId });
  } catch (error) {
    // Si l'id n'est pas valide ou erreur MongoDB
    console.error(
      `[${new Date().toISOString()}] getUtilisateurParId ->`,
      (error as Error).message,
    );

    return null;
  }
}
