import { HeaderComponent } from "./main";
import { FooterComponent } from "./main";
import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function afficherPanier() {
  return (
    <main className="container-fluid text-center p-0">
      <HeaderComponent />
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="row">
          <div className="col-1">
            <div
              className="card shadow-lg p-3"
              style={{ backgroundColor: "#f3efef", color: "white" }}
            ></div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </main>
  );
}
