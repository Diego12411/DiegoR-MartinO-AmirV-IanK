import { Link, useParams } from "react-router";
import { HeaderComponent, FooterComponent } from "./main.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/**
 * =========================================================================================
 * PAGE PRODUIT DÉTAILS - AFFICHAGE D'UN PRODUIT ET AJOUT AU PANIER (REACT)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Cette page affiche les informations détaillées d’un produit sélectionné.
 * Elle permet aussi d’ajouter le produit au panier et de consulter des produits similaires.
 *
 * Fonctionnement global :
 * - Récupère l’ID du produit via l’URL (useParams)
 * - Fetch les détails complets du produit depuis le backend
 * - Fetch une liste de produits aléatoires pour suggestions
 * - Affiche toutes les informations du produit (specs, prix, stock, description)
 * - Permet d’ajouter une quantité au panier
 *
 * Données produit :
 * - Informations générales : nom, prix, description, stock
 * - Image principale du produit
 * - Spécifications techniques (CPU, GPU, RAM, stockage)
 * - Catégorie associée
 *
 * Interactions utilisateur :
 * - Sélection de quantité à ajouter
 * - Bouton "Ajouter au panier"
 * - Redirection login si utilisateur non connecté
 * - Message de confirmation après ajout au panier
 *
 * Panier :
 * - Ajout via PATCH /paniers/ajoutItem
 * - Authentification requise (cookies JWT via credentials: include)
 * - Gestion des erreurs 401 (non connecté)
 *
 * Produits suggérés :
 * - Récupérés via GET /produits/lireProduitsHasard
 * - Affichés en bas de page sous forme de cartes cliquables
 * - Redirection vers la page détail d’un autre produit
 *
 * États React utilisés :
 * - produit : produit actuellement affiché
 * - produitsHasard : liste de produits recommandés
 * - quantiteAcheter : quantité sélectionnée
 * - nonConnecte : affiche message si utilisateur non authentifié
 * - itemAjoute : confirmation ajout panier
 *
 * UX :
 * - Scroll automatique en haut lors changement produit
 * - Reset des alertes à chaque changement d’ID
 * - Désactivation bouton si stock insuffisant
 *
 * API utilisées :
 * - GET /produits/:id
 * - GET /produits/lireProduitsHasard
 * - PATCH /paniers/ajoutItem
 *
 * Dépendances :
 * - React Router (navigation et paramètres URL)
 * - Bootstrap (layout et composants UI)
 *
 * Auteur : Martin
 * =========================================================================================
 */
type Categorie = {
  nom_categorie: string;
};

type Specification = {
  type_produit: string;
  processeur: string;
  frequence_processeur: string;
  type_ram: string;
  taille_ram: number;
  type_stockage: string;
  taille_stockage: number;
  carte_graphique: string;
};

type Produit = {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url: string;
  categorie: Categorie;
  specification: Specification;
};

export default function ProduitDetails() {
  // meme signature que declare dans server.ts/CORS sinon bug
  const API_DEFAULT = "http://127.0.0.1:4000";

  // variable qui permet la nagivation des pages
  const navigate = useNavigate();

  // on recupere le parametre de l'id du produit recu par le lien
  const { id } = useParams();

  // state qui contient la quantite de produit a acheter
  const [quantiteAcheter, setQuantiteAcheter] = useState(1);

  // state qui va faire apparaitre un pop up window lorsque l'utilisateur n'est pas connecte
  const [nonConnecte, setNonConnecte] = useState(false);
  // state qui va faire apparaitre un pop up window lorsque l'utilisateur ajoute un produit a son panier
  const [itemAjoute, setItemAjoute] = useState(false);

  // Avec mongodb, le produit contient deja les specs integres (embedded document)
  // un seul fetch suffit, plus besoin d'un 2e appel pour les aspects aka "on cherche les attributs d'un objet"
  const [produit, setProduit] = useState<Produit | null>(null);

  // On recupere 4 produits au hasard a presente dans le bas de page
  const [produitsHasard, setProduitsHasard] = useState<Produit[]>([]);
  useEffect(() => {
    fetch(`${API_DEFAULT}/produits/lireProduitsHasard`)
      .then((response) => response.json())
      .then((data: Produit[]) => setProduitsHasard(data ?? []));
  }, [id]);

  useEffect(() => {
    fetch(`${API_DEFAULT}/produits/${id}`)
      .then((response) => response.json())
      .then((data) => setProduit(data)); // mongo retourne un objet Produit directement
  }, [id]);

  // On deplace la page "window" a la position (0,0), soit le haut de la page lorsque le id du produit initiale change
  useEffect(() => {
    window.scrollTo(0, 0);
    setNonConnecte(false);
    setItemAjoute(false);
  }, [id]);

  // s'occupe de la couleur de l'affichage du stock
  const HandleAffichageStock = () => {
    if (produit && produit.stock > 0) {
      return <h5 className="text-success">En stock</h5>;
    } else {
      return <h5 className="text-danger">Rupture de stock</h5>;
    }
  };

  const ajouterItemAuPanier = async () => {
    try {
      const response = await fetch(`${API_DEFAULT}/paniers/ajoutItem`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          produitId: produit?._id,
          quantite: quantiteAcheter,
        }),
      });

      // le statut 401 provient de Middleware/authenticateToken() => lorsque erreur
      if (response.status === 401) {
        setNonConnecte(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // remonte la page lorsque le pop up apparait
        return;
      }

      setItemAjoute(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Erreur lors de l'ajout au panier");
    }
  };

  // ===== Debut du developpement de la page details d'un produit =====

  return (
    <>
      {/* Header developpe dans le main */}
      <HeaderComponent />

      {nonConnecte && (
        <div className="alert alert-warning text-center mx-5 my-3">
          <p className="mb-2">
            Vous devez être connecté pour ajouter des items a votre panier.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-dark"
              onClick={() => navigate("/seConnecter")}
            >
              Se connecter
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => setNonConnecte(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {itemAjoute && (
        <div className="alert alert-success text-center mx-5 my-3">
          <p className="mb-2">Item ajouté au panier avec succès.</p>
          <button
            className="btn btn-outline-dark"
            onClick={() => setItemAjoute(false)}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Element semantique qui contient l'information principale de la page */}
      <main className="container-fluid vw-100 px-5">
        {/* Debut de la page de details d'un produit specifique */}
        <h5>Produit</h5>

        <div className="row">
          {/* Affichage de l'image du laptop */}
          <div className="col">
            <img
              src={produit?.image_url}
              alt="Image d'un laptop :')"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>

          {/* Affichage des informations generales de l'ordinateur */}
          <div className="col">
            <h4 className="fw-bold">{produit?.nom}</h4>
            {HandleAffichageStock()}
            <h5>${produit?.prix}</h5>
            <p className="fs-6">{produit?.description}</p>
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
                    {produit?.specification?.processeur}{" "}
                    {produit?.specification?.frequence_processeur} GHz
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
                    {produit?.specification?.carte_graphique}
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
                    {produit?.specification?.taille_ram} Go{" "}
                    {produit?.specification?.type_ram}
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
                    {produit?.specification?.taille_stockage} Go{" "}
                    {produit?.specification?.type_stockage}
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
              <button
                type="button"
                className="btn btn-dark w-100"
                onClick={ajouterItemAuPanier}
                disabled={!produit || produit.stock < 1}
              >
                Ajouter au panier
              </button>
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
            {produitsHasard?.map((produit) => (
              <div className="col" key={produit._id}>
                <div className="card h-100">
                  <Link to={`/detailsProduit/${produit._id}`}>
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
