import { HeaderComponent, FooterComponent } from "./main.tsx";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "./assets/logo.png";
import sansImage from "./assets/ProduitSansImage.png";

type Produit = {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

function BoutonProduit({ produit }: { produit: Produit }) {
  const urlDetails = `/detailsProduit/${produit._id}`;

  return (
    <div className="col mb-4">
      <div className="card shadow border-dark bg-light col p-0">
        <div className="card-body text-dark">
          <img
            className="card-img-top"
            src={produit.image_url || sansImage}
            alt={produit.nom}
          />
          <a
            href={urlDetails}
            className="btn btn-transparent p-0 fw-bold text-primary"
          >
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
  const navigate = useNavigate();
  const [produits, setProduits] = useState<Produit[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduits({
      ...produits,
      [e.target.name]: e.target.value,
    });
  };

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
            <div className="card shadow-lg bg-transparent col p-0">
              <div className="row card-body text-dark">
                <div className="d-flex align-items-center ">
                  <img className="img-fluid" src={logo} alt="Image"></img>
                </div>
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
              <BoutonProduit key={produit._id} produit={produit} />
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
