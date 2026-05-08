import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import "./Panier.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";

interface Produit {
  nom: string;
  prix: number;
  quantite: number;
  image: string;
  _id: string;
}
export function AfficherProduit({ produit }: { produit: Produit }) {
  return (
    <div className="row px-5 my-3">
      <div className="card shadow-lg me-5 p-3 py-4">
        <div className="px-3 col-12 bg-white p-1 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-start col-4">{produit.nom}</div>
          <div className="d-flex align-items-center col-3">
            {produit.prix} $
          </div>
          <div className="d-flex align-items-end col-4">{produit.quantite}</div>
          <div className="d-flex align-items-end col-1">
            {produit.prix * produit.quantite} $
          </div>
        </div>
      </div>
    </div>
  );
}

export default function afficherPanier() {

  const fairePaiement = async ()=>{
    const stripe = await loadStripe("pk_test_51TUcjm2K6lYYB09CZ0eccEwLkvK9nYSJQ9J4sxqdMsyEhuZyPolnOmH4lOenCxAuRbozOAWBBg1MdNbjkxI9gYVj00GGNXlA0v");
  }

  const navigate = useNavigate();
  const [panier, setPanier] = useState<Produit[]>([
    { _id: "1", nom: "Produit Test", prix: 99.99, quantite: 2, image: "" },
    { _id: "2", nom: "Deuxième Produit", prix: 49.99, quantite: 1, image: "" },
  ]);
  const [messageBouttonAcheter, setMessageBouttonAcheter] = useState("");
  const livraison = 0;
  const sousTotal = panier.reduce(
    (total, produit) => total + produit.prix * produit.quantite,
    0,
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
      <div className="row px-5">
        <div className="card shadow-lg me-5 px-3 py-2">
          <div className="px-3 col-12 bg-white p-1 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-start col-4">Produits</div>
            <div className="d-flex align-items-center col-3">Prix</div>
            <div className="d-flex align-items-end col-4">Quantité</div>
            <div className="d-flex align-items-end col-1">Sous-Total</div>
          </div>
        </div>
      </div>
      {panier.map((produit) => (
        <AfficherProduit key={produit._id} produit={produit} />
      ))}
      <div className="row">
        <div className="col-6 p-2 d-flex justify-content-start">
          {" "}
          <button className="p-3 mx-5 w-50 btn btn-outline-dark">
            Ajouter d'autres produits au panier
          </button>
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
                onClick={() => {
                  verificationAchat();
                }}
              >
                Procéder au Paiement
              </button>
              onClick={fairePaiement}
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
