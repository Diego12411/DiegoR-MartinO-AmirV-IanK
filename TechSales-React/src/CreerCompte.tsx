import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import background from "./assets/background2.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemPanier } from "./models/itemPanier";

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
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [itemPanier, setItemPanier] = useState<ItemPanier[]>([]);
  const [messageCreationCompte, setMessageCreationCompte] = useState("");

  function CreationCompteBouttonClicked() {
    if (!nom || !prenom || !courriel || !motDePasse) {
      setMessageCreationCompte("*Il manque des champs obligatoires");
      return;
    }

    setBouttonDisabled(true);
    setMessageCreationCompte("");

    fetch("http://127.0.0.1:4000/utilisateurs/creerCompte", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: nom,
        prenom: prenom,
        courriel: courriel,
        motDePasse: motDePasse,
        role: "Client",
        itemPanier: itemPanier,
      }),
    })
      .then((res) => {
        return res.json().then((data) => ({
          ok: res.ok,
          data: data,
        }));
      })
      .then(({ ok, data }) => {
        if (!ok) {
          setMessageCreationCompte(
            data.message || "Erreur lors de la création du compte.",
          );
          return;
        }

        // Compte créé avec succès, rediriger vers la page de connexion
        navigate("/compte");
      })
      .catch((err) => {
        console.error(err);
        setMessageCreationCompte("Impossible de joindre le serveur.");
      })
      .finally(() => {
        setBouttonDisabled(false);
      });
  }

  return (
    <div
      className="rectangle"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="container-fluid text-center p-0">
        <HeaderComponent />
        <div
          style={{
            marginBottom: "40px",
          }}
        ></div>

        <div className="d-flex justify-content-center align-items-center">
          <div className="row justify-content-center">
            <div className="col-7">
              <div
                className="card shadow-lg px-5 py-5 d-flex flex-column"
                style={{ backgroundColor: "#ffffff" }}
              >
                {/* Logo + Titre */}
                <div className="card-title text-dark py-4">
                  <div className="d-flex justify-content-start">
                    <img
                      src={logo}
                      className="img-fluid"
                      alt="logo"
                      width={200}
                      height={35}
                    />
                  </div>
                  <br />
                  <h1 className="text-black text-start">
                    Créez votre Compte TechSales !
                  </h1>
                </div>

                {/* Inputs */}
                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    placeholder="Nom"
                    onChange={(e) => {
                      setNom(e.target.value);
                      setMessageCreationCompte("");
                    }}
                  />
                  <br />
                </div>
                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control"
                    value={prenom}
                    placeholder="Prénom"
                    onChange={(e) => {
                      setPrenom(e.target.value);
                      setMessageCreationCompte("");
                    }}
                  />
                  <br />
                </div>
                <div className="form-group text-start">
                  <input
                    type="email"
                    className="form-control"
                    value={courriel}
                    placeholder="Email"
                    onChange={(e) => {
                      setCourriel(e.target.value);
                      setMessageCreationCompte("");
                    }}
                  />
                  <br />
                </div>
                <div className="form-group text-start">
                  <input
                    type="password"
                    className="form-control"
                    value={motDePasse}
                    placeholder="Mot de passe"
                    onChange={(e) => {
                      setMotDePasse(e.target.value);
                      setMessageCreationCompte("");
                    }}
                  />
                  <br />
                </div>

                {/* Bouton */}
                <button
                  type="button"
                  className="btn btn-dark"
                  disabled={BouttonDisabled}
                  onClick={() => CreationCompteBouttonClicked()}
                >
                  Créer Mon Compte
                </button>

                {messageCreationCompte && (
                  <p className="text-danger">{messageCreationCompte}</p>
                )}

                {/* Séparateur */}
                <div className="d-flex align-items-center my-3 w-100">
                  <hr className="flex-grow-1" />
                  <span className="mx-3 text-muted">Ou connectez vous</span>
                  <hr className="flex-grow-1" />
                </div>

                {/* Texte conditions */}
                <div className="text-muted">
                  En cliquant "Créer Mon Compte" vous acceptez les conditions
                  d'utilisation et la politique de confidentialité.
                </div>

                {/* Bouton Se Connecter */}
                <button
                  type="button"
                  className="btn btn-outline-dark mt-3 mb-3"
                  onClick={() => navigate("/seConnecter")}
                >
                  Se Connecter
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            marginBottom: "40px",
          }}
        ></div>
        <FooterComponent />
      </main>
    </div>
  );
}
