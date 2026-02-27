import logo from "./assets/logo.png";

export default function SeConnecter() {
  return (
    <div className="rectangle" style={{ backgroundColor: "#40365a" }}>
      <main className="container-fluid text-center">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="row">
            <div className="col-12 my-3 p-5">
              <div
                className="card shadow-lg p-3"
                style={{ backgroundColor: "#f3efef" }}
              >
                <div className="text-start">
                  <img src={logo} alt="logo" width={200} height={35} />

                  <h2
                    style={{
                      marginTop: "20px",
                      marginLeft: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Se Connecter
                  </h2>
                </div>

                <div className="form-group text-start">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez votre Email"
                  />
                  <br />
                </div>

                <div className="form-group text-start">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Entrez votre mot de passe"
                  />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
