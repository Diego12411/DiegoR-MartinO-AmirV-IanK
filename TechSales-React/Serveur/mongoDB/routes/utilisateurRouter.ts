import { Router, Request, Response } from "express";
import {
  updateUtilisateur,
  createUtilisateur,
  deleteUtilisateur,
  getAllUtilisateurs,
} from "../controllers/utilisateurController.js";
import { getUtilisateurs } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/jwtToken.js";

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

router.post("/creerCompte", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs(); //params que le controller a besoin pour create utilisateur
    const utilisateur = req.body; //params que le controller a besoin pour create utilisateur

    const resultat = await createUtilisateur(collection, utilisateur); //stocker le resultat de la function createUtilisateur

    res.status(201).json({
      message: "Utilisateur créé",
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /creerCompte ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/pageAdmin/:id", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs(); //on get la collection utilisateur de mongDB
    const idUtilisateur = req.params.id as string; //on get le id de lutilisateur du req de utilisateur a partir de lurl
    const utilisateur = req.body; //get le req de utilisateur donc ce qui est a modif a partir de lurl

    if (!ObjectId.isValid(idUtilisateur)) {
      //verif que id est valide
      return res.status(400).json({ message: "ID invalide" });
    }

    const resultat = await updateUtilisateur(
      collection,
      idUtilisateur,
      utilisateur,
    );

    res.status(200).json(resultat);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] PUT /pageAdmin ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/pageAdmin/:id", async (req: Request, res: Response) => {
  try {
    const collection = getUtilisateurs();
    const idUtilisateur = req.params.id as string;

    if (!ObjectId.isValid(idUtilisateur)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const resultat = await deleteUtilisateur(collection, idUtilisateur);
    res.status(200).json(resultat);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] DELETE /pageAdmin ->`,
      (error as Error).message,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////
//Amir//////////////////////////////////////////////////////////////////////////////////////

/**
 * =========================================================================================
 * AUTHENTIFICATION UTILISATEUR (LOGIN)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Permet à un utilisateur de se connecter à son compte en validant son courriel
 * et son mot de passe.
 *
 * Vérifications :
 * - Champs requis (courriel, mot de passe)
 * - Existence de l'utilisateur
 * - Correspondance du mot de passe
 *
 * Réponse :
 * - Succès : retourne les informations de l'utilisateur (sans mot de passe)
 *   ainsi qu'un token JWT
 * - Échec : message d'erreur approprié
 *
 * Route :
 * POST /utilisateurs/login
 *
 * Auteur : Amir
 * =========================================================================================
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Récupérer la collection "utilisateurs"
    const collection = getUtilisateurs();

    // Extraire les informations envoyées par le frontend
    const { courriel, motDePasse } = req.body;

    // Vérifier que les champs requis sont présents
    if (!courriel || !motDePasse) {
      return res.status(400).json({
        message: "Courriel et mot de passe requis.",
      });
    }

    // Rechercher l'utilisateur par son courriel
    const utilisateur = await collection.findOne({ courriel });

    // Vérifier si l'utilisateur existe
    if (!utilisateur) {
      return res.status(401).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Vérifier que le mot de passe correspond
    // Version temporaire sans bcrypt
    if (utilisateur.motDePasse !== motDePasse) {
      return res.status(401).json({
        message: "Mot de passe incorrect.",
      });
    }

    // Générer un token JWT contenant l'identifiant de l'utilisateur
    const token = jwt.sign(
      { id: utilisateur._id?.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // Retirer le mot de passe avant d'envoyer la réponse
    const { motDePasse: _, ...utilisateurSansMotDePasse } = utilisateur;

    // Retourner la réponse de succès
    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: utilisateurSansMotDePasse,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /utilisateurs/login ->`,
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
 * du token JWT envoyé dans le header Authorization.
 *
 * Sécurité :
 * - Route protégée par le middleware authenticateToken
 *
 * Réponse :
 * - Succès : retourne les informations de l'utilisateur sans le mot de passe
 * - Échec : message d'erreur si le token est invalide ou absent
 *
 * Route :
 * GET /utilisateurs/profil
 *
 * Auteur :
 * Amir
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

//Amir//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

export default router;
