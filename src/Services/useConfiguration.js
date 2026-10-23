import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// Lecture et modification de la configuration globale (super admin)
export default function useConfiguration() {
  const [config, setConfig] = useState(null);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState("");

  useEffect(() => {
    api("/super-admin/configuration").then(setConfig).catch((e) => setErreur(e.message));
  }, []);

  const changer = useCallback(async (champ, valeur) => {
    const avant = config;
    setConfig((c) => ({ ...c, [champ]: valeur }));
    setEnCours(champ);
    setErreur("");
    try {
      setConfig(await api("/super-admin/configuration", { method: "PUT", body: { [champ]: valeur } }));
    } catch (err) {
      setConfig(avant);
      setErreur(err.message);
    } finally {
      setEnCours("");
    }
  }, [config]);

  return { config, erreur, enCours, changer };
}
