import React from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const ChatCard = ({profileID, id , name, unread_message_count, profile_image, members, last_message, socketClient }) => {
  const navigate = useNavigate()
  const paramID = useParams()
  const handleOpenChat = () => {
    if (socketClient) {
      socketClient.send(JSON.stringify({
        type : 'chat', 
        action : 'read_all_messages', 
        data : {
          message_id : id,
        }
      }))
    }
    navigate(`/chat/${profileID}`)
  }
  return (
    <div 
      onClick={handleOpenChat} 
      className={`flex mt-6 items-center cursor-pointer border-2 ${paramID?.id == profileID ? 'border-primary' : 'border-alternate hover:border-gray-400'} p-3 rounded-xl transition-all delay-75`}>
      <div className="flex items-center">
        <div className="bg-primary h-[3rem] w-[3rem] rounded-xl mr-2 overflow-hidden">
          <img src = {profile_image} className = 'w-full h-full object-center object-cover' />
        </div>
        <div className="w-[75%]">
          <p className="font-bold text-purple-300 ">{name}</p>
          <p className="text-sm leading-tight mt-1">
            {last_message}
          </p>
        </div>
      </div>
      {unread_message_count != 0 && (
        <div className="bg-purple-600 rounded w-[1.1rem] h-[1.1rem] flex justify-center items-center p-1">
          <span className="font-bold text-xs">{unread_message_count}</span>
        </div>
      )}
    </div>
  );
};

export default ChatCard;
