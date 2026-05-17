import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { authenticateToken } from "../middleware/jwtToken.js";

const router = Router();

/**
 * =========================================================================================
 * CRÉATION D'UNE SESSION DE PAIEMENT STRIPE POUR VALIDATION DE COMMANDE
 * -----------------------------------------------------------------------------------------
 * Description :
 * Crée une session de paiement Stripe Checkout à partir des produits envoyés par le frontend.
 * Chaque produit est transformé en "line_item" compatible avec Stripe, puis une session
 * de paiement est générée et renvoyée au client sous forme d’URL.
 *
 * Fonctionnement global :
 * - Reçoit un panier de produits depuis le frontend
 * - Vérifie que le panier n’est pas vide
 * - Transforme les produits au format requis par Stripe
 * - Crée une session de paiement Stripe Checkout
 * - Retourne l’URL de paiement au frontend
 *
 * Vérifications :
 * - Vérifie que le panier contient au moins un produit
 * - Vérifie implicitement que les champs produits sont bien présents (nom, prix, quantité)
 *
 * Sécurité :
 * - La route est protégée par un middleware JWT (authenticateToken)
 * - Seuls les utilisateurs authentifiés peuvent créer une session de paiement
 * - Les prix et données produits sont fournis par le backend côté logique Stripe (non manipulés côté client après validation)
 *
 * Intégration Stripe :
 * - Utilise Stripe Checkout en mode "payment"
 * - Convertit les prix en centimes (exigence Stripe)
 * - Applique un taux de taxe défini dans Stripe Dashboard
 * - Définit des URLs de redirection en cas de succès ou d’annulation
 *
 * Réponse :
 * - Succès : retourne { url: session.url } permettant de rediriger vers Stripe Checkout
 * - Échec client : retourne 400 si panier vide
 * - Échec serveur : retourne 500 en cas d’erreur Stripe ou serveur
 *
 * Route :
 * POST /
 *
 * Middleware :
 * - authenticateToken : vérifie l’authentification de l’utilisateur via JWT
 *
 * Auteur : Diego, Martin
 * =========================================================================================
 */

router.post("/", authenticateToken, async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET!); //ne garanti pas qu'il existe
    // 1. récupérer les données envoyées par le frontend
    const { produits } = req.body as {
      produits: {
        _id: string;
        nom: string;
        prix: number;
        quantite: number;
        image: string;
      }[];
    }; //On extrait produits de req.body et on lui spécifie un type (si l'on ne spécifie pas produit, TypeScript voyait produits comme any type alors erreur avec produit dans le map)

    // 2. vérifier les données
    if (!produits || produits.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    // 3. transformer en format Stripe
    const line_items = produits.map((produit) => ({
      //pour chaque produit dans le tableau produits, les infos sont assignés à produit à chaques fois
      //valeurs que stripe demande
      //ce que stripe va afficher comme info sur le produit
      tax_rates: ["txr_1TUtiM2K6lYYB09CWzmZTktm"], //taux de taxe crée à partir du dashboard Stripe ajouté ici (15%)
      price_data: {
        currency: "cad", //argent canadien
        product_data: {
          name: produit.nom,
          images: produit.image ? [produit.image] : [],
        },
        unit_amount: Math.round(produit.prix * 100), //*100 car stripe marche en centimes
      },
      quantity: produit.quantite, //Stripe multiplie automatiquement unit_amount par quantity
    }));

    // 4. créer la session Stripe
    // ajout de session_id, offert par stripe pour valider la session en cours apres le paiement (lorque reussi)
    const session = await stripe.checkout.sessions.create({
      //crée une session qui pourra être accédée après que le backend recoit la requête. bouton Passer Commande → Fetch → Serveur.ts → stripeRouter /session-caisse
      mode: "payment",
      line_items,
      success_url:
        "http://127.0.0.1:5173/commande?session_id={CHECKOUT_SESSION_ID}", //si le paiement marche, on envoi l'utilisateur vers ce url
      cancel_url: "http://127.0.0.1:5173/panier", //si l'utilisateur revient en arrière, on l'amène vers ce url
    });
    // 5. renvoyer l’URL au frontend
    res.json({ url: session.url });
  } catch (error) {
    // 6. gérer les erreurs
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
