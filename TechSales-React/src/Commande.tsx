import { useEffect } from "react";
import { HeaderComponent, FooterComponent } from "./main";
import { useNavigate } from "react-router";

export default function afficherConfirmationCommande() {
  // meme signature que declare dans server.ts/CORS sinon bug
  const API_DEFAULT = "http://127.0.0.1:4000";

  const navigate = useNavigate();

  useEffect(() => {
    // logiquement, pour arriver a cette page, c'est seulement apres avoir passe les connexion et le paiement
    const confirmerCommande = async () => {
      try {
        // verifier la presence du session_id Stripe dans l'URL : propre a Stripe
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (!sessionId) {
          navigate("/seConnecter"); // si pas de session successful apres paiement, on ne cree pas de commande
          return;
        }

        // theoriquement, l'utilisateur est toujours connecte a cette etape

        // on recupere le panier
        const responsePanier = await fetch(
          `${API_DEFAULT}/paniers/panierUtilisateur`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const itemsPanier = await responsePanier.json();

        // creation de la commande a partir du panier de l'utilsateur, tout se fait dans le backend
        const responseCommande = await fetch(
          `${API_DEFAULT}/commandes/creerCommande`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        // verification que la commande a bel et bien ete cree avant de vider le panier de l'utilisateur
        if (!responseCommande.ok) {
          console.error("Erreur lors de la creation de la commande");
          return;
        }

        // TODO [X] : actualiser l'inventaire a la suite de la creation de la commande
        // mettre a jour l'inventaire
        await Promise.all(
          itemsPanier.map(
            async (item: { produitId: string; quantite: number }) => {
              // recuperer le stock actuel
              const responseProduit = await fetch(
                `${API_DEFAULT}/produits/${item.produitId}`,
              );
              const produit = await responseProduit.json();

              // calculer le nouveau stock
              const nouveauStock = produit.stock - item.quantite;

              // mettre a jour le stock pour un produit dans le panier
              await fetch(`${API_DEFAULT}/produits/${item.produitId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: nouveauStock }),
              });
            },
          ),
        );

        // on vide le panier de l'utilisateur
        await fetch(`${API_DEFAULT}/paniers/viderPanier`, {
          method: "PUT",
          credentials: "include",
        });
      } catch (error) {
        console.error("Erreur de confirmation commande: ", error);
      }
    };

    confirmerCommande();
  }, []);

  // ===== Debut du developpement de la page details d'un produit =====
  return (
    <>
      <HeaderComponent />

      <main className="container-fluid p-0 d-flex justify-content-center align-items-center vh-100">
        <h1 className="text-center">Votre commande a été créée</h1>
      </main>

      <FooterComponent />
    </>
  );
}
