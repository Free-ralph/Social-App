import { AuthStateContext } from "../context/AuthProvider"
import axios from "../api/axios"
import jwtDecode from "jwt-decode"

const useRefreshToken = () => {
    const { setAuth, setUser, auth} = AuthStateContext()

    const refresh = async () => {
        const response = await axios.post('/token/refresh', {
            refresh : auth.refresh
        })
        localStorage.setItem('authToken', JSON.stringify(response.data))
        setAuth(response.data)
        setUser(jwtDecode(response.data.access))
        return response.data.access
    }
  return refresh
}

export default useRefreshToken