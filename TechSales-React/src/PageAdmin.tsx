import { HeaderComponent } from "./main";
import logo from "./assets/logo.png";
import { useState } from "react";

export default function AfficherPageAdmin() {
  const [BouttonDisabled, setBouttonDisabled] = useState(false);
  const [id, setId] = useState("");
  const [messageIdVide, setMessageIdVide] = useState("");
  const [messageDelete, setMessageDelete] = useState(false);

  function supprimerUtilisateurBouttonClicked() {
    if (!id) {
      setMessageIdVide("*Il manque des champs obligatoires*");
      return;
    }
    fetch("http://localhost:4000/utilisateur", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
                    value={id}
                    placeholder="Id"
                    onChange={(e) => {
                      setId(e.target.value);
                      setMessageIdVide(""); // efface le message automatiquement
                    }}
                  ></input>
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={BouttonDisabled}
                    onClick={() => {
                      supprimerUtilisateurBouttonClicked();
                    }}
                  >
                    Supprimer l'utilisateur
                  </button>
                  {messageIdVide && (
                    <p className="text-danger">{messageIdVide}</p>
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
