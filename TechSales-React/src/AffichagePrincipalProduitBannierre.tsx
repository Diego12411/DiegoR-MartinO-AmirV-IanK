import background from "./assets/background2.webp";

/**
 * =========================================================================================
 * BANNIÈRE PRINCIPALE - PAGE D’ACCUEIL PRODUITS (FRONTEND REACT)
 * -----------------------------------------------------------------------------------------
 * Description :
 * Ce composant affiche une bannière pleine largeur utilisée sur la page d’accueil.
 * Il sert de section d’introduction visuelle pour la boutique avec un message d’accueil.
 *
 * Fonctionnement :
 * - Affiche une image de fond en plein écran (background2.webp)
 * - Superpose un texte centré verticalement et horizontalement
 * - Utilise Bootstrap pour la mise en page
 *
 * UX / UI :
 * - Effet visuel immersif avec image de fond
 * - Texte centré au milieu de l’écran (100vh)
 * - Message d’accueil simple et marketing
 *
 * Contenu affiché :
 * - Titre principal : bienvenue sur la boutique
 * - Sous-titre : découverte des produits
 *
 * Remarques :
 * - Aucun état ni logique métier
 * - Composant purement statique (présentation)
 *
 * Auteur : Diego
 * =========================================================================================
 */

export const AffichagePrincipalProduitBanner = () => {
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
      <main className="container-fluid text-center px-0">
        <div className="row">
          <div className="col-12 vh-100 d-flex align-items-center justify-content-center flex-column">
            <h1 className="display-4 fw-bold text-white">
              Bienvenue sur notre boutique
            </h1>
            <p className="text-white">Découvrez nos meilleurs produits</p>
          </div>
        </div>
      </main>
    </div>
  );
};
