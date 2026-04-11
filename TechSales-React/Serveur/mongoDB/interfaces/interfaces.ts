import { JwtPayload } from "jsonwebtoken";

/**
 * =========================================================================================
 * INTERFACE DU CONTENU DU TOKEN JWT
 * -----------------------------------------------------------------------------------------
 * Description :
 * Définit la structure des données stockées dans le token JWT.
 *
 * Utilisation :
 * - Permet de typer correctement les données récupérées après vérification du token
 * - Contient l'identifiant de l'utilisateur connecté
 *
 * Auteur :
 * Amir
 * =========================================================================================
 */
export interface MyTokenPayload extends JwtPayload {
  id: string;
}
