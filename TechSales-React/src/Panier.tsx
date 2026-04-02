import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Produit {
  nom: string;
  prix: number;
  quantite: number;
  image: string;
  _id: string;
}

export function AfficherProduit({ produit }: { produit: Produit }) {
  return (
    <div className="card shadow-lg m-3 mx-5 p-3">
      <div className="px-3 col bg-white p-1 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-start gap-3">
          img src={produit.image} {produit.nom}
        </div>
        <div className="d-flex align-items-center gap-3">{produit.prix}</div>
        <div className="d-flex align-items-end gap-3">{produit.quantite}</div>
      </div>
    </div>
  );
}

export default function afficherPanier() {
  const [panier, setPanier] = useState<Produit[]>([]);
  useEffect(() => {
    // fetch ici
  }, []);
  return (
    <main className="container-fluid p-0">
      <HeaderComponent />
      <div className="my-3 text-start mx-5 p-1">
        <strong>Panier</strong>
      </div>
      <div className="row px-5">
        <div className="card shadow-lg me-5 p-3">
          <div className="px-3 col bg-white p-1 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-start gap-3">Produits</div>
            <div className="d-flex align-items-center gap-3">Prix</div>
            <div className="d-flex align-items-end gap-3">Quantité</div>
            <div className="d-flex align-items-end gap-3">Sous-Total</div>
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
            Retourner sur le Magasin
          </button>
        </div>
        <div className="col-6 p-2 d-flex justify-content-end">
          {" "}
          <button className="p-3 mx-5 w-50 btn btn-outline-dark">
            Passer la commande
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
              <div className="d-flex align-items-end">Gratuit</div>
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
              <div className="d-flex align-items-end">sous-total*taxes</div>
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
              <div className="d-flex align-items-end">
                sous-total + taxes + livraison
              </div>
            </div>
            <div className="col bg-white d-flex justify-content-center">
              <button className="p-3 my-5 btn btn-outline-dark">
                Procéder au Paiement
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
