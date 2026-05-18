import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HeaderComponent, FooterComponent } from "./main";

/**
 * =========================================================================================
 * PAGE COMPTE UTILISATEUR (REACT)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Cette page affiche les informations du profil utilisateur connecté.
 * Elle permet aussi de se déconnecter du compte.
 *
 * Fonctionnement :
 * - Récupère les données du profil depuis le backend
 * - Stocke le profil dans un state React
 * - Affiche les informations utilisateur dans une carte
 * - Gère les erreurs de chargement
 *
 * Authentification :
 * - Requêtes protégées par cookie JWT (credentials: "include")
 * - Appelle le backend pour obtenir le profil utilisateur connecté
 *
 * Données affichées :
 * - ID utilisateur
 * - Nom et prénom
 * - Courriel
 * - Adresse complète (si disponible)
 * - Rôle utilisateur
 *
 * Déconnexion :
 * - Envoie une requête POST vers /utilisateurs/deconnexion
 * - Supprime la session côté backend
 * - Redirige vers la page de connexion
 *
 * Gestion des erreurs :
 * - Erreur si chargement du profil échoue
 * - Message affiché si utilisateur non authentifié ou serveur indisponible
 *
 * Auteur : Amir
 * =========================================================================================
 */

type Adresse = {
  noCivic: number;
  rue: string;
  ville: string;
  province: string;
  pays: string;
  codePostale: string;
};

type Profil = {
  _id: string;
  nom: string;
  prenom: string;
  courriel: string;
  adresse?: Adresse;
  role: string;
};

export default function Compte() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [messageErreur, setMessageErreur] = useState("");
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://127.0.0.1:4000/utilisateurs/deconnexion", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la déconnexion.");
        }

        navigate("/Authentification");
      })
      .catch((err) => {
        console.error(err);
        setMessageErreur("Erreur lors de la déconnexion.");
      });
  }

  useEffect(() => {
    fetch("http://127.0.0.1:4000/utilisateurs/profil", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setMessageErreur(
            data.message || "Erreur lors du chargement du profil.",
          );
          return;
        }

        setProfil(data);
      })
      .catch((err) => {
        console.error(err);
        setMessageErreur("Impossible de joindre le serveur.");
      });
  }, []);

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column">
      <HeaderComponent />

      <main
        className="flex-grow-1 d-flex justify-content-center align-items-center py-5"
        style={{ backgroundColor: "#f5f3fa" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div
                className="card shadow-lg border-0"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4 p-md-5">
                  <h2
                    className="text-center mb-4"
                    style={{ color: "#40365a", fontWeight: "bold" }}
                  >
                    Mon compte
                  </h2>

                  {messageErreur ? (
                    <p className="text-danger text-center">{messageErreur}</p>
                  ) : null}

                  {!profil && !messageErreur ? (
                    <p className="text-center">Chargement du profil...</p>
                  ) : null}

                  {profil ? (
                    <>
                      <div className="mb-3">
                        <p className="mb-2">
                          <strong>ID :</strong> {profil._id}
                        </p>
                        <p className="mb-2">
                          <strong>Nom :</strong> {profil.nom}
                        </p>
                        <p className="mb-2">
                          <strong>Prénom :</strong> {profil.prenom}
                        </p>
                        <p className="mb-2">
                          <strong>Courriel :</strong> {profil.courriel}
                        </p>
                        <p className="mb-2">
                          <strong>Adresse :</strong>{" "}
                          {profil.adresse
                            ? `${profil.adresse.noCivic} ${profil.adresse.rue}, ${profil.adresse.ville}, ${profil.adresse.province}, ${profil.adresse.pays}, ${profil.adresse.codePostale}`
                            : "Aucune adresse"}
                        </p>
                        <p className="mb-0">
                          <strong>Rôle :</strong> {profil.role}
                        </p>
                      </div>

                      <div className="d-grid mt-4">
                        <button
                          className="btn btn-danger"
                          onClick={handleLogout}
                        >
                          Se déconnecter
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
