import { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

const AuthContext = createContext()


const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => (localStorage?.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null))
  const [user, setUser] = useState(() => (localStorage?.getItem('authToken') ? jwtDecode(JSON.parse(localStorage.getItem('authToken')).access) : null))


  const logout = () => {
    setUser(null);
    setAuth(null);
    localStorage.removeItem('authToken');
    navigate('/login');

  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, setUser, user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthStateContext = () => useContext(AuthContext)
export default AuthProvider