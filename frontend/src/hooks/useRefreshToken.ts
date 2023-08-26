import { useAuthStateContext } from "../context/AuthContextProvider"
import axios from "../api/axios"

const useRefreshToken = () => {
    const {auth, setAuth} = useAuthStateContext();

    const refresh = async () => {
        const response = await axios.post('/token/refresh', {
            refresh : auth?.refresh
        })
        setAuth(response.data)
        return response.data.access
    }
  return refresh
}

export default useRefreshToken