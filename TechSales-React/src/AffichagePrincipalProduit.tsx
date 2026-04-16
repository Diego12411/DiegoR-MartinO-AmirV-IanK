import { HeaderComponent, FooterComponent } from "./main.tsx";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import "./AffichagePrincipalProduit.css";
import logo from "./assets/logo.png";
import sansImage from "./assets/ProduitSansImage.png";

type Produit = {
  _id: string; // Changé en _id (format en react)
  specs_id_specs: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

// Bouton pour l'affichage des produits dans la page avec les détails (nom, prix, image)
function BoutonProduit({ produit }: { produit: Produit }) {
  const urlDetails = `/detailsProduit/${produit._id}`;

  return (
    <div className="col mb-4">
      <div className="card shadow border-dark bg-light p-0">
        <div className="card-body text-dark">
          <img
            className="card-img-top img-produit"
            src={produit.image_url || sansImage}
            alt={produit.nom}
            style={{ width: "210px", height: "210px", objectFit: "cover" }}
          />
          <div style={{ height: 100 }}>
            <div style={{ position: "absolute", bottom: 10 }}>
              <a
                href={urlDetails}
                className="fw-bold text-primary d-block text-truncate"
              >
                {produit.nom}
              </a>
              <div className="me-2">
                <p className="text-dark card-text">{produit.prix}$</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction principale
export default function AffichagePrincipalProduit() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState<Produit[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduits({
      ...produits,
      [e.target.name]: e.target.value,
    });
  };

  // Rouler le 'scrollbar' à gauche
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // Rouler le 'scrollbar' à droite
  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  // Cherche TOUS les produits (voir produitRouter)
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
                  <img className="img-fluid" src={logo} alt="Image"></img>{" "}
                  {/* À changer plus tard */}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-8">
              <p className="fw-bold">█ Nos produits</p>
            </div>
            <div className="col d-flex justify-content-end">
              <button
                className="btn btn-light rounded-circle border border-dark text-dark m-1"
                onClick={scrollLeft}
              >
                ←
              </button>

              <button
                className="btn btn-light rounded-circle border border-dark text-dark m-1"
                onClick={scrollRight}
              >
                →
              </button>
            </div>
            <h3>Explorez nos produits</h3>
          </div>
          {/* Affichage des produits changée dans un 'scrollbar' horizontal */}
          <div
            ref={scrollRef}
            className="d-flex overflow-auto gap-4 mt-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {produits.map((produit) => (
              <div
                style={{ minWidth: "250px", maxWidth: "250px" }}
                key={produit._id}
              >
                <BoutonProduit produit={produit} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
