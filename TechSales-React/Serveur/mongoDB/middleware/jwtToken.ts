import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUtilisateurs } from "../db/mongo.js";
import { getUtilisateurParId } from "../controllers/utilisateurController.js";
import { MyTokenPayload } from "../interfaces/interfaces.js";

/**
 * =========================================================================================
 * MIDDLEWARE D'AUTHENTIFICATION JWT AVEC COOKIE HTTPONLY
 * -----------------------------------------------------------------------------------------
 * Description :
 * Vérifie si la requête contient un token JWT valide dans un cookie HttpOnly.
 *
 * Fonctionnement :
 * - Lit le cookie "refresh"
 * - Vérifie que le token est présent
 * - Décode et valide le token avec JWT_SECRET
 * - Récupère l'utilisateur correspondant dans MongoDB
 * - Ajoute l'utilisateur dans req.user
 *
 * Sécurité :
 * - Le cookie HttpOnly n'est pas accessible avec JavaScript
 * - Le token n'est plus stocké dans localStorage
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
    // Récupérer le token JWT dans le cookie HttpOnly
    const token = req.cookies.refresh;

    // Vérifier que le token existe
    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

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
