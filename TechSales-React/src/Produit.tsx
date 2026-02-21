import { Link } from "react-router";

export default function ProduitDetails() {
  return (
    <main className="container-fluid vw-100 px-5">
      <h5>Produit</h5>

      <div className="row">
        {/* Affichage de l'image du laptop */}
        <div className="col">
          <img alt="Image d'un laptop :')" />
        </div>

        {/* Affichage des informations generales de l'ordinateur */}
        <div className="col">
          <h4>Nom de l'ordinateur portable</h4>
          <h5 className="text-success">En stock</h5>
          <h5>Prix du laptop $$$</h5>
          <p className="fs-6">Description du laptop</p>
          <hr />

          {/* Affichage des caracteristiques du laptop */}
          <div className="card">
            <ul className="list-group list-group-flush">
              {/* Affichage du processeur */}
              <li className="list-group-item">
                <small className="text-body-secondary">Processeur</small>
                <br />
                Nom du processeur + frequence
              </li>
              {/* Affichage de la carte graphique */}
              <li className="list-group-item">
                <small className="text-body-secondary">Carte Graphique</small>
                <br />
                Modele de la carte graphique
              </li>
              {/* Affichage de la memoire */}
              <li className="list-group-item">
                <small className="text-body-secondary">Memoire</small>
                <br />
                Capacite de RAM et modele
              </li>
              {/* Affichage de la capacite de stockage */}
              <li className="list-group-item">
                <small className="text-body-secondary">Stockage</small>
                <br />
                Capacite de stockage et type
              </li>
            </ul>
          </div>

          {/* Affichge de la livraison gratuite */}
          <div className="card my-5">
            <ul className="list-group list-group-flush">
              <li className="list-group-item fw-bold">Livraison Gratuite</li>
            </ul>
          </div>

          {/* Affichage de la selection de la quantite et du boutton acheter */}
          <div className="d-flex gap-2">
            <input
              type="number"
              className="col-4 form-control-sm me-3"
              id="quantite"
              min={1}
              placeholder="1"
            ></input>
            <button type="button" className=" col btn btn-dark">
              <Link to="/pagePanier" className="text-white">
                Acheter
              </Link>
            </button>
          </div>
        </div>
      </div>

      <div className="row px-5 mx-5">
        <h1>Patate</h1>
      </div>
    </main>
  );
}
