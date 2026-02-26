import { Link } from "react-router";
import logo from "./assets/logo.png";
import {useState} from "react";
import { useNavigate } from "react-router";

{
  /*source Card : https://getbootstrap.com/docs/4.0/components/card/
    source Flex : https://getbootstrap.com/docs/4.0/utilities/flex/ 
    source useNavigate : https://reactrouter.com/api/hooks/useNavigate 
    source OnChange : https://www.geeksforgeeks.org/reactjs/react-onchange-event/ https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean  */
}


export default function AfficherCreerCompte() {
  const navigate = useNavigate();
  const[nom, setNom] = useState("");
  const[prenom, setPrenom] = useState("");
  const[email, setEmail] = useState("");
  const[motDePasse, setMotDePasse] = useState("");
  const[messageInscriptionMauvaise, setMessageInscriptionMauvaise] = useState(false);

function afficherMessageInscriptionMauvaise() {
  setMessageInscriptionMauvaise(true);
}

function lireInfosInscription() { 
  console.log("Nom:", nom);
  console.log("Prénom:", prenom);
  console.log("Email:", email);
  console.log("Mot de Passe:", motDePasse);
  setNom(nom);
  setPrenom(prenom);
  setEmail(email);
  setMotDePasse(motDePasse);
}

function CreationCompteBouttonClicked() {
    const boutton = document.getElementById("CreationCompte") as HTMLButtonElement;
    if (boutton && nom && prenom && email && motDePasse) {
      boutton.disabled = true;
      navigate("/Compte");
    } else { setMessageInscriptionMauvaise(true); }
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
                      value={nom}
                      placeholder="Entrez votre Nom"
                      onChange={(e) => setNom(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Prénom:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={prenom}
                      placeholder="Entrez votre Prénom"
                      onChange={(e) => setPrenom(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      placeholder="Entrez votre Email"
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Mot de Passe:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={motDePasse}
                      placeholder="Entrez un mot de passe"
                      onChange={(e) => setMotDePasse(e.target.value)}
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
