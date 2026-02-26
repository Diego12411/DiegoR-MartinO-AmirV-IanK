import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import {createBrowserRouter, RouterProvider} from "react-router";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router";
import "./index.css";
import CreerCompte from "./CreerCompte.tsx";
import Compte from "./Compte.tsx";

const router = createBrowserRouter([
  { path: "/", element: <CreerCompte /> },
  { path: "/Compte", element: <Compte /> }
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
