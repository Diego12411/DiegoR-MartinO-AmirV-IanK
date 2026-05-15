import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type AdminRouteProps = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const [chargement, setChargement] = useState(true);
  const [autorise, setAutorise] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:4000/utilisateurs/profil", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          navigate("/seConnecter");
          return;
        }

        if (data.role?.toLowerCase() !== "admin") {
          navigate("/compte");
          return;
        }

        setAutorise(true);
      })
      .catch((err) => {
        console.error(err);
        navigate("/seConnecter");
      })
      .finally(() => {
        setChargement(false);
      });
  }, [navigate]);

  if (chargement) {
    return <p className="text-center mt-5">Vérification des accès...</p>;
  }

  if (!autorise) {
    return null;
  }

  return <>{children}</>;
}
