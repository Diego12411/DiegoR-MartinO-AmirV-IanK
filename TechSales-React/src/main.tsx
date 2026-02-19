import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import AffichagePrincipalProduit from "./AffichagePrincipalProduit";

const router = createBrowserRouter([
  {
    path: "/affichageprincipalproduit",
    element: <AffichagePrincipalProduit />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
