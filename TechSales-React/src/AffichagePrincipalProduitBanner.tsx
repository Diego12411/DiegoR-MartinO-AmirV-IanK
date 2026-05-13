import background from "./assets/background2.webp";

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
