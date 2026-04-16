import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUtilisateurs } from "../db/mongo.js";
import { getUtilisateurParId } from "../controllers/utilisateurController.js";
import { MyTokenPayload } from "../interfaces/interfaces.js";

/**
 * =========================================================================================
 * MIDDLEWARE D'AUTHENTIFICATION JWT
 * -----------------------------------------------------------------------------------------
 * Description :
 * Vérifie si la requête contient un token JWT valide dans l'en-tête Authorization.
 *
 * Fonctionnement :
 * - Lit le header Authorization
 * - Vérifie que le token est présent
 * - Décode et valide le token avec JWT_SECRET
 * - Récupère l'utilisateur correspondant dans MongoDB
 * - Ajoute l'utilisateur dans req.user
 *
 * Format attendu :
 * Authorization: Bearer <token>
 *
 * Réponse :
 * - Succès : passe au contrôleur
 * - Échec : retourne 401 avec un message d'erreur
 *
 * Auteur : Amir
 * =========================================================================================
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Récupérer l'en-tête Authorization
    const authHeader = req.headers.authorization;

    // Vérifier que le header existe et commence par "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou invalide." });
    }

    // Extraire le token après "Bearer "
    const token = authHeader.split(" ")[1];

    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as MyTokenPayload;

    // Récupérer l'utilisateur à partir de l'identifiant contenu dans le token
    const utilisateur = await getUtilisateurParId(
      getUtilisateurs(),
      decoded.id,
    );

    // Vérifier si l'utilisateur existe encore dans la base de données
    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    // Ajouter l'utilisateur à la requête pour les routes protégées
    req.user = utilisateur;

    // Passer à la suite
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}
