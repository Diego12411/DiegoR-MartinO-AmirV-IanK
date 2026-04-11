import { Utilisateur } from "../models/utilisateur.js";

/**
 * =========================================================================================
 * EXTENSION DU TYPE REQUEST D'EXPRESS
 * -----------------------------------------------------------------------------------------
 * Description :
 * Permet d'ajouter la propriété "user" à l'objet Request d'Express.
 *
 * Utilisation :
 * - Ajouté par le middleware JWT après vérification du token
 * - Permet d'accéder à l'utilisateur connecté dans les routes protégées
 *
 * Exemple :
 * req.user
 *
 * Auteur : Amir
 * =========================================================================================
 */
declare global {
  namespace Express {
    interface Request {
      user?: Utilisateur;
    }
  }
}
// On exporte un objet vide pour transformer ce fichier en module et éviter les conflits de types globaux
export {};
