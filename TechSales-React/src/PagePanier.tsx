import { Link } from "react-router";

export default function PagePanier() {
  return (
    <>
      <h1>Hello!!</h1>
      <button type="button" className=" col btn btn-dark">
        <Link to="/detailsProduit" className="text-white">
          Retour details produit
        </Link>
      </button>
    </>
  );
}
