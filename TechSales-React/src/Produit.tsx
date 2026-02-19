export default function ProduitDetails() {
  return (
    <main className="container-fluid">
      <h5>Produit</h5>

      <div className="row">
        {/* Affichage de l'image du laptop */}
        <div className="col">
          <img src="" alt="Image d'un laptop :')" />
        </div>

        {/* Affichage des informations generales de l'ordinateur */}
        <div className="col">
          <h4 className="row">Nom de l'ordinateur portable</h4>
          <h5 className="row text-success">En stock</h5>
          <h5 className="row">Prix du laptop $$$</h5>
          <p className="row fs-6">Description du laptop</p>
          <hr className="row" />

          {/* Affichage des caracteristiques du laptop */}
          <div className="row card">
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
          <div className="row card my-5">
            <ul className="list-group list-group-flush">
              <li className="list-group-item fw-bold">Livraison Gratuite</li>
            </ul>
          </div>

          {/* Affichage de la selection de la quantite et boutton acheter */}
          <div className="row">
            <input
              type="number"
              className="col-4 form-control-sm me-3"
              id="quantite"
              min={1}
              placeholder="1"
            ></input>
            <button type="button" className=" col btn btn-dark">
              Acheter
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <h1>Patate</h1>
      </div>
    </main>
  );
}
