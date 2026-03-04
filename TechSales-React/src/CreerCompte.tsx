import { HeaderComponent } from "./main";
import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";

{
  /*source Card : https://getbootstrap.com/docs/4.0/components/card/
    source Flex : https://getbootstrap.com/docs/4.0/utilities/flex/ 
    source useNavigate : https://reactrouter.com/api/hooks/useNavigate 
    source OnChange : https://www.geeksforgeeks.org/reactjs/react-onchange-event/ https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean  */
}

export default function AfficherCreerCompte() {
  const navigate = useNavigate();
  const [BouttonDisabled, setBouttonDisabled] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [messageInscriptionMauvaise, setMessageInscriptionMauvaise] =
    useState(false);

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
    if (nom && prenom && email && motDePasse) {
      setBouttonDisabled(true);
      navigate("/Compte");
    } else {
      setMessageInscriptionMauvaise(true);
    }
  }

  return (
    <div
      className="rectangle"
      style={{
        backgroundColor: "#40365a",
      }}
    >
      <main className="container-fluid text-center">
        <HeaderComponent />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="row">
            {/*Formulaire De Creation Compte*/}
            <div className="col-12 my-3 p-5">
              <div
                className="card shadow-lg p-3"
                style={{ backgroundColor: "#f3efef", color: "white" }}
              >
                <h3 className="card-title text-dark">
                  <img
                    src={logo}
                    className="rounded mx-auto d-block"
                    alt="logo"
                    width={200}
                    height={35}
                  ></img>
                  <br />
                  Créez votre Compte TechSales
                </h3>
                <div className="card shadow-lg m-4 mx-4 p-4">
                  <div className="form-group text-start">
                    <input
                      type="text"
                      className="form-control"
                      value={nom}
                      placeholder="Nom"
                      onChange={(e) => setNom(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="text"
                      className="form-control"
                      value={prenom}
                      placeholder="Prénom"
                      onChange={(e) => setPrenom(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="password"
                      className="form-control"
                      value={motDePasse}
                      placeholder="Mot de passe"
                      onChange={(e) => setMotDePasse(e.target.value)}
                    ></input>
                    <br />
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={BouttonDisabled}
                    onClick={() => {
                      CreationCompteBouttonClicked();
                      lireInfosInscription();
                    }}
                  >
                    Créer Mon Compte
                  </button>
                  {messageInscriptionMauvaise && (
                    <p className="text-danger">
                      *Il manque des champs obligatoires*
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
