import logo from "./assets/logo.png";
import "./Authentification.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
// FooterComponent et HeaderComponent sont les codes écrits par mes coéquipiers.
// Je les ai importés pour les utiliser dans cette page de connexion, afin de garder une cohérence dans le design et la navigation du site.
import { FooterComponent, HeaderComponent } from "./main";

/**
 * =========================================================================================
 * PAGE D’AUTHENTIFICATION - CONNEXION UTILISATEUR (REACT)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Ce composant permet à un utilisateur de se connecter avec son email et son mot de passe.
 * Il envoie les données au backend et gère la réponse pour connecter l’utilisateur.
 *
 * Fonctionnement :
 * - Stocke l’email et le mot de passe dans des variables d’état
 * - Envoie une requête POST vers l’API de connexion
 * - Vérifie si les champs sont remplis avant l’envoi
 * - Affiche un message d’erreur si la connexion échoue
 *
 * Authentification :
 * - Utilise une requête fetch vers /utilisateurs/connexion
 * - credentials: "include" pour permettre l’utilisation des cookies JWT
 * - Le backend renvoie le rôle de l’utilisateur
 *
 * Redirection :
 * - Si l’utilisateur est admin : redirection vers /PageAdmin
 * - Sinon : redirection vers /Inscription
 *
 * Gestion des erreurs :
 * - Champs vides
 * - Erreur de connexion serveur
 * - Message d’erreur affiché dans l’interface
 *
 * Interface :
 * - Champ email
 * - Champ mot de passe
 * - Bouton de connexion
 * - Liens vers création de compte et mot de passe oublié
 *
 * Auteur : Amir
 * =========================================================================================
 */

export default function SeConnecter() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  const navigate = useNavigate();

  function handleConnexion() {
    if (!email || !motDePasse) {
      setMessageErreur("Veuillez remplir tous les champs.");
      return;
    }

    setMessageErreur("");

    fetch("http://127.0.0.1:4000/utilisateurs/connexion", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courriel: email,
        motDePasse: motDePasse,
      }),
    })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) {
            throw new Error(data.message || "Erreur de connexion.");
          }
          return data;
        });
      })
      .then((data) => {
        if (data.role?.toLowerCase() === "admin") {
          navigate("/PageAdmin");
        } else {
          navigate("/compte");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessageErreur(err.message || "Impossible de joindre le serveur.");
      });
  }

  return (
    <div className="rectangle" style={{ backgroundColor: "#40365a" }}>
      <main className="container-fluid text-center">
        <HeaderComponent />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="row">
            <div className="col-12 my-3 p-5">
              {/* carte de connexion */}
              <div
                className="card shadow-lg p-3 pb-5"
                style={{ backgroundColor: "#f3efef" }}
              >
                {/* logo et le titre de la page */}
                <div className="text-start">
                  <img src={logo} alt="logo" width={200} height={35} />
                  <h2
                    style={{
                      marginTop: "20px",
                      marginLeft: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Se Connecter
                  </h2>
                </div>
                <br />
                {/* champs de saisie pour l'email et le mot de passe */}
                <div className="d-flex flex-column align-items-center gap-4">
                  <input
                    type="email"
                    className="seconnecter-input"
                    placeholder="Entrez votre Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMessageErreur("");
                    }}
                  />
                  <input
                    type="password"
                    className="seconnecter-input"
                    placeholder="Entrez votre mot de passe"
                    value={motDePasse}
                    onChange={(e) => {
                      setMotDePasse(e.target.value);
                      setMessageErreur("");
                    }}
                  />
                </div>
                {/* bouton de connexion et affichage des messages d'erreur */}
                <button
                  type="button"
                  className="seconnecter-btn mt-4"
                  onClick={handleConnexion}
                >
                  Se connecter
                </button>
                {messageErreur ? (
                  <p className="text-danger mt-2 text-start">{messageErreur}</p>
                ) : null}
                {/* liens pour la création de compte et la récupération du mot de passe */}
                <div className="mt-3 text-start seconnecter-links">
                  <p className="mb-1 " style={{ fontSize: "12px" }}>
                    Pas de compte ?{" "}
                    <Link to="/Inscription" className="seconnecter-link">
                      Créer un compte
                    </Link>
                  </p>
                  <Link to="/motPasseOublie" className="seconnecter-link">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </main>
    </div>
  );
}
