import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import ChatCard from "./ChatCard";

const ChatLeftBar = ({ profileInfo, rooms, socketClient }) => {

  return (
    <div className="w-[40%] lg:w-[24%] p-4">
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
        <span className="cursor-pointer text-primary mr-3">
          <CreateIcon />
        </span>
      </div>
      <div className="mt-6 h-[3rem] flex overflow-hidden bg-secondary rounded-xl p-1">
        <input
          type="text"
          className="p-2 w-[87%] h-full text-gray-200 bg-secondary"
          placeholder="Search Friends"
        />
        <p className="w-[13%] h-full flex justify-center items-center cursor-pointer text-primary hover:opacity-70 transition-all delay-75">
          <SearchIcon />
        </p>
      </div>
      <div className="mt-5">
        {rooms.map((room, index) => (
          <ChatCard {...room} key={index} socketClient = {socketClient} />
        ))}
      </div>
    </div>
  );
};

export default ChatLeftBar;
