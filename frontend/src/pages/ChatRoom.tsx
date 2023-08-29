import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatLeftBar, MobileChatLeftBar } from "../Components/ChatLeftBar";
import ChatRightBar from "../Components/ChatRightBar";
import SendIcon from "@mui/icons-material/Send";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { ProfileInfoType, RoomType, chatType } from "../types/api";
import { useMutation, useQuery } from "react-query";
import { motion as m, AnimatePresence } from "framer-motion";
import { SlideVariant } from "../Components/AnimationVariants";
import Spinner from "../Components/Spinner";
import MenuIcon from "@mui/icons-material/Menu";

const ChatRoom = () => {
  const { handleSnackMessage, profileInfo, notificationSocket } =
    useStateContext();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<chatType[]>([]);
  const [socketClient, setSocketClient] = useState<W3CWebSocket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const roomName = [id, profileInfo?.id].sort().join("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [openNav, setOpenNav] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current?.scrollHeight;
    }
  };

  const toggleOpenNav = () => {
    setOpenNav(!openNav);
  };
  const handleCloseNav = () => {
    setOpenNav(false);
  };

  const handleMessage = () => {
    if (socketClient && message) {
      socketClient.send(
        JSON.stringify({
          type: "chat",
          action: "send_chat",
          data: {
            receiver_profile_id: id,
            content: message,
          },
        })
      );
      setMessage("");
    }
    setIsTyping(false);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (socketClient) {
      if (e.target.value) {
        socketClient.send(
          JSON.stringify({
            type: "notification",
            action: "typing",
            typing: {
              status: true,
              user_id: profileInfo?.id,
            },
          })
        );
      } else {
        socketClient.send(
          JSON.stringify({
            type: "notification",
            action: "typing",
            typing: {
              status: false,
              user_id: profileInfo?.id,
            },
          })
        );
      }
    }
    setMessage(e.target.value);
  };

  const {
    data: rooms,
    refetch: getRooms,
    isLoading: isLoadingRooms,
  } = useQuery({
    queryFn: () =>
      axiosPrivate.get<RoomType[]>(`/chat/rooms`).then((res) => res.data),
    onError: () => {
      handleSnackMessage("failed to fetch rooms", "error");
    },
  });

  const { data: profile, mutate: getProfile } = useMutation({
    mutationFn: () =>
      axiosPrivate
        .get<ProfileInfoType>(`chat/profile_info/${id}`)
        .then((res) => res.data),
    onError: () => {
      handleSnackMessage("failed to fetch profile", "error");
    },
  });

  const getChat = async () => {
    try {
      const response = await axiosPrivate.get(`/chat/${roomName}`);
      setChats(response.data);
    } catch (e) {
      handleSnackMessage("failed to fetch chats", "error");
    }
  };
  useEffect(() => {
    if (profileInfo?.id) {
      const server = `ws://${window.location.host}/ws/chat/${roomName}/${profileInfo.id}/${id}`;
      const client = new W3CWebSocket(server);

      client.onopen = () => {
        setSocketClient(client);
        getChat();
      };
      client.onclose = () => {
        setSocketClient(null);
      };

      client.onmessage = (message) => {
        const data: any = message.data;
        const response = JSON.parse(data);

        if (response?.type === "chat") {
          setChats((prev) => [...prev, response.data]);
          setIsTyping(false);
          notificationSocket?.send(
            JSON.stringify({
              type: "chat_notification",
              receiver_id: response.data?.receiver_profile_id,
            })
          );
        }
        if (response.type === "notification") {
          if (response.action === "typing") {
            // since both the person typing and reciver are going to have messages echod back
            // we make the typing notification reflect on only the reciver by comparing the id of the typer and the
            // reciver
            setIsTyping(response.typing.user_id !== profileInfo?.id);
            if (response.typing.user_id !== profileInfo?.id) {
              scrollToBottom();
            }
          }
        }

        if (notificationSocket) {
          notificationSocket.onmessage = (message: any) => {
            const response = JSON.parse(message.data);
            if (response?.receiver_id == profileInfo?.id) {
              getRooms();
            }
          };
        }

        getRooms();
      };
      return () => client.close();
    }
  }, [id, profileInfo]);

  useEffect(() => {
    getRooms();
    getProfile();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className="text-gray-300 flex w-full h-screen p-3 justify-between relative overflow-hidden">
      <ChatLeftBar
        handleCloseNav={handleCloseNav}
        isLoadingRooms={isLoadingRooms}
        rooms={rooms}
        profileInfo={profileInfo}
        socketClient={socketClient}
      />

      <AnimatePresence>
        {openNav && (
          <>
            <MobileChatLeftBar
              isLoadingRooms={isLoadingRooms}
              rooms={rooms}
              profileInfo={profileInfo}
              socketClient={socketClient}
              handleCloseNav={handleCloseNav}
            />
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleCloseNav}
              className="absolute top-0 right-0 bg-black w-screen h-screen z-10 "
            ></m.div>
          </>
        )}
      </AnimatePresence>

      {!profile ? (
        <div className="flex justify-center w-full h-full items-center">
          <Spinner />
        </div>
      ) : (
        <m.div
          variants={SlideVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full md:w-[75%] h-full flex justify-between overflow-hidden"
        >
          <div className="w-full lg:w-[62%] bg-secondary rounded-xl py-4 px-6 flex flex-col justify-between">
            <div className="flex items-center h-[10%] justify-between">
              <div className="flex gap-1 items-center">
                <div className="bg-primary w-[3rem] h-[3rem] rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={profile?.profile_image}
                    alt={`${profile?.name}-proile picture`}
                  />
                </div>
                <p className="font-bold ml-3">{profile?.name}</p>
              </div>
              <span
                className="cursor-pointer hover:text-primary transition-all delay-75 md:hidden"
                onClick={toggleOpenNav}
              >
                <MenuIcon className="scale-[1.3]" />
              </span>
            </div>
            <div
              className="border-1 border-alternate rounded-xl h-[88%] relative overflow-y-scroll my-5"
              ref={chatContainerRef}
            >
              <div className="absolute w-full h-full">
                <div className="h-full">
                  {chats.map((chat, i) => (
                    <div
                      className={`w-full font-semibold flex ${
                        chat.receiver_profile_id != profileInfo?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                      key={i}
                    >
                      <p
                        className={`max-w-[80%] p-1 px-2 text-secondary ${
                          chat.receiver_profile_id != profileInfo?.id
                            ? "bg-primary rounded-br-[0]"
                            : "bg-purple-400 rounded-bl-[0]"
                        }  rounded-xl my-1 mx-2 text-start`}
                      >
                        {chat.content}
                      </p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="w-full justify-start">
                      <div className="w-fit rounded-xl px-4">
                        <Spinner />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full relative text-center">
              <textarea
                value={message}
                onChange={handleMessageChange}
                rows={1}
                className="p-2 border-1 w-[97%] h-[3rem] mr-1 text-gray-200 bg-secondary rounded-lg  border-gray-300"
                placeholder="Write something"
              />
              <span
                className="absolute right-7 bottom-4 text-primary cursor-pointer hover:opacity-[0.7] transition-all delay-75"
                onClick={handleMessage}
              >
                <SendIcon />
              </span>
            </div>
          </div>
          <ChatRightBar {...profile} />
        </m.div>
      )}
    </div>
  );
};

export default ChatRoom;
