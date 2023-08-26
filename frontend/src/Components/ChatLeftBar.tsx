import SearchIcon from "@mui/icons-material/Search";
import ChatCard from "./ChatCard";
import { ProfileInfoType, RoomType } from "../types/api";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { motion as m } from "framer-motion";
import { DrawerVariant } from "./AnimationVariants";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

type ChatLeftBarType = {
  handleCloseNav: () => void;
  rooms: RoomType[] | undefined;
  profileInfo: ProfileInfoType | undefined;
  socketClient: W3CWebSocket | null;
  isLoadingRooms: boolean;
};

const ChatLeftBar = ({
  profileInfo,
  rooms,
  socketClient,
  handleCloseNav,
  isLoadingRooms,
}: ChatLeftBarType) => {
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [searchInput, setsearchInput] = useState("");
  const navigate = useNavigate();
  const SearchNotes = () => {
    setFilteredRooms(
      rooms?.filter(
        (room) =>
          searchInput === "" ||
          room.member_name
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    SearchNotes();
  }, [searchInput]);

  return (
    <div className="hidden md:block w-[40%] lg:w-[24%] p-4">
      <div className="flex justify-between">
        <div className="flex">
          <div className="bg-primary h-[4rem] w-[4rem] rounded-xl mr-2">
            <img
              className="w-full h-full object-cover object-center"
              src={profileInfo?.profile_image}
              alt={`${profileInfo?.name}-proile picture`}
            />
          </div>
          <div className="mt-2">
            <p className="font-bold text-purple-300 "> {profileInfo?.name} </p>
            <p>Software developer</p>
          </div>
        </div>
        <span
          className="cursor-pointer text-primary mr-3"
          onClick={() => navigate("/")}
        >
          <HomeIcon />
        </span>
      </div>
      <div className="mt-6 h-[3rem] flex overflow-hidden bg-secondary rounded-xl p-1">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setsearchInput(e.target.value)}
          className="p-2 w-[87%] h-full text-gray-200 bg-secondary"
          placeholder="Search Chats"
        />
        <p className="w-[13%] h-full flex justify-center items-center text-primary ">
          <SearchIcon />
        </p>
      </div>
      {isLoadingRooms ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-5">
          {filteredRooms?.map((room, index) => (
            <ChatCard
              handleCloseNav={handleCloseNav}
              {...room}
              key={index}
              socketClient={socketClient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MobileChatLeftBar = ({
  profileInfo,
  rooms,
  socketClient,
  handleCloseNav,
  isLoadingRooms,
}: ChatLeftBarType) => {
  const navigate = useNavigate();
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [searchInput, setsearchInput] = useState("");

  const SearchNotes = () => {
    setFilteredRooms(
      rooms?.filter(
        (room) =>
          searchInput === "" ||
          room.member_name
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    SearchNotes();
  }, [searchInput]);
  return (
    <m.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={DrawerVariant}
      className="md:hidden w-[17rem] p-4 absolute top-0 left-0 bg-secondary z-50 border h-full"
    >
      <div className="flex justify-between items-center">
        <div className="flex">
          <div className="bg-primary h-[3rem] w-[3rem] rounded-xl mr-2">
            <img
              className="w-full h-full object-cover object-center"
              src={profileInfo?.profile_image}
              alt={`${profileInfo?.name}-proile picture`}
            />
          </div>
          <div className="mt-2">
            <p className="font-bold text-purple-300 "> {profileInfo?.name} </p>
            <p>Software developer</p>
          </div>
        </div>
        <span
          className="cursor-pointer text-primary mr-1"
          onClick={handleCloseNav}
        >
          <CloseIcon />
        </span>
      </div>
      <div
        className="w-full  py-3 mt-3 border-primary border rounded-md flex justify-center items-center hover:text-primary transition-all delay-75"
        onClick={() => {
          navigate("/");
        }}
      >
        <HomeIcon /> Home{" "}
      </div>
      <div className="mt-6 h-[3rem] flex overflow-hidden bg-secondary rounded-xl p-1">
        <input
          type="text"
          className="p-2 w-[87%] h-full text-gray-200 bg-secondary"
          placeholder="Search Friends"
          value={searchInput}
          onChange={(e) => setsearchInput(e.target.value)}
        />
        <p className="w-[13%] h-full flex justify-center items-center text-primary ">
          <SearchIcon />
        </p>
      </div>
      {isLoadingRooms ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-5">
          {filteredRooms?.map((room, index) => (
            <ChatCard
              handleCloseNav={handleCloseNav}
              {...room}
              key={index}
              socketClient={socketClient}
            />
          ))}
        </div>
      )}
    </m.div>
  );
};

export { ChatLeftBar, MobileChatLeftBar };
