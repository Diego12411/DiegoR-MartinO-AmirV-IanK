import { HeaderComponent, FooterComponent } from "./main";
import { useState, useEffect } from "react";
import "./PageAdmin.css";

// ============================================================
// TYPES
// ============================================================

type Produit = {
  _id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

// ============================================================
// PAGE ADMIN PRINCIPALE
// ============================================================

export default function AfficherPageAdmin() {
  // ----------------------------------------------------------
  // ÉTATS - Gestion des utilisateurs (de PageAdmin)
  // ----------------------------------------------------------
  const [courrielDelete, setCourrielDelete] = useState("");
  const [courrielUpdate, setCourrielUpdate] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("Client");
  const [messageDelete, setMessageDelete] = useState("");
  const [messageUpdate, setMessageUpdate] = useState("");

  // ----------------------------------------------------------
  // ÉTATS - Gestion des produits (de PageAdminProduit)
  // ----------------------------------------------------------
  const [id, setId] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [nomProduit, setNomProduit] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [selected, setSelected] = useState("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitListe, setProduitListe] = useState("");
  const [produitListeNom, setProduitListeNom] = useState("");
  const [messageIdVide, setMessageIdVide] = useState("");
  const [BouttonDisabled, setBouttonDisabled] = useState(false);

  // ----------------------------------------------------------
  // CHARGEMENT - Produits (de PageAdminProduit)
  // ----------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:4000/produits")
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error(err));
  }, []);

  // ----------------------------------------------------------
  // FONCTIONS - Utilisateurs (de PageAdmin)
  // ----------------------------------------------------------

  function supprimerUtilisateurBouttonClicked() {
    if (!courrielDelete) {
      setMessageDelete("*Il manque des champs obligatoires*");
      return;
    }
    fetch(
      "http://localhost:4000/utilisateurs/retirerUtilisateur/" + courrielDelete,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courriel: courrielDelete }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Utilisateur introuvable") {
          setMessageDelete(data.message);
        } else if (data.message === "Utilisateur supprimé") {
          setMessageDelete(data.message);
        }
      });
  }

  function ModifierUtilisateurBouttonClicked() {
    if (!courrielUpdate) {
      setMessageUpdate("*Il manque des champs obligatoires*");
      return;
    }
    fetch(
      "http://localhost:4000/utilisateurs/changerUtilisateur/" + courrielUpdate,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom,
          prenom: prenom,
          motDePasse: motDePasse,
          courriel: courrielUpdate,
          role: role,
        }),
      }
    )
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

  // ----------------------------------------------------------
  // FONCTIONS - Produits (de PageAdminProduit)
  // ----------------------------------------------------------

  function supprimerProduit() {
    if (!id) {
      setMessageIdVide("*Il manque des champs obligatoires*");
      return;
    }
    fetch("http://localhost:4000/produits/" + id, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Produit supprimé");
      })
      .catch((err) => console.error(err));
  }

  function modifierProduit() {
    if (!id || !nomProduit || !prix || !stock) {
      setMessageIdVide("*Il manque des champs obligatoires*");
      return;
    }
    fetch("http://localhost:4000/produits/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: nomProduit, prix: prix, stock: stock }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Produit modifié");
      })
      .catch((err) => console.error(err));
  }

  // ============================================================
  // SOUS-COMPOSANT - Info Produit (de PageAdminProduit)
  // ============================================================

  function InfoProduit({ produit }: { produit: Produit }) {
    const handleClick = () => {
      if (selected == "Supprimer") {
        setIdDelete(produit._id.toString());
      } else if (selected == "Modifier") {
        setId(produit._id.toString());
        setNomProduit(produit.nom);
        setPrix(produit.prix.toString());
        setStock(produit.stock.toString());
      }
      setSelected("");
    };
    return (
      <button
        className="list-group-item d-flex align-items-center m-1 produitBouton"
        onMouseDown={handleClick}
      >
        <div className="flex-grow-1 text-start">
          <p className="mb-0 fw-bold">{produit.nom}</p>
          <p className="mb-0">ID: {produit._id}</p>
        </div>
        <div className="text-end">
          <p className="mb-0 fw-bold">{produit.prix}$</p>
          <p>Stock: {produit.stock}</p>
        </div>
      </button>
    );
  }

  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------
  return (
    <main className="container-fluid text-center p-0">
      <HeaderComponent />

      {/* ==========================================================
          SECTION UTILISATEURS (de PageAdmin)
      ========================================================== */}
      <h2 className="my-4">Gestion des Utilisateurs</h2>
      <div className="d-flex justify-content-center align-items-left vh-100">
        <div className="row">
          {/* Formulaire de delete utilisateur */}
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
                    type="text"
                    className="form-control"
                    value={courrielDelete}
                    placeholder="Courriel"
                    onChange={(e) => {
                      setCourrielDelete(e.target.value);
                      setMessageDelete("");
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

        {/* Formulaire de put utilisateur */}
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
                  <input
                    type="text"
                    className="form-control"
                    value={courrielUpdate}
                    placeholder="Courriel"
                    onChange={(e) => {
                      setCourrielUpdate(e.target.value);
                      setMessageDelete("");
                    }}
                  ></input>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    placeholder="Nom"
                    onChange={(e) => setNom(e.target.value)}
                  ></input>
                </div>
                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control"
                    value={prenom}
                    placeholder="Prénom"
                    onChange={(e) => setPrenom(e.target.value)}
                  ></input>
                </div>
                <div className="form-group text-start"></div>
                <div className="form-group text-start">
                  <input
                    type="password"
                    className="form-control"
                    value={motDePasse}
                    placeholder="Mot de passe"
                    onChange={(e) => setMotDePasse(e.target.value)}
                  ></input>
                  <div className="form-group text-start">
                    <select onChange={(e) => setRole(e.target.value)}>
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

      {/* ==========================================================
          SECTION PRODUITS (de PageAdminProduit)
      ========================================================== */}
      <h2 className="my-4">Gestion des Produits</h2>
      {/* Rechercher produit */}
      <div className="d-flex justify-content-center align-items-left">
        <div className="row">
          <div className="col-12 p-3">
            <div
              className="card shadow-lg p-1"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h3 className="card-title text-white">
                <br />
                Liste des produits
              </h3>
              <br />
              <input
                type="text"
                className="form-control mb-1"
                placeholder="Rechercher"
                onChange={(e) => {
                  setProduitListe(e.target.value);
                  setProduitListeNom(e.target.value);
                }}
              />
              <div className="overflow-auto" style={{ height: "200px" }}>
                <ul className="list-group mt-1">
                  {produits
                    .filter(
                      (produit) =>
                        produit._id.toString().startsWith(`${produitListe}`) ||
                        produit.nom
                          .toString()
                          .toLowerCase()
                          .startsWith(`${produitListeNom}`)
                    )
                    .map((produit) => (
                      <InfoProduit key={produit._id} produit={produit} />
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Modifier produit */}
        <div className="row">
          <div className="col-12 p-3">
            <div
              className="card shadow-lg p-1"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h3 className="card-title text-white">
                <br />
                Modifier un produit
              </h3>
              <p
                className="text-white font-italic"
                style={{ fontStyle: "italic" }}
              >
                Cliquez sur un produit dans la liste
              </p>
              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Id produit"
                    value={id}
                    onChange={(e) => {
                      setId(e.target.value);
                    }}
                    onFocus={(e) => {
                      setSelected("Modifier");
                    }}
                    onBlur={(e) => {
                      setSelected("");
                    }}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nom produit"
                    value={nomProduit}
                    onChange={(e) => setNomProduit(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Prix"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={BouttonDisabled}
                    onClick={modifierProduit}
                  >
                    Modifier
                  </button>
                  {messageIdVide && (
                    <p className="text-danger">{messageIdVide}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Supprimer produit */}
        <div className="row">
          <div className="col-12 p-3">
            <div
              className="card shadow-lg p-1"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h3 className="card-title text-white">
                <br />
                Supprimer un produit
              </h3>
              <p className="text-white" style={{ fontStyle: "italic" }}>
                Cliquez sur un produit dans la liste
              </p>
              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={idDelete}
                    placeholder="Id du produit"
                    onChange={(e) => {
                      setIdDelete(e.target.value);
                      setMessageIdVide("");
                    }}
                    onFocus={(e) => {
                      setSelected("Supprimer");
                    }}
                    onBlur={(e) => {
                      setSelected("");
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={BouttonDisabled}
                    onClick={supprimerProduit}
                  >
                    Supprimer
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
      <FooterComponent />
    </main>
  );
}
