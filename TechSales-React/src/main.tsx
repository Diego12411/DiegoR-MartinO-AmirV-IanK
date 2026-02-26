import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import AffichagePrincipalProduit from "./AffichagePrincipalProduit";
import ProduitDetails from "./Produit.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  { path: "/detailsProduit", element: <ProduitDetails /> },
  {
    path: "/affichageprincipalproduit",
    element: <AffichagePrincipalProduit />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);


export const FooterComponent = () => {
  return (
    <div className="row">
      <footer className="bg-primary bg-gradient border border-dark mt-5 p-5">
        <div className="container">
          <h3 className="text-left text-decoration-underline text-white">
            T E C H S A L E S
          </h3>
          <div className="d-flex justify-content-center row row-cols-4 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 g-4 mt-2">
            <div className="col">
              <ul className="list-unstyled">
                <li className="list-group-item fw-bold bg-transparent text-white mb-2">
                  Nos produits
                </li>
                <a
                  href="#"
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
                  Créer une compter
                </a>
                <a
                  href="#"
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
  );
};