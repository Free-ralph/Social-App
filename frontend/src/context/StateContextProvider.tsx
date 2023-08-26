import { createContext, useContext, useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { severityType, ProfileInfoType, snackMessageType } from "../types/api";
import { useQuery } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuthStateContext } from "./AuthContextProvider";

type stateContextProps = {
  snackMessage: snackMessageType;
  handleSnackMessage: (message: string, severity: severityType) => void;
  isSnackOpen: boolean;
  handleCloseSnack: () => void;
  handleOpenSnack: () => void;
  profileInfo: ProfileInfoType | undefined;
  notificationSocket: W3CWebSocket | null;
};

type ContextProviderProps = {
  children: React.ReactNode;
};

const StateContext = createContext<stateContextProps | null>(null);

const StateContextProvider = ({ children }: ContextProviderProps) => {
  const { auth } = useAuthStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [snackMessage, setSnackMessage] = useState<snackMessageType>({
    message: "",
    severity: "success",
  });
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [notificationSocket, setNotificationSocket] =
    useState<W3CWebSocket | null>(null);

  const handleCloseSnack = () => {
    setIsSnackOpen(false);
  };
  const handleOpenSnack = () => {
    setIsSnackOpen(true);
  };

  const handleSnackMessage = (message: string, severity: severityType) => {
    setIsSnackOpen(true);
    setSnackMessage({
      message: message,
      severity: severity,
    });
  };

  const { data: profileInfo, refetch: refetchProfileInfo } = useQuery({
    queryKey: ["profileInfo"],
    queryFn: () =>
      axiosPrivate
        .get<ProfileInfoType>("chat/profile_info/")
        .then((res: any) => res.data),
  });

  useEffect(() => {
    refetchProfileInfo();
  }, [auth]);

  useEffect(() => {
    const server = "ws://127.0.0.1:8000/ws/chat/notification";
    const socket = new W3CWebSocket(server);
    socket.onopen = () => {
      setNotificationSocket(socket);
    };

    socket.onclose = () => {
      setNotificationSocket(null);
    };

    return () => socket.close();
  }, []);

  return (
    <StateContext.Provider
      value={{
        snackMessage,
        handleSnackMessage,
        isSnackOpen,
        handleCloseSnack,
        handleOpenSnack,
        profileInfo,
        notificationSocket,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

function useStateContext() {
  const context = useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error("useStateContext must be used within a StateContextProvider");
}
export { StateContextProvider, useStateContext };
