import { Link, useParams } from "react-router";
import { HeaderComponent, FooterComponent } from "./main.tsx";
import { useEffect, useState } from "react";

/**
 * Page qui affiche les informations detaillees d'un produit specifique
 * Au bas de la page, on retrouve d'autres produits disponibles sur notre site.
 * Lorsque l'image est clicke, ca nous redirige vers une nouvelle page avec les informations detaillees du prochain produit.
 */

type Produit = {
  id_produit: number;
  specs_id_specs: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
};

type Spec = {
  idSpec: number;
  type_produit: string;
  processeur: string;
  frequence_processeur: number;
  taille_ram: number;
  type_ram: string;
  taille_stockage: number;
  type_stockage: string;
  carte_graphique: string;
};

export default function ProduitDetails() {
  // on recupere le parametre de l'id du produit recu par le lien
  const { id } = useParams();

  // on recupere les donnes a partir de l'API GET /produits/${id}
  const [produitFetched, setProduitFetched] = useState<Produit | null>(null);
  useEffect(() => {
    fetch(`http://localhost:4000/produits/${id}`)
      .then((response) => response.json()) // parse JSON data
      .then((data) => setProduitFetched(data[0]));
  }, [id]);

  // on recupere les informations du specs a partir des informations fetch pour le produit ci-haut
  const [specsFetched, setSpecsFetched] = useState<Spec | null>(null);
  useEffect(() => {
    fetch(`http://localhost:4000/specs/${produitFetched?.specs_id_specs}`)
      .then((response) => response.json())
      .then((data) => setSpecsFetched(data));
  }, [produitFetched]);

  const [randomProduits, setRandomProduits] = useState<Produit[]>([]);
  useEffect(() => {
    fetch("http://localhost:4000/produits/random")
      .then((response) => response.json())
      .then((data) => setRandomProduits(data));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // state qui contient la quantite de produit a acheter
  const [quantiteAcheter, setQuantiteAcheter] = useState(1);

  // s'occupe de la couleur de l'affichage du stock
  const HandleAffichageStock = () => {
    if (Number(produitFetched?.prix) > 0) {
      return <h5 className="text-success">En stock</h5>;
    } else {
      return <h5 className="text-danger">Rupture de stock</h5>;
    }
  };

  return (
    <>
      {/* Header developpe dans le main */}
      <HeaderComponent />

      {/* Element semantique qui contient l'information principale de la page */}
      <main className="container-fluid vw-100 px-5">
        {/* Debut de la page de details d'un produit specifique */}
        <h5>Produit</h5>

        <div className="row">
          {/* Affichage de l'image du laptop */}
          <div className="col">
            <img
              src={produitFetched?.image_url}
              alt="Image d'un laptop :')"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>

          {/* Affichage des informations generales de l'ordinateur */}
          <div className="col">
            <h4 className="fw-bold">{produitFetched?.nom}</h4>
            {HandleAffichageStock()}
            <h5>${produitFetched?.prix}</h5>
            <p className="fs-6">{produitFetched?.description}</p>
            <hr className="w-75" style={{ border: "1px solid", opacity: 1 }} />

            {/* Affichage des caracteristiques du laptop */}
            <div className="card">
              <ul className="list-group list-group-flush">
                {/* Affichage du processeur */}
                <li className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="https://icons.veryicon.com/png/o/internet--web/elegant-linear-icon/cpu-6.png"
                    alt="image d'un CPU"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <small className="text-body-secondary">Processeur</small>
                    <br />
                    {specsFetched?.processeur}{" "}
                    {specsFetched?.frequence_processeur} GHz
                  </div>
                </li>
                {/* Affichage de la carte graphique */}
                <li className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/014/935/546/small_2x/chip-gpu-card-icon-simple-graphic-pc-vector.jpg"
                    alt="image d'un CPU"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <small className="text-body-secondary">
                      Carte Graphique
                    </small>
                    <br />
                    {specsFetched?.carte_graphique}
                  </div>
                </li>
                {/* Affichage de la memoire */}
                <li className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="https://t4.ftcdn.net/jpg/05/62/71/77/360_F_562717748_ZAfTzKz4sLPlm9KGDIsWASVcQgh7GOta.jpg"
                    alt="image d'un CPU"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <small className="text-body-secondary">Memoire</small>
                    <br />
                    {specsFetched?.taille_ram} Go
                  </div>
                </li>
                {/* Affichage de la capacite de stockage */}
                <li className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/006/793/680/non_2x/storage-ssd-icon-hardware-line-style-free-free-vector.jpg"
                    alt="image d'un CPU"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <small className="text-body-secondary">Stockage</small>
                    <br />
                    {specsFetched?.taille_stockage} Go{" "}
                    {specsFetched?.type_stockage}
                  </div>
                </li>
              </ul>
            </div>

            {/* Affichage de la livraison gratuite */}
            <div className="card my-5">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/002/206/240/small_2x/fast-delivery-icon-free-vector.jpg"
                    alt="image d'un camion de livraison"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="fw-bold">Livraison Gratuite</div>
                </li>
              </ul>
            </div>

            {/* Affichage de la selection de la quantite et du boutton acheter */}
            <div className="d-flex gap-5">
              <input
                type="number"
                className="w-25 form-control-sm"
                min={1}
                value={quantiteAcheter}
                onChange={(e) => setQuantiteAcheter(Number(e.target.value))}
              />
              <Link to="/" className="flex-fill">
                <button type="button" className="btn btn-dark w-100">
                  Acheter
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Affichage des autres produits suggeres au bas de la page (!= footer) */}
        <div className="row px-5 mx-5">
          <hr
            className="mt-5 w-25 rounded-5"
            style={{
              border: "3px solid #000000",
              opacity: 1,
            }}
          />
          <h5>Autres produits</h5>
          <div className="row row-cols-1 row-cols-md-4 g-3 mb-5">
            {randomProduits.map((produit) => (
              <div className="col" key={produit.id_produit}>
                <div className="card h-100">
                  <Link to={`/detailsProduit/${produit.id_produit}`}>
                    <img
                      src={produit.image_url}
                      alt={produit.nom}
                      style={{
                        width: "100%",
                        height: "125px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div className="card-body">
                    <h6 className="card-title">{produit.nom}</h6>
                    <small className="text-body-secondary">
                      ${produit.prix}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Footer developpe dans le main */}
      <FooterComponent />
    </>
  );
}
