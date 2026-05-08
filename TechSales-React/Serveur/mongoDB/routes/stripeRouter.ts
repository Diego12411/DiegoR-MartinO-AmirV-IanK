import { Router, Request, Response } from "express";

const router = Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/session-caisse", async (req, res) => {
  try {
    // 1. récupérer les données envoyées par le frontend
    const { produits } = req.body;

    // 2. vérifier les données
    if (!produits || produits.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    // 3. transformer en format Stripe
    const line_items = produits.map((produit)=>({ //pour chaque éléments dans le tableau, les infos sont assignés a produit à chaques fois^
        //valeurs que stripe demande
        price_data:{
            currency:"usd",
            product_data:{
                name:produit.nom,
                images:[produit.image]
            },
            unit_amount: Math.round(produit.prix * 100), //*100 car stripe marche en centimes
        },
        quantity:produit.quantite
    }));

    // 4. créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "URL_SUCCESS",
      cancel_url: "URL_CANCEL",
    });

    // 5. renvoyer l’URL au frontend
    res.json({ url: session.url });

  } catch (error) {
    // 6. gérer les erreurs
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;