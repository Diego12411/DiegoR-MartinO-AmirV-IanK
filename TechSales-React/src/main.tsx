import { StrictMode } from "react";
import logo from "./assets/logo.png";
import { Link } from "react-router";
import user from "./assets/userLogo.png";
import panier from "./assets/cartLogo.png";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

// Importation des pages
import AffichagePrincipalProduit from "./AffichagePrincipalProduit";
import ProduitDetails from "./Produit";
import PageAdmin from "./PageAdmin";
import CreerCompte from "./CreerCompte";
import Compte from "./Compte";
import SeConnecter from "./SeConnecter";
import MotPasseOublie from "./MotPasseOublie";
import Panier from "./Panier";
import Commande from "./Commande";
import AffichagePrincipalProduitBanner from "./AffichagePrincipalProduitBanner";

// Routage des pages
const router = createBrowserRouter([
  { path: "/detailsProduit/:id", element: <ProduitDetails /> },
  { path: "/panier", element: <Panier /> },
  {
    path: "/",
    element: <AffichagePrincipalProduit />,
  },
  { path: "/motPasseOublie", element: <MotPasseOublie /> },
  { path: "/creerCompte", element: <CreerCompte /> },
  { path: "/seConnecter", element: <SeConnecter /> },
  { path: "/PageAdmin", element: <PageAdmin /> },
  { path: "/compte", element: <Compte /> },
  { path: "/commande", element: <Commande /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

export const HeaderComponent = () => {
  return (
    <header
      className="container-fluid text-center px-0 sticky-top"
      style={{
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="row">
        <div
          className="col p-3"
          style={{
            backgroundColor: "#40365a",
          }}
        >
          {" "}
          <p className="text-white mb-0">Livraison Gratuite avec TechSales !</p>
        </div>
      </div>
      <div className="row">
        <div className="px-3 col bg-white p-3 d-flex justify-content-between align-items-center">
          {/* Partie gauche */}
          <div className="d-flex align-items-center gap-3">
            <img src={logo} alt="logo" width={210} height={35} />
            <Link to="/">
              <button
                type="button"
                className="text-black btn btn-link ms-4"
                style={{ fontSize: "13px" }}
              >
                Nos produits
              </button>
            </Link>
            <Link to="/">
              <button
                type="button"
                className="text-black btn btn-link"
                style={{ fontSize: "13px" }}
              >
                À propos de nous
              </button>
            </Link>
            <Link to="/">
              <button
                type="button"
                className="text-black btn btn-link"
                style={{ fontSize: "13px" }}
              >
                Support
              </button>
            </Link>
          </div>

          {/* Partie droite */}
          <div className="d-flex align-items-center gap-4 mx-3">
            <Link to="/Compte">
              <button type="button" className="btn p-0">
                <img src={user} alt="user" width={30} height={30} />
              </button>
            </Link>

            <Link to="/panier">
              <button type="button" className="btn p-0">
                <img src={panier} alt="panier" width={32} height={27} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export const FooterComponent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="row">
      <a
        href="#"
        className="text-white d-flex justify-content-center py-2 btn border-0 shadow-none rounded-0"
        style={{
          backgroundColor: "#594f74",
        }}
        onClick={scrollToTop}
      >
        Retournez en haut de page
      </a>
      <div
        className="col p-3"
        style={{
          backgroundColor: "#40365a",
        }}
      >
        <footer className=" mt-5 py-2">
          <div className="container">
            <h3 className="text-center text-decoration-underline text-white">
              T E C H S A L E S
            </h3>
            <div className="d-flex justify-content-center row row-cols-4 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 g-4 mt-2">
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item fw-bold bg-transparent text-white mb-2">
                    Nos produits
                  </li>
                  <a
                    href="/"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Laptop
                  </a>
                </ul>
              </div>
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item fw-bold bg-transparent text-white mb-2">
                    Compte
                  </li>
                  <a
                    href="SeConnecter"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Se connecter
                  </a>
                  <a
                    href="CreerCompte"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Créer une compte
                  </a>
                  <a
                    href="Panier"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Panier
                  </a>
                </ul>
              </div>
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item fw-bold bg-transparent text-white mb-2">
                    À propos de nous
                  </li>
                  <a
                    href="#"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Localisation
                  </a>
                  <a
                    href="#"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Notre mission
                  </a>
                </ul>
              </div>
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item fw-bold bg-transparent text-white mb-2">
                    Support
                  </li>
                  <a
                    href="#"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Q&A
                  </a>
                  <a
                    href="#"
                    className="list-group-item bg-transparent text-white mb-2"
                  >
                    Nous contacter
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
