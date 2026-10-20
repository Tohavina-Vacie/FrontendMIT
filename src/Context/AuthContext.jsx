import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const ROLES_ADMIN = ["admin", "super_admin"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [chargement, setChargement] = useState(!!localStorage.getItem("token"));

  const sauver = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, mot_de_passe) => {
    const data = await api("/users/login", {
      method: "POST",
      body: { email, mot_de_passe },
    });
    localStorage.setItem("token", data.token);
    sauver(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Vérifie le token au chargement et à chaque expiration
  useEffect(() => {
    if (localStorage.getItem("token")) {
      api("/users/me")
        .then(sauver)
        .catch(() => {})
        .finally(() => setChargement(false));
    }
    window.addEventListener("auth:expire", logout);
    return () => window.removeEventListener("auth:expire", logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        chargement,
        login,
        logout,
        majUser: sauver,
        estAdmin: !!user && ROLES_ADMIN.includes(user.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
