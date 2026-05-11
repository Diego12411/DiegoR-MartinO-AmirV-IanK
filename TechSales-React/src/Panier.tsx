import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import "./Panier.css";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import sansImage from "./assets/ProduitSansImage.png";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

interface Produit {
  nom: string;
  prix: number;
  quantite: number;
  image: string;
  _id: string;
}

function RetirerProduit(produit: Produit) {
  // A travailler
}

export function AfficherProduit({ produit }: { produit: Produit }) {
  return (
    <div className="row px-5 my-3 justify-content-left">
      <div className="card shadow-lg me-5 p-3 py-3">
        <div className="col-12 bg-white p-1 d-flex justify-content-left align-items-center">
          <div className="d-flex justify-content-left align-items-center col-5">
            {/*Image du produit*/}
            <img
              className="card shadow border-dark bg-light me-3"
              src={produit.image || sansImage}
              alt={produit.nom}
              style={{
                minWidth: "50px",
                maxWidth: "50px",
                minHeight: "50px",
                maxHeight: "50px",
                objectFit: "contain",
              }}
            ></img>
            {/*Ramene a la page details du produit associé lorsqu'on clique le nom du produit*/}
            <Link
              to={`../produits/detailsProduit/${produit._id}`}
              className="text-secondary text-decoration-none"
            >
              <div>{produit.nom}</div>
            </Link>
          </div>
          <div className="d-flex justify-content-left align-items-center col-2">
            {produit.prix} $
          </div>
          <div className="d-flex justify-content-left align-items-center col-2">
            {produit.quantite}
          </div>
          <div className="d-flex justify-content-left align-items-center col-2">
            {produit.prix * produit.quantite} $
          </div>
          {/*Bouton retirer le produit du panier*/}
          <button
            className="d-flex justify-content-left align-items-center col-1 btn btn-outline-dark btn-panier"
            style={{ minWidth: "75px", maxWidth: "75px" }}
            onClick={() => RetirerProduit(produit)}
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function afficherPanier() {
  const fairePaiement = async () => {
    //fairePaiement est une constante qui contient une fonction async ou l'on utilise stripe
    const stripe = await loadStripe(
      "pk_test_51TUcjm2K6lYYB09CZ0eccEwLkvK9nYSJQ9J4sxqdMsyEhuZyPolnOmH4lOenCxAuRbozOAWBBg1MdNbjkxI9gYVj00GGNXlA0v",
    ); //contient une instance de Stripe initialisée avec une clée publique
    const response = await fetch("http://localhost:4000/session-caisse", {
      //on fetch vers /session-caisse dans stripeRouter
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produits: panier }), //panier est un tableau qui contient les produits affichés dans le panier
    });

    const session = await response.json(); //contient la réponse du stripeRouter /session-caisse (contient un objet session qui contient l'url)

    window.location.href = session.url; //change l'url du navigateur pour accéder à la page Stripe (checkout)
  };

  const navigate = useNavigate();
  const [panier, setPanier] = useState<Produit[]>([ //panier qui contient les produits qui sont envoyés au backend et Stripe
    {
      _id: "1",
      nom: "Produit Test",
      prix: 99.99,
      quantite: 2,
      image:
        //"https://dlcdnwebimgs.asus.com/gain/3C38EBCB-420C-438B-B02F-072F4A9E47DB",
        "https://cdn.britannica.com/77/170477-050-1C747EE3/Laptop-computer.jpg", //il faut que les produits contiennent des images sinon conflits avec Stripe
    },
    {
      _id: "2",
      nom: "Deuxième Produit",
      prix: 49.99,
      quantite: 4,
      image:
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310",
    },
    {
      _id: "3",
      nom: "Ordinateur",
      prix: 1299.99,
      quantite: 1,
      //image:
        //"https://www.lg.com/content/dam/channel/wcms/ca_en/images/laptops/gram/17z90sp-g-aa75a9/DZ-02.jpg",
      //quantite: 1,
      image:
        "https://cdn.britannica.com/77/170477-050-1C747EE3/Laptop-computer.jpg",
    },
  ]);
  const [messageBouttonAcheter, setMessageBouttonAcheter] = useState("");
  const livraison = 0;
  const sousTotal = panier.reduce(
    (total, produit) => total + produit.prix * produit.quantite,
    0
  );
  const taxes = sousTotal * 0.15;
  const total = taxes + sousTotal + livraison;
  useEffect(() => {
    // fetch ici
  }, []);

  function verificationAchat() {
    if (panier.length === 0) {
      setMessageBouttonAcheter("Aucun produit dans le Panier");
    } else navigate("/Commande");
  }
  return (
    <main className="container-fluid p-0">
      <HeaderComponent />
      <div className="my-3 text-start mx-5 p-1">
        <strong>Panier</strong>
      </div>
      <div className="row px-5 justify-content-left">
        <div className="card shadow-lg me-5 px-3 py-2">
          <div className="col-12 bg-white p-1 d-flex justify-content-left align-items-center">
            <div className="d-flex justify-content-left align-items-center col-5">
              Produits
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Prix
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Quantité
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Sous-Total
            </div>
            <div className="d-flex justify-content-left align-items-center col-1"></div>
          </div>
        </div>
      </div>
      <div
        className="overflow-auto overflow-x-hidden"
        style={{ height: "300px", scrollBehavior: "smooth" }}
      >
        {panier.map((produit) => (
          <div key={produit._id}>
            <AfficherProduit key={produit._id} produit={produit} />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-6 p-2 d-flex justify-content-start">
          {" "}
          <Link to="/">
            <button className="p-3 mx-5 w-50 btn btn-outline-dark">
              Ajouter d'autres produits au panier
            </button>
          </Link>
        </div>
        <div className="col-6 p-2 d-flex justify-content-end">
          {" "}
          <button className="p-3 mx-5 w-50 btn btn-outline-dark btn-panier">
            Vider le Panier
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div
            className="card shadow-lg mx-5 my-5 p-2"
            style={{ border: "1.5px solid black", backgroundColor: "white" }}
          >
            <p
              className="mx-3 my-1 p-1"
              style={{ fontWeight: "500", color: "#212529" }}
            >
              Total du Panier
            </p>
            <div className="px-3 col bg-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Sous-Total</div>
              <div className="d-flex align-items-end">
                {sousTotal.toFixed(2)} $
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "8px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Livraison</div>
              <div className="d-flex align-items-end text-success">Gratuit</div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "0px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Taxes</div>
              <div className="d-flex align-items-end">{taxes.toFixed(2)} $</div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "0px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Total</div>
              <div className="d-flex align-items-end">{total.toFixed(2)} $</div>
            </div>
            <div className="bg-white d-flex justify-content-center">
              <button
                className="p-3 m-2 btn btn-outline-dark w-100"
                onClick={fairePaiement}
              >
                Procéder au Paiement
              </button>
            </div>
            {messageBouttonAcheter && (
              <p className="text-danger text-center">{messageBouttonAcheter}</p>
            )}
          </div>
        </div>
        <div className="col-6 my-5">
          <img
            src={logo}
            alt="user"
            width={650}
            height={110}
            className="my-5"
          ></img>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
