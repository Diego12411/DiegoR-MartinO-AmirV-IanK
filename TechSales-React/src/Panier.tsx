import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import "./Panier.css";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import sansImage from "./assets/ProduitSansImage.png";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

interface Produit {
  nom: string;
  prix: number;
  quantite: number;
  image: string; // dans AfficherProduit(), produit.image est utilise donc image_url -> image
  _id: string;
}

// meme signature que declare dans server.ts/CORS sinon bug
const API_DEFAULT = "http://127.0.0.1:4000";

export default function afficherPanier() {
  /**
   * ===== Declaration des etats necessaires =====
   */
  const navigate = useNavigate();
  // panier qui va contenir les items de l'utilisateur connecte
  const [panier, setPanier] = useState<Produit[]>([]);
  // state qui va faire apparaitre un pop up window lorsque l'utilisateur n'est pas connecte
  const [nonConnecte, setNonConnecte] = useState(false);
  // state qui pop un un banner affichant que le panier a ete vide avec succes
  const [panierVide, setPanierVide] = useState(false);
  const [messageBouttonAcheter, setMessageBouttonAcheter] = useState("");

  // TODO [X] : retirer un seul produit du panier de l'utilisateur
  const RetirerProduit = async (produit: Produit) => {
    try {
      const response = await fetch(
        `${API_DEFAULT}/paniers/retirerItem/${produit._id}`,
        {
          method: "DELETE",
          credentials: "include", // cookie jwt necessaire pour authenticateToken()
        }
      );

      if (response.status === 401) {
        setNonConnecte(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // React cree une paire liee lorsque [panier, setPanier], panier <=> setPanier
      // panierActuel est un nom de variable qui fait reference a panier
      //on enleve completement le produit selectionne
      setPanier((panierActuel) =>
        panierActuel.filter((p) => p._id !== produit._id)
      );
    } catch (error) {
      console.error("Erreur lors du retrait du produit");
    }
  };

  // permet l'affichage central des items dans le panier d'un utilisateur
  function AfficherProduit({ produit }: { produit: Produit }) {
    return (
      <div className="row px-5 my-3 justify-content-left">
        <div className="card shadow-lg me-5 p-3 py-3">
          <div className="col-12 bg-white p-1 d-flex justify-content-left align-items-center">
            <div className="d-flex justify-content-left align-items-center col-5">
              {/*Image du produit*/}
              <img
                className="card shadow border-dark bg-light me-3"
                src={produit.image || sansImage}
                alt={produit.nom}
                style={{
                  minWidth: "50px",
                  maxWidth: "50px",
                  minHeight: "50px",
                  maxHeight: "50px",
                  objectFit: "contain",
                }}
              ></img>
              {/*Ramene a la page details du produit associé lorsqu'on clique le nom du produit*/}
              <Link
                to={`../detailsProduit/${produit._id}`}
                className="text-secondary text-decoration-none"
              >
                <div>{produit.nom}</div>
              </Link>
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              {produit.prix} $
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              {produit.quantite}
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              {/* TODO [ ] : formater le prix * quantite pour afficher jusqua x,00$ */}
              {Math.round(produit.prix * produit.quantite * 100) / 100} $
            </div>
            {/*Bouton retirer le produit du panier*/}
            <button
              className="d-flex justify-content-left align-items-center col-1 btn btn-outline-dark btn-panier"
              style={{ minWidth: "75px", maxWidth: "75px" }}
              onClick={() => RetirerProduit(produit)}
            >
              Retirer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TODO [X] : adapter l'implementation de stripe
  // Implementer Strip comme mode de paiement
  const fairePaiement = async () => {
    try {
      //fairePaiement est une constante qui contient une fonction async ou l'on utilise stripe
      const stripe = await loadStripe(
        "pk_test_51TUcjm2K6lYYB09CZ0eccEwLkvK9nYSJQ9J4sxqdMsyEhuZyPolnOmH4lOenCxAuRbozOAWBBg1MdNbjkxI9gYVj00GGNXlA0v"
      ); //contient une instance de Stripe initialisée avec une clée publique

      // on verifie que Stripe a bien charge
      if (!stripe) {
        setMessageBouttonAcheter("Erreur lors du chargement de Stripe!");
        return;
      }

      const response = await fetch(`${API_DEFAULT}/session-caisse`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ produits: panier }), //panier est un tableau qui contient les produits affichés dans le panier
      });

      // verification si l'utilisateur est connecte a partir de authenticateToken()
      if (response.status === 401) {
        setNonConnecte(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // le status code deja defini dans stripeRouter.ts
      if (response.status === 400) {
        setMessageBouttonAcheter("Attention! Le panier est vide.");
        return;
      }

      // status ok = [200, 299] | status not ok = tout autre nombre
      if (!response.ok) {
        const erreur = await response.json();
        setMessageBouttonAcheter(erreur.error || "Erreur lor du paiement.");
        return;
      }

      const session = await response.json(); //contient la réponse du stripeRouter /session-caisse (contient un objet session qui contient l'url)

      if (!session.url) {
        setMessageBouttonAcheter("URL de paiement introuvable");
        return;
      }

      window.location.href = session.url; //change l'url du navigateur pour accéder à la page Stripe (checkout)
    } catch (error) {
      console.error("Erreur lors fairePaiement : ", error);
      setMessageBouttonAcheter(
        "Une erreur est survenue. Veuillez réessayer plus tard."
      );
    }
  };

  const livraison = 0;
  const sousTotal = panier.reduce(
    (total, produit) => total + produit.prix * produit.quantite,
    0
  );
  const taxes = sousTotal * 0.15;
  const total = taxes + sousTotal + livraison;

  // TODO [X] : implementer le fetch des produits du panier d'un utilisateur
  /**
   * === useEffet() qui va chercher les items dans le panier de l'utilisateur ===
   * On rempli le panier presente dans la page avec les elements du panier de l'utilisateur
   * Attention: on fetch les ItemPanier -> on fetch les infos des produits selon -> produire tableau d'item
   */
  useEffect(() => {
    const fetchPanier = async () => {
      try {
        // on recupere les informations de ItemPanier d'un utilisateur (seulement produitId et quantite)
        const response = await fetch(
          `${API_DEFAULT}/paniers/panierUtilisateur`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        // le statut 401 provient de Middleware/authenticateToken() => lorsque erreur
        if (response.status === 401) {
          setNonConnecte(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // itemsPanier = [{produitId, quantite}, {...}]
        const itemsPanier = await response.json();

        // pour chaque produit dans itemsPanier, on recupere les informations complete des produits
        const produitsComplets = await Promise.all(
          itemsPanier.map(
            async (item: { produitId: string; quantite: number }) => {
              const produitResponse = await fetch(
                `${API_DEFAULT}/produits/${item.produitId}`
              );

              const produit = await produitResponse.json();

              // on fusionne les donnees du produit avec la quantite du panier
              // on "construit" un nouveau Produit avec les informations necessaires seulement
              return {
                _id: produit._id,
                nom: produit.nom,
                prix: produit.prix,
                image: produit.image_url,
                quantite: item.quantite,
              };
            }
          )
        );

        // on associe le tableau d'item qui se trouve dans le panier de l'utilisateur
        setPanier(produitsComplets);
      } catch (error) {
        // message d'erreur dans le terminal si le panier n'est pas fetch adequatement
        console.error("Erreur fetch panier: ", error);
      }
    };

    // apres avoir defini fetchPanier (fonction lambda)
    // il faut l'appeler pour remplir le panier afin d'afficher les items de l'utilisateur
    fetchPanier();
  }, []);

  // TODO [X] : implementer l'action de vider tout le panier de l'utilisateur
  // methode qui est appele lorsque l'utilisateur choisi d'effacer son panier au complet
  const effacerPanier = async () => {
    try {
      const response = await fetch(`${API_DEFAULT}/paniers/viderPanier`, {
        method: "PUT",
        credentials: "include", // cookie jwt requis, car route protege -> authenticateToken()
      });

      if (response.status === 401) {
        setNonConnecte(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // affichage du banner attestant que le panier est vide
      setPanierVide(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // on reset le panier de la page a un panier vide pour ne pas refetch le panier de l'utilisateur
      setPanier([]);
    } catch (error) {
      console.error("Erreur /paniers/viderPanier : ", error);
    }
  };

  return (
    <main className="container-fluid p-0">
      <HeaderComponent />

      {nonConnecte && (
        <div className="alert alert-warning text-center mx-5 my-3">
          <p className="mb-2">
            Vous devez être connecté pour accéder à votre panier.
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

      {panierVide && (
        <div className="alert alert-success text-center mx-5 my-3">
          <p className="mb-2">Panier vidé avec succès!.</p>
          <button
            className="btn btn-outline-dark"
            onClick={() => setPanierVide(false)}
          >
            Fermer
          </button>
        </div>
      )}

      <div className="my-3 text-start mx-5 p-1">
        <strong>Panier</strong>
      </div>
      <div className="row px-5 justify-content-left">
        <div className="card shadow-lg me-5 px-3 py-2">
          <div className="col-12 bg-white p-1 d-flex justify-content-left align-items-center">
            <div className="d-flex justify-content-left align-items-center col-5">
              Produits
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Prix
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Quantité
            </div>
            <div className="d-flex justify-content-left align-items-center col-2">
              Sous-Total
            </div>
            <div className="d-flex justify-content-left align-items-center col-1"></div>
          </div>
        </div>
      </div>
      <div
        className="overflow-auto overflow-x-hidden"
        style={{ height: "300px", scrollBehavior: "smooth" }}
      >
        {panier.map((produit) => (
          <div key={produit._id}>
            <AfficherProduit key={produit._id} produit={produit} />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-6 p-2 d-flex justify-content-start">
          {" "}
          <Link to="/">
            <button className="p-3 mx-5 w-50 btn btn-outline-dark">
              Ajouter d'autres produits au panier
            </button>
          </Link>
        </div>
        <div className="col-6 p-2 d-flex justify-content-end">
          {" "}
          <button
            className="p-3 mx-5 w-50 btn btn-outline-dark btn-panier"
            onClick={effacerPanier}
          >
            Vider le Panier
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div
            className="card shadow-lg mx-5 my-5 p-2"
            style={{ border: "1.5px solid black", backgroundColor: "white" }}
          >
            <p
              className="mx-3 my-1 p-1"
              style={{ fontWeight: "500", color: "#212529" }}
            >
              Total du Panier
            </p>
            <div className="px-3 col bg-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Sous-Total</div>
              <div className="d-flex align-items-end">
                {sousTotal.toFixed(2)} $
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "8px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Livraison</div>
              <div className="d-flex align-items-end text-success">Gratuit</div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "0px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Taxes</div>
              <div className="d-flex align-items-end">{taxes.toFixed(2)} $</div>
            </div>
            <div
              style={{
                borderTop: "1px solid black ",
                opacity: "0.5",
                marginTop: "0px", // Remonte la ligne vers le texte
                marginBottom: "0px",
                marginLeft: "12px",
              }}
            ></div>
            <div className="px-3 col bg-white p-2 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start gap-3">Total</div>
              <div className="d-flex align-items-end">{total.toFixed(2)} $</div>
            </div>
            <div className="bg-white d-flex justify-content-center">
              <button
                className="p-3 m-2 btn btn-outline-dark w-100"
                onClick={fairePaiement}
              >
                Procéder au Paiement
              </button>
            </div>
            {messageBouttonAcheter && (
              <p className="text-danger text-center">{messageBouttonAcheter}</p>
            )}
          </div>
        </div>
        <div className="col-6 my-5">
          <img
            src={logo}
            alt="user"
            width={650}
            height={110}
            className="my-5"
          ></img>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
