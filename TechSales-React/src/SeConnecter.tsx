import logo from "./assets/logo.png";
import "./SeConnecter.css";
import { Link } from "react-router";
import { useState } from "react";

export default function SeConnecter() {
  // états pour les champs de saisie et les messages d'erreur
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  // fonction de validation des champs de connexion
  function handleConnexion() {
    if (!email || !motDePasse) {
      setMessageErreur("Veuillez remplir tous les champs.");
      return;
    }
    setMessageErreur("");
    console.log("Connexion réussie !");
  }

  return (
    <div className="rectangle" style={{ backgroundColor: "#40365a" }}>
      <main className="container-fluid text-center">
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="seconnecter-input"
                    placeholder="Entrez votre mot de passe"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
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
                {messageErreur && (
                  <p className="text-danger mt-2">{messageErreur}</p>
                )}
                {/* liens pour la création de compte et la récupération du mot de passe */}
                <div className="mt-3 text-start seconnecter-links">
                  <p className="mb-1 " style={{ fontSize: "12px" }}>
                    Pas de compte ?{" "}
                    <Link to="/inscription" className="seconnecter-link">
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
      </main>
    </div>
  );
}
