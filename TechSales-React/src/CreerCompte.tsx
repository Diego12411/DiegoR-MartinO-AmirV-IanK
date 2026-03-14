import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
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
  const [messageCreationCompte, setMessageCreationCompte] =
    useState("");

  function CreationCompteBouttonClicked() {
    if (!nom || !prenom || !email || !motDePasse) {
      setMessageCreationCompte("*Il manque des champs obligatoire");
      return;
    }
    fetch("http://localhost:4000/utilisateur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: nom,
        prenom: prenom,
        mot_de_passe: motDePasse,
        courriel: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Un Compte est déja associé à ce courriel") {
          setMessageCreationCompte(data.message);
        } else if (data.message === "Utilisateur créé") {
          navigate("/Compte");
        }
      })
      .catch((err) => console.error(err));
  }
  return (
    <div
      className="rectangle"
      style={{
        backgroundColor: "#40365a",
      }}
    >
      <main className="container-fluid text-center p-0">
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
                      onChange={(e) => {setNom(e.target.value); setMessageCreationCompte("")}}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="text"
                      className="form-control"
                      value={prenom}
                      placeholder="Prénom"
                      onChange={(e) => {setPrenom(e.target.value); setMessageCreationCompte("")}}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => {setEmail(e.target.value); setMessageCreationCompte("")}}
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <input
                      type="password"
                      className="form-control"
                      value={motDePasse}
                      placeholder="Mot de passe"
                      onChange={(e) =>{ setMotDePasse(e.target.value); setMessageCreationCompte("")}}
                    ></input>
                    <br />
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={BouttonDisabled}
                    onClick={() => {
                      CreationCompteBouttonClicked();
                    }}
                  >
                    Créer Mon Compte
                  </button>
                  {messageCreationCompte && (
                    <p className="text-danger">
                      {messageCreationCompte}
                    </p>
                  )}
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
