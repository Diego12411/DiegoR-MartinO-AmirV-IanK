{
  /*source Card : https://getbootstrap.com/docs/4.0/components/card/
    source Flex : https://getbootstrap.com/docs/4.0/utilities/flex/ */
}

export default function Afficher() {
  return (
    <div
      className="rectangle"
      style={{ backgroundColor: "#372843", color: "white" }}
    >
      <main className="container-fluid text-center">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="row">
            <div className="col-12">
              <div
                className="card p-5"
                style={{ backgroundColor: "#f3efef", color: "white" }}
              >
                <h3 className="card-title text-dark">
                  Créez votre Compte TechSales
                </h3>
                <div className="card m-4 mx-5 p-3">
                  <div className="form-group text-start">
                    <label>Nom:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Nom"
                      placeholder="Entrez votre Nom"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Prénom:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Prénom"
                      placeholder="Entrez votre Prénom"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Email"
                      placeholder="Entrez votre Email"
                    ></input>
                    <br />
                  </div>
                  <div className="form-group text-start">
                    <label>Mot de Passe:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="MotDePasse"
                      placeholder="Entrez un mot de passe"
                    ></input>
                    <br />
                  </div>
                  <button type="button" className="btn btn-dark">
                    Créer Mon Compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
