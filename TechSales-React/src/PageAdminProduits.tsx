import { HeaderComponent, FooterComponent } from "./main";
import { useEffect, useState } from "react";

type Produit = {
  id_produit: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

//Information des produits pour la liste des produits
function InfoProduit({ produit }: { produit: Produit }) {
  return (
    <li className="list-group-item d-flex align-items-center">
      <div className="flex-grow-1 text-start">
        <p className="mb-0 fw-bold">{produit.nom}</p>
        <p className="mb-0">ID: {produit.id_produit}</p>
      </div>
      <div className="text-end">
        <p className="mb-0 fw-bold">{produit.prix}$</p>
        <p>Stock:{produit.stock}</p>
      </div>
    </li>
  );
}

export default function PageAdminProduit() {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [messageIdVide, setMessageIdVide] = useState("");
  const [BouttonDisabled, setBouttonDisabled] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/produits")
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error(err));
  }, []);

  //Supprimer produit
  function supprimerProduit() {
    if (!id) {
      setMessageIdVide("*Il manque des champs obligatoires*");
      return;
    }

    fetch("http://localhost:4000/produits/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Produit supprimé");
      })
      .catch((err) => console.error(err));
  }

  //Modifier produit
  function modifierProduit() {
    if (!id || !nom || !prix || !stock) {
      setMessageIdVide("*Il manque des champs obligatoires*");
      return;
    }

    fetch("http://localhost:4000/produits/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: nom,
        prix: prix,
        stock: stock,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Produit modifié");
      })
      .catch((err) => console.error(err));
  }

  return (
    <main className="container-fluid text-center">
      <HeaderComponent />

      <div className="d-flex justify-content-center align-items-left">
        <div className="row">
          <div className="p-3">
            <div
              className="card shadow-lg p-1"
              style={{ backgroundColor: "#000000", color: "white" }}
            >
              <h2 className="mt-4">Liste des produits</h2>
              <div className="overflow-auto" style={{ height: "300px" }}>
                <ul className="list-group mt-1">
                  {produits.map((produit) => (
                    <InfoProduit key={produit.id_produit} produit={produit} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modifier */}
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

              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Id produit"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nom produit"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
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

        {/* Supprimer */}
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

              <div className="card shadow-lg m-4 mx-4 p-4">
                <div className="form-group text-start">
                  <input
                    type="number"
                    className="form-control mb-3"
                    value={id}
                    placeholder="Id du produit"
                    onChange={(e) => {
                      setId(e.target.value);
                      setMessageIdVide("");
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
