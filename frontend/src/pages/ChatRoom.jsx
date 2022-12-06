import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatLeftBar from "../Components/ChatLeftBar";
import ChatRightBar from "../Components/ChatRightBar";
import SendIcon from "@mui/icons-material/Send";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { AuthStateContext } from "../context/AuthProvider";
import { ThreeDots } from "react-loader-spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/ContextProvider";

const ChatRoom = () => {
  const { handleSnackMessage, profileInfo, notificationSocket } = useStateContext();
  const { id } = useParams();
  const { user } = AuthStateContext();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [socketClient, setSocketClient] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [profile, setProfile] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const roomName = [id, profileInfo.id].sort().join("");

  const handleMessage = (e) => {
    if (socketClient && message) {
      socketClient.send(
        JSON.stringify({
          type: "chat",
          action: "send_chat",
          data: {
            receiver_profile_id: id,
            content : message,
          },
        })
      );
      setMessage("");
    }
    setIsTyping(false);
  };

  const handleMessageChange = (e) => {
    if (socketClient) {
      if (e.target.value) {
        socketClient.send(
          JSON.stringify({
            type: "notification",
            action: "typing",
            typing: {
              status: true,
              user_id: user.id,
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
              user_id: user.id,
            },
          })
        );
      }
    }
    setMessage(e.target.value);
  };

  const getRooms = async () => {
    try {
      const response = await axiosPrivate.get(`/chat/rooms`);
      setRooms(response.data);
    } catch (e) {
      handleSnackMessage("somethong went wrong", "error");
    }
  };

  const getProfile = async () => {
    try {
      const response = await axiosPrivate.post(`chat/profile/${id}`, {
        type: "proifileID",
      });
      setProfile(response.data);
    } catch (error) {
      handleSnackMessage("somethong went wrong", "error");
    }
  };

  const getChat = async () => {
    try {
      const response = await axiosPrivate.get(`/chat/${roomName}`)
      setChats(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (profileInfo.id) {
      const server = `ws://127.0.0.1:8000/ws/chat/${roomName}/${profileInfo.id}/${id}`;
      const client = new W3CWebSocket(server);

      client.onopen = () => {
        setSocketClient(client);
        getChat()
      };
      client.onclose = () => {
        setSocketClient(null);
      };

      client.onmessage = (message) => {
        const response = JSON.parse(message.data);
        if (response.type === "chat") {
          setChats((prev) => [...prev, response.data]);
          setIsTyping(false);
          notificationSocket.send(JSON.stringify({
            'type' : 'chat_notification', 
            'receiver_id' : response.data?.receiver_profile_id
          }))
        }
        if (response.type === "notification") {
          if (response.action === "typing") {
            // since both the person typing and reciver are going to have messages echod back
            // we make the typing notification reflect on only the reciver by comparing the id of the typer and the
            // reciver
            response.typing.status
              ? setIsTyping(response.typing.user_id !== user.id)
              : setIsTyping(false);
          }
        }

        notificationSocket.onmessage = (message) => {
          const response = JSON.parse(message.data)
          if (response?.receiver_id == profileInfo.id) {
            getRooms()
          }
        }
        getRooms();
      };
      return () => client.close();
    }
  }, [id, profileInfo]);

  useEffect(() => {
    getRooms();
    getProfile();
  }, [id]);

  return (
    <div className="text-gray-300 flex w-full h-screen p-3 justify-between">
      <ChatLeftBar
        rooms={rooms}
        profileInfo={profileInfo}
        socketClient={socketClient}
      />
      <div className="w-[60%] lg:w-[50%] bg-secondary rounded-xl py-4 px-6 flex flex-col justify-between">
        <div className="flex items-center h-[10%]">
          <div className="bg-primary w-[3rem] h-[3rem] rounded-xl overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src={profile?.profile_image}
              alt={`${profile?.name}-proile picture`}
            />
          </div>
          <p className="font-bold ml-3">{profile?.name}</p>
        </div>
        <div className="border-1 border-alternate rounded-xl h-[88%] relative">
          <div className="absolute w-full bottom-3">
            <div>
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
                    className={`max-w-[47%] p-1 px-2 text-secondary ${
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
                    <ThreeDots
                      height="50"
                      width="50"
                      radius="4.5"
                      color="#fffd01"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full relative text-center">
              <textarea
                value={message}
                onChange={handleMessageChange}
                rows={1}
                className="p-2 border-1 w-[97%] h-full mr-1 text-gray-200 bg-secondary rounded-lg  border-gray-300"
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
        </div>
      </div>
      <ChatRightBar {...profile} />
    </div>
  );
};

export default ChatRoom;
