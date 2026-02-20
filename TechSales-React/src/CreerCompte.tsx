import logo from "./assets/logo.png";
import {useState} from "react";

{
  /*source Card : https://getbootstrap.com/docs/4.0/components/card/
    source Flex : https://getbootstrap.com/docs/4.0/utilities/flex/ */
}


export default function AfficherCreerCompte() {
  const[nom, setNom] = useState("");
  const[prenom, setPrenom] = useState("");
  const[email, setEmail] = useState("");
  const[motDePasse, setMotDePasse] = useState("");
  const[messageInscriptionMauvaise, setMessageInscriptionMauvaise] = useState(false);

function afficherMessageInscriptionMauvaise() {
  setMessageInscriptionMauvaise(true);
}

function lireInfosInscription() {
  const nom = document.getElementById("Nom") as HTMLInputElement;
  const prenom = document.getElementById("Prenom") as HTMLInputElement;
  const email = document.getElementById("Email") as HTMLInputElement;
  const motDePasse = document.getElementById("MotDePasse") as HTMLInputElement;
  console.log("Nom:", nom.value);
  console.log("Prénom:", prenom.value);
  console.log("Email:", email.value);
  console.log("Mot de Passe:", motDePasse.value);
  setNom(nom.value);
  setPrenom(prenom.value);
  setEmail(email.value);
  setMotDePasse(motDePasse.value);
}

function CreationCompteBouttonClicked() {
  const nom = document.getElementById("Nom") as HTMLInputElement;
  const prenom = document.getElementById("Prenom") as HTMLInputElement;
  const email = document.getElementById("Email") as HTMLInputElement;
  const motDePasse = document.getElementById("MotDePasse") as HTMLInputElement;
    const boutton = document.getElementById("CreationCompte") as HTMLButtonElement;
    if (boutton && nom.value !== "" && prenom.value !== "" && email.value !== "" && motDePasse.value !== "") {
      boutton.disabled = true;
    } else { setMessageInscriptionMauvaise("true"); }
}

  return (
<div
  className="rectangle"
  style={{
    backgroundColor: "#40365a",
    backgroundImage:
      "repeating-linear-gradient(25deg, rgba(48, 41, 49, 0.1) 0, rgba(214, 209, 209, 0.1) 5px, transparent 10px, transparent 20px)",
    color: "white",
  }}
>
      <main className="container-fluid text-center">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="row">
            <div className="col-12">
              <div
                className="card shadow-lg p-5"
                style={{ backgroundColor: "#f3efef", color: "white" }}
              >
                <h2 className="card-title text-dark">
                  <img src={logo} className="rounded mx-auto d-block" alt="logo" width={200} height={35}></img>
                  <br />
                  Créez votre Compte TechSales
                </h2>
                <div className="card shadow-lg m-4 mx-5 p-3">
                  <div className="form-group text-start">
                    <label>Nom:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Nom"
                      placeholder="Entrez votre Nom"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Prénom:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Prenom"
                      placeholder="Entrez votre Prénom"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Email"
                      placeholder="Entrez votre Email"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Mot de Passe:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="MotDePasse"
                      placeholder="Entrez un mot de passe"
                    ></input>
                    <br />
                  </div>
                  <button type="button" className="btn btn-dark" id="CreationCompte" onClick={() => {CreationCompteBouttonClicked(); lireInfosInscription();}}>
                    Créer Mon Compte
                  </button>
                  {messageInscriptionMauvaise && <p className="text-danger">*Il manque des champs obligatoires*</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
