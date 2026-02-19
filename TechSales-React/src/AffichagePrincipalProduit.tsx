function CarteProduit() {
  return (
    <div className="col mb-4">
      <div className="card shadow border-dark bg-light col p-0">
        <div className="card-body text-dark">
          <img
            className="card-img-top"
            src="../Images/ProduitSansImage.png"
            alt="Image"
          ></img>
          <a href="#" className="btn btn-transparent p-0 fw-bold text-primary">
            Nom de produit
          </a>
          <div className="me-2">
            <p className="text-dark card-text">999.99$</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffichagePrincipalProduit() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <nav className="navbar bg-primary ps-2 pe-2" data-bs-theme="dark">
            <a href="#" className="navbar-brand">
              Navigation
            </a>
          </nav>
        </div>
        <div className="m-5 bg-transparent">
          <div className="row">
            <div className="card shadow-lg bg-dark bg-gradient col p-0">
              <div className="row card-body text-dark">
                <div className="col-9">
                  <h5 className="text-light">Nom de Produit</h5>
                  <h1 className="text-light">9999.99$</h1>
                </div>
                <div className="col">
                  <img
                    className="img-fluid"
                    src="../Images/ProduitSansImage.png"
                    alt="Image"
                  ></img>
                </div>
                <a href="#" className="text-light">
                  Magasinez maintenant →
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-8">
              <p className="fw-bold">█ Nos produits</p>
            </div>
            <div className="col d-flex justify-content-end">
              <button className="btn btn-light rounded-circle text-dark m-1">
                ←
              </button>
              <button className="btn btn-light rounded-circle text-dark m-1">
                →
              </button>
            </div>
            <h3>Explorez nos produits</h3>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
            <CarteProduit />
          </div>
        </div>
        <div className="row">
          <footer className="bg-primary text-white mt-5 p-5">
            <div className="container">
              <p className="text-center mb-0">&copy; TECHSALES</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
