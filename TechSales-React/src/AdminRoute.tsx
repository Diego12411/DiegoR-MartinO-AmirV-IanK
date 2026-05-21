import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type AdminRouteProps = {
  children: React.ReactNode;
};

/**
 * =========================================================================================
 * ROUTE PROTÉGÉE POUR LA PAGE ADMINISTRATEUR
 * -----------------------------------------------------------------------------------------
 * Description :
 * Ce composant protège l'accès à la page administrateur côté frontend.
 * Avant d'afficher la page admin, il vérifie si l'utilisateur est connecté
 * et s'il possède le rôle "admin".
 *
 * Fonctionnement :
 * - Appelle la route backend GET /utilisateurs/profil
 * - Envoie automatiquement le cookie HttpOnly avec credentials: "include"
 * - Vérifie si l'utilisateur est authentifié
 * - Vérifie si le rôle de l'utilisateur est "admin"
 *
 * Redirections :
 * - Si aucun utilisateur n'est connecté : redirection vers /seConnecter
 * - Si l'utilisateur est connecté mais n'est pas admin : redirection vers /compte
 * - Si l'utilisateur est admin : affichage de la page protégée
 *
 * Sécurité :
 * - Empêche un utilisateur client d'accéder directement à /PageAdmin
 *   en écrivant l'URL dans le navigateur
 * - La vérification du rôle est faite à partir du profil retourné par le backend
 *
 * Remarque :
 * Cette protection est faite côté frontend. Les routes backend sensibles
 * doivent aussi être protégées côté serveur pour une sécurité complète.
 *
 * Auteur : Amir
 * =========================================================================================
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const [chargement, setChargement] = useState(true);
  const [autorise, setAutorise] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:4000/utilisateurs/profil", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          navigate("/seConnecter");
          return;
        }

        if (data.role?.toLowerCase() !== "admin") {
          navigate("/compte");
          return;
        }

        setAutorise(true);
      })
      .catch((err) => {
        console.error(err);
        navigate("/seConnecter");
      })
      .finally(() => {
        setChargement(false);
      });
  }, [navigate]);

  if (chargement) {
    return <p className="text-center mt-5">Vérification des accès...</p>;
  }

  if (!autorise) {
    return null;
  }

  return <>{children}</>;
}
