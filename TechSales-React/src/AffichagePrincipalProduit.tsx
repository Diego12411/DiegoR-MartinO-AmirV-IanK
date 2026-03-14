import { HeaderComponent, FooterComponent } from "./main.tsx";
import { useEffect, useState } from "react";

type Produit = {
  id_produit: number;
  specs_id_specs: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

function BoutonProduit({ produit }: { produit: Produit }) {
  return (
    <div className="col mb-4">
      <div className="card shadow border-dark bg-light col p-0">
        <div className="card-body text-dark">
          <img
            className="card-img-top"
            src={produit.image_url || "../Images/ProduitSansImage.png"}
            alt={produit.nom}
          />
          <a href="#" className="btn btn-transparent p-0 fw-bold text-primary">
            {produit.nom}
          </a>
          <div className="me-2">
            <p className="text-dark card-text">{produit.prix}$</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffichagePrincipalProduit() {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/produits")
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="container-fluid p-0">
      <HeaderComponent />
      <div>
        <div className="m-5 bg-transparent">
          <div className="row">
            <div className="card shadow-lg bg-dark bg-gradient col p-0">
              <div className="row card-body text-dark">
                <div className="col-9">
                  <img
                    className="col-3 img-fluid mt-5"
                    src="../Images/AsusLogo.png"
                    alt="Image"
                  ></img>
                  <h5 className="text-light">Ordinateur portable de jeu</h5>
                  <h1 className="text-light">9999.99$</h1>
                </div>
                <div className="col">
                  <img
                    className="img-fluid"
                    src="../Images/ProduitSansImage.png"
                    alt="Image"
                  ></img>
                </div>
                <a href="#" className="text-light">
                  Magasinez maintenant →
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-8">
              <p className="fw-bold">█ Nos produits</p>
            </div>
            <div className="col d-flex justify-content-end">
              <button className="btn btn-light rounded-circle border border-dark text-dark m-1">
                ←
              </button>
              <button className="btn btn-light rounded-circle tborder border-dark ext-dark m-1">
                →
              </button>
            </div>
            <h3>Explorez nos produits</h3>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
            {produits.map((produit) => (
              <BoutonProduit key={produit.id_produit} produit={produit} />
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
