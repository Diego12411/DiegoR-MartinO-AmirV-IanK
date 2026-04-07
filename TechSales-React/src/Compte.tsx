import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HeaderComponent, FooterComponent } from "./main";

type Profil = {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  courriel: string;
  adresse: string;
  role: string;
};

export default function Compte() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [messageErreur, setMessageErreur] = useState("");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
    navigate("/SeConnecter");
  }

  useEffect(() => {
    // Récupérer le token JWT depuis le localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setMessageErreur("Aucun utilisateur connecté.");
      return;
    }

    fetch("http://localhost:4000/profil", {
      method: "GET",
      headers: {
        // Inclure le token JWT dans les en-têtes de la requête pour l'authentification
        Authorization: `Bearer ${token}`,
      },
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
                          <strong>ID :</strong> {profil.id_utilisateur}
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
                          <strong>Adresse :</strong> {profil.adresse}
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
