import { Router, Request, Response } from "express";
import {
  updateUtilisateur,
  createUtilisateur,
  deleteUtilisateur,
  getAllUtilisateurs,
  verifierExistenceUtilisateur,
  getUtilisateurParCourriel,
} from "../controllers/utilisateurController.js";
import { getUtilisateurs } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/jwtToken.js";
import bcrypt from "bcrypt";
// à vérifier si on a besoin de cette fonction verifierExistenceItem, sinon on peut la supprimer
import { verifierExistenceItem } from "../controllers/panierController.js";

const router = Router();
//test dun endpoint test
router.get("/test", async (req: Request, res: Response) => {
  res.send("Endpoint test reussis!");
});

router.get("/", async (req: Request, res: Response) => {
  const collection = getUtilisateurs();

  const resultat = await getAllUtilisateurs(collection);
  // deja: res.status(201).json(resultat); 201 c'est pour create, 200 c'est pour get
  res.status(200).json(resultat);
});

/**
 * =========================================================================================
 * CRÉATION D'UN COMPTE UTILISATEUR
 * -----------------------------------------------------------------------------------------
 * Description :
 * Permet de créer un nouveau compte utilisateur dans la collection MongoDB "utilisateurs".
 *
 * Vérifications :
 * - Vérifie si un compte existe déjà avec le même courriel
 * - Hache le mot de passe avec bcrypt avant l'enregistrement
 *
 * Sécurité :
 * - Le mot de passe n'est jamais enregistré en clair dans la base de données
 * - Le mot de passe est remplacé par sa version hachée avant l'insertion
 *
 * Réponse :
 * - Succès : retourne un message de confirmation
 * - Échec : retourne un message si le courriel est déjà utilisé
 * - Erreur : retourne un message d'erreur serveur
 *
 * Route :
 * POST /utilisateurs/creerCompte
 *
 * Auteur : Diego, Amir (ajout de la partie hachage du mot de passe avec bcrypt)
 * =========================================================================================
 */
router.post("/creerCompte", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs(); //params que le controller a besoin pour create utilisateur

    // Récupérer les informations de l'utilisateur envoyées par le frontend
    const utilisateur = req.body;
    const courriel = req.body.courriel as string;

    // Vérifier si un compte existe déjà avec ce courriel
    const verifierCourrielExistant = await verifierExistenceUtilisateur(
      collection,
      courriel,
    );
    if (verifierCourrielExistant !== null) {
      return res
        .status(400)
        .json({ message: "Un Compte est déja associé à ce courriel" });
    }

    // Vérifier que le mot de passe est présent avant de le hacher
    if (!utilisateur.motDePasse) {
      return res.status(400).json({
        message: "Mot de passe requis.",
      });
    }

    // Hacher le mot de passe avant de l'enregistrer dans MongoDB
    const motDePasseHash = await bcrypt.hash(utilisateur.motDePasse, 10);

    // Remplacer le mot de passe en clair par le mot de passe haché
    utilisateur.motDePasse = motDePasseHash;

    // Créer l'utilisateur avec le mot de passe haché
    await createUtilisateur(collection, utilisateur);

    return res.status(201).json({
      message: "Utilisateur créé.",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /creerCompte ->`,
      (error as Error).message,
    );

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

router.put(
  "/changerUtilisateur/:courriel",
  async (req: Request, res: Response) => {
    try {
      const collection = getUtilisateurs(); //on get la collection utilisateur de mongDB
      const courrielUtilisateur = req.params.courriel as string; //on get le courriel de lutilisateur du req de utilisateur a partir de lurl
      const utilisateur = req.body; //get le req de utilisateur donc ce qui est a modif a partir de lurl

      const verifierCourriel = await verifierExistenceUtilisateur(
        collection,
        courrielUtilisateur,
      );

      if (verifierCourriel === null) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      const resultat = await updateUtilisateur(
        collection,
        courrielUtilisateur,
        utilisateur,
      );
      res.status(200).json({ message: "Utilisateur changé" });
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] PUT /changerUtilisateur/:courriel ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
);

router.delete(
  "/retirerUtilisateur/:courriel",
  async (req: Request, res: Response) => {
    try {
      const collection = getUtilisateurs();
      const courrielUtilisateur = req.params.courriel as string;

      const resultat = await deleteUtilisateur(collection, courrielUtilisateur);

      if (resultat.deletedCount === 0) {
        res.status(400).json({ message: "Utilisateur introuvable" });
        return;
      } else {
        res.status(200).json({ message: "Utilisateur supprimé" });
        return;
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] DELETE /retirerUtilisateur/:courriel ->`,
        (error as Error).message,
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
);

/**
 * =========================================================================================
 * AUTHENTIFICATION UTILISATEUR (CONNEXION)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Permet à un utilisateur de se connecter à son compte en validant son courriel
 * et son mot de passe.
 *
 * Vérifications :
 * - Vérifie que le courriel et le mot de passe sont présents
 * - Recherche l'utilisateur dans MongoDB à partir du courriel
 * - Vérifie l'existence de l'utilisateur
 * - Compare le mot de passe entré avec le mot de passe haché dans MongoDB avec bcrypt
 *
 * Sécurité :
 * - Le mot de passe n'est jamais comparé directement en clair
 * - Le mot de passe réel n'est jamais retourné au frontend
 * - Le token JWT est envoyé dans un cookie HttpOnly
 * - Le cookie HttpOnly n'est pas accessible avec JavaScript côté client
 *
 * Réponse :
 * - Succès : crée un cookie HttpOnly contenant le token JWT et retourne le rôle de l'utilisateur
 * - Échec : retourne un message si les champs sont manquants ou invalides
 * - Erreur : retourne un message d'erreur serveur
 *
 * Route :
 * POST /utilisateurs/connexion
 *
 * Auteur :
 * Amir
 * =========================================================================================
 */
router.post("/connexion", async (req: Request, res: Response) => {
  try {
    // Récupérer la collection "utilisateurs"
    const collection = getUtilisateurs();

    // Extraire les informations envoyées par le frontend
    const { courriel, motDePasse } = req.body;

    // Vérifier que les champs requis sont présents
    if (
      typeof courriel !== "string" ||
      typeof motDePasse !== "string" ||
      !courriel.trim() ||
      !motDePasse.trim()
    ) {
      return res.status(400).json({
        message: "Courriel et mot de passe requis.",
      });
    }

    // Rechercher l'utilisateur par son courriel
    const utilisateur = await getUtilisateurParCourriel(collection, courriel);

    // Vérifier si l'utilisateur existe
    if (!utilisateur) {
      return res.status(401).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Comparer le mot de passe entré avec le mot de passe haché dans MongoDB
    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse,
    );

    // Vérifier si le mot de passe est valide
    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Mot de passe incorrect.",
      });
    }

    // Générer un token JWT contenant l'identifiant de l'utilisateur
    const token = jwt.sign(
      { id: utilisateur._id?.toString() },
      process.env.JWT_SECRET as string,
      // Token valide pendant 1 minute pour les tests, à ajuster en production pour 1h ou plus
      { expiresIn: "1m" },
    );

    // Envoyer le token JWT dans un cookie HttpOnly
    res.cookie("refresh", token, {
      httpOnly: true,
      maxAge: 60 * 1000, // 1 minute en millisecondes
      sameSite: "lax",
      secure: false,
    });

    // Retourner seulement les informations nécessaires au frontend
    return res.status(200).json({
      message: "Connexion réussie.",
      role: utilisateur.role,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /utilisateurs/connexion ->`,
      (error as Error).message,
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});

/**
 * =========================================================================================
 * PROFIL UTILISATEUR CONNECTÉ
 * -----------------------------------------------------------------------------------------
 * Description :
 * Retourne les informations du profil de l'utilisateur connecté à partir
 * du token JWT envoyé automatiquement dans un cookie HttpOnly.
 *
 * Sécurité :
 * - Route protégée par le middleware authenticateToken
 * - Le token n'est pas lu depuis le localStorage ni depuis un header manuel
 * - Le mot de passe n'est jamais retourné au frontend
 *
 * Réponse :
 * - Succès : retourne les informations de l'utilisateur sans le mot de passe
 * - Échec : message d'erreur si le token est invalide, expiré ou absent
 *
 * Route :
 * GET /utilisateurs/profil
 *
 * Auteur : Amir
 * =========================================================================================
 */
router.get(
  "/profil",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // Vérifier que l'utilisateur est présent dans la requête
      if (!req.user) {
        return res.status(401).json({
          message: "Utilisateur non authentifié.",
        });
      }

      // Retirer le mot de passe avant d'envoyer la réponse
      const { motDePasse, ...utilisateurSansMotDePasse } = req.user;

      // Retourner le profil utilisateur
      return res.status(200).json(utilisateurSansMotDePasse);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] GET /utilisateurs/profil ->`,
        (error as Error).message,
      );

      return res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  },
);

/**
 * =========================================================================================
 * DÉCONNEXION UTILISATEUR
 * -----------------------------------------------------------------------------------------
 * Description :
 * Déconnecte l'utilisateur en supprimant le cookie HttpOnly contenant le token JWT.
 *
 * Sécurité :
 * - Le cookie "refresh" est supprimé côté navigateur
 * - L'utilisateur devra se reconnecter pour accéder aux routes protégées
 *
 * Réponse :
 * - Succès : message de confirmation
 *
 * Route :
 * POST /utilisateurs/deconnexion
 *
 * Auteur : Amir
 * =========================================================================================
 */
router.post("/deconnexion", async (req: Request, res: Response) => {
  try {
    // Supprimer le cookie HttpOnly contenant le token JWT
    res.clearCookie("refresh", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /utilisateurs/deconnexion ->`,
      (error as Error).message,
    );

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});

export default router;
