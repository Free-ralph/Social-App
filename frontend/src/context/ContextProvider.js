import { createContext, useContext, useState, useEffect } from "react";
import { AuthStateContext } from "./AuthProvider";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { w3cwebsocket as W3CWebSocket } from "websocket";



const StateContext = createContext()
const ContextProvider = ({ children }) => {
  const { user } = AuthStateContext()
  const [snackMessage, setSnackMessage] = useState('')
  const [isSnackOpen, setIsSnackOpen] = useState(false)
  const [profileInfo, setProfileInfo] = useState({})
  const [notificationSocket, setNotificationSocket] = useState()
  const axiosPrivate = useAxiosPrivate()
  const handleCloseSnack = () => {
    setIsSnackOpen(false)
  }
  const handleOpenSnack = () => {
    setIsSnackOpen(true)
  }

  const handleSnackMessage = (message, severity) => {
    setIsSnackOpen(true)
    setSnackMessage({
      message: message,
      severity: severity
    })
  }
  const getUserProile = async () => {
    if (user) {
      try {
        const response = await axiosPrivate.post(`/chat/profile/${user.id}`,
          {
            type: 'userID'
          })
        setProfileInfo(response.data)
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    const server = 'ws://127.0.0.1:8000/ws/chat/notification';
    const socket = new W3CWebSocket(server)
    socket.onopen = () => {
      setNotificationSocket(socket)
    }

    socket.onclose = () => {
      console.log('disconnected')
      setNotificationSocket(null)
    }

    return () => socket.close()
  }, [])

  useEffect(() => {
    getUserProile();
  }, [user])
  return (
    <StateContext.Provider value={{
      snackMessage,
      handleSnackMessage,
      isSnackOpen,
      handleCloseSnack,
      handleOpenSnack,
      profileInfo,
      getUserProile,
      notificationSocket,
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
export default ContextProvider