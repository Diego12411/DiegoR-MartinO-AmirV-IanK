import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import SeConnecter from "./SeConnecter";
import MotPasseOublie from "./MotPasseOublie";

// routage des pages de l'application
const router = createBrowserRouter([
  { path: "/seConnecter", element: <SeConnecter /> },
  { path: "/motPasseOublie", element: <MotPasseOublie /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
