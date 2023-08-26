import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthType } from "../types/api";
import useLocalStorage from "../hooks/useLocalStorage";
// import jwtDecode from "jwt-decode";

type AuthContextProps = {
  children: React.ReactNode;
};

type AuthContextType = {
  auth: AuthType | null;
  // user: UserType | string | null;
  setAuth: React.Dispatch<any>;
  // setUser: React.Dispatch<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthContextProvider({ children }: AuthContextProps) {
  const navigate = useNavigate();
  const [auth, setAuth] = useLocalStorage<AuthType | null>("auth", null)

  function logout() {
    setAuth(null);
    // localStorage.removeItem('authToken');
    navigate("/login");
  }
  
  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthStateContext() {
  const context = useContext(AuthContext);

  if (context) {
    return context;
  }

  throw new Error("useStateContext must be used within a StateContextProvider");
}

export { useAuthStateContext, AuthContextProvider };
