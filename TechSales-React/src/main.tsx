import { StrictMode } from "react";
import logo from "./assets/logo.png";
import { Link } from "react-router";
import user from "./assets/user.png";
import panier from "./assets/panier.png";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import CreerCompte from "./CreerCompte.tsx";
import Compte from "./Compte.tsx";

const router = createBrowserRouter([
  { path: "/", element: <CreerCompte /> },
  { path: "/Compte", element: <Compte /> },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

export const HeaderPage = () => {
  return (
    <main className="container-fluid text-center px-0">
      <div className="row">
        <div
          className="col p-3"
          style={{
            backgroundColor: "#40365a",
          }}
        ></div>
      </div>
      <div className="row">
        <div className="col bg-white p-4 d-flex justify-content-between align-items-center">
          {/* Partie gauche */}
          <div className="d-flex align-items-center gap-3">
            <img src={logo} alt="logo" width={150} height={25} />
            <Link to="/">
              <button
                type="button"
                className="text-dark fw-bold btn btn-link ms-2"
                style={{ fontSize: "12px" }}
              >
                Affichage Produits
              </button>
            </Link>
          </div>

          {/* Partie droite */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/Compte">
              <button type="button" className="btn p-0">
                <img src={user} alt="user" width={30} height={30} />
              </button>
            </Link>

            <Link to="/">
              <button type="button" className="btn p-0">
                <img src={panier} alt="panier" width={45} height={25} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
