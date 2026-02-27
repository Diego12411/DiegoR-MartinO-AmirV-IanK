import logo from "./assets/logo.png";
import "./SeConnecter.css";

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
                <br />
                <div className="d-flex flex-column align-items-center gap-4">
                  <input
                    type="email"
                    className="seconnecter-input"
                    placeholder="Entrez votre Email"
                  />
                  <input
                    type="password"
                    className="seconnecter-input"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
