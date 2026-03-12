import { HeaderComponent } from "./main";
import { useState } from "react";

export default function AfficherPageAdmin() {
  const [idDelete, setIdDelete] = useState("");
  const [idUpdate, setIdUpdate] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("");
  const [messageDelete, setMessageDelete] = useState("");
  const [messageUpdate, setMessageUpdate] = useState("");

  function supprimerUtilisateurBouttonClicked() {
    if (!idDelete) {
      setMessageDelete("*Il manque des champs obligatoires*");
      return;
    }
    fetch("http://localhost:4000/utilisateur", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idDelete,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Utilisateur introuvable") {
          setMessageDelete(data.message);
        } else if (data.message === "Utilisateur supprimé") {
          setMessageDelete(data.message);
        }
      })
      .catch((err) => console.error(err));
  }

  function ModifierUtilisateurBouttonClicked() {
    if (!idUpdate) {
      setMessageUpdate("*Il manque des champs obligatoires*");
      return;
    }
    fetch("http://localhost:4000/utilisateur", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_utilisateur: idUpdate,
        nom: nom,
        prenom: prenom,
        mot_de_passe: motDePasse,
        courriel: email,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Utilisateur introuvable") {
          setMessageUpdate(data.message);
        } else if (data.message === "Utilisateur changé") {
          setMessageUpdate(data.message);
        }
      })
      .catch((err) => console.error(err));
  }
  return (
    <main className="container-fluid text-center">
      <HeaderComponent />
      <div className="d-flex justify-content-center align-items-left vh-100">
        <div className="row">
          {/*Formulaire de delete utilisateur*/}
          <div className="col-12 my-3 p-5">
            <div
              className="card shadow-lg p-3"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h3 className="card-title text-white">
                <br />
                Supprimez un Utilisateur :
              </h3>
              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  <input
                    type="number"
                    className="form-control"
                    value={idDelete}
                    placeholder="Id"
                    onChange={(e) => {
                      setIdDelete(e.target.value);
                      setMessageDelete(""); // efface le message automatiquement
                    }}
                  ></input>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      supprimerUtilisateurBouttonClicked();
                    }}
                  >
                    Supprimer l'utilisateur
                  </button>
                  {messageDelete && (
                    <p
                      className={
                        messageDelete === "Utilisateur supprimé"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {messageDelete}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Formulaire de put utilisateur*/}
        <div className="row">
          <div className="col-12 my-3 p-5">
            <div
              className="card shadow-lg p-3"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h3 className="card-title text-white">
                <br />
                Modifier un Utilisateur :
              </h3>
              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  {/*Id*/}
                  <input
                    type="number"
                    className="form-control"
                    value={idUpdate}
                    placeholder="Id"
                    onChange={(e) => {
                      setIdUpdate(e.target.value);
                      setMessageUpdate(""); // efface le message automatiquement
                    }}
                  ></input>
                  <br />
                  {/*Nom*/}
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    placeholder="Nom"
                    onChange={(e) => setNom(e.target.value)}
                  ></input>
                </div>
                <div className="form-group text-start">
                  {/*Prenom*/}
                  <input
                    type="text"
                    className="form-control"
                    value={prenom}
                    placeholder="Prénom"
                    onChange={(e) => setPrenom(e.target.value)}
                  ></input>
                </div>
                <div className="form-group text-start">
                  {/*Email*/}
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="form-group text-start">
                  {/*MotDePasse*/}
                  <input
                    type="password"
                    className="form-control"
                    value={motDePasse}
                    placeholder="Mot de passe"
                    onChange={(e) => setMotDePasse(e.target.value)}
                  ></input>
                  <div className="form-group text-start">
                    {/*Role*/}
                    <select onChange={(e) => setRole(e.target.value)}>
                      {" "}
                      <option value="Client">Client</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      ModifierUtilisateurBouttonClicked();
                    }}
                  >
                    Modifier l'utilisateur
                  </button>
                  {messageUpdate && (
                    <p
                      className={
                        messageUpdate === "Utilisateur changé"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {messageUpdate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
