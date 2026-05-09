import { Router, Request, Response } from "express";
import Stripe from "stripe";

const router = Router();

router.post("/", async (req, res) => {
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
    const session = await stripe.checkout.sessions.create({
      //crée une session qui pourra être accédée après que le backend recoit la requête. bouton Passer Commande → Fetch → Serveur.ts → stripeRouter /session-caisse
      mode: "payment",
      line_items,
      success_url: "http://localhost:3000/commande", //si le paiement marche, on envoi l'utilisateur vers ce url
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
