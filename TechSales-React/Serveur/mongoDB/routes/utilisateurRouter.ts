import { Router, Request, Response } from "express";
import {
  updateUtilisateur,
  createUtilisateur,
  deleteUtilisateur,
  getAllUtilisateurs,
} from "../controllers/utilisateurController.js";
import { getUtilisateurs } from "../db/mongo.js";
import { ObjectId } from "mongodb";

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

//Amir//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// =========================================================================================
// LOGIN utilisateur (SeConnecter)
// =========================================================================================
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Récupérer la collection MongoDB
    const collection = getUtilisateurs();

    // Récupérer les données envoyées par le frontend
    const { courriel, motDePasse } = req.body;

    // Vérifier si les champs sont remplis
    if (!courriel || !motDePasse) {
      return res.status(400).json({
        message: "Courriel et mot de passe requis.",
      });
    }

    // Chercher l'utilisateur dans MongoDB
    const utilisateur = await collection.findOne({ courriel });

    // Vérifier si utilisateur existe
    if (!utilisateur) {
      return res.status(401).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Vérifier le mot de passe (version simple sans bcrypt)
    if (utilisateur.motDePasse !== motDePasse) {
      return res.status(401).json({
        message: "Mot de passe incorrect.",
      });
    }

    // Ne pas envoyer le mot de passe au frontend
    const { motDePasse: _, ...utilisateurSansMotDePasse } = utilisateur;

    // Réponse
    res.status(200).json({
      message: "Connexion réussie",
      utilisateur: utilisateurSansMotDePasse,
      token: "token-temporaire", // on remplacera plus tard par JWT
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] POST /login ->`,
      (error as Error).message,
    );

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

//Amir//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

export default router;
