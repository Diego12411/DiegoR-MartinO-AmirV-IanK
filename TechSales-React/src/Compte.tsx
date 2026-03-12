import { useEffect, useState } from "react";
import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";

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
    <div className="container-fluid text-center">
      <HeaderComponent />
      <h2>Mon compte</h2>

      {messageErreur ? <p className="text-danger">{messageErreur}</p> : null}

      {profil ? (
        <div className="card p-4 mt-3">
          <p>
            <strong>ID :</strong> {profil.id_utilisateur}
          </p>
          <p>
            <strong>Nom :</strong> {profil.nom}
          </p>
          <p>
            <strong>Prénom :</strong> {profil.prenom}
          </p>
          <p>
            <strong>Courriel :</strong> {profil.courriel}
          </p>
          <p>
            <strong>Adresse :</strong> {profil.adresse}
          </p>
          <p>
            <strong>Rôle :</strong> {profil.role}
          </p>
        </div>
      ) : null}
      <FooterComponent />
    </div>
  );
}
