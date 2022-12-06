import { useState, useEffect } from "react";
import { NavLin, Link } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import MonochromePhotosOutlinedIcon from "@mui/icons-material/MonochromePhotosOutlined";
import { useStateContext } from "../context/ContextProvider";
import Button from "./Button";


const sidebarNav = [
  {
    title: "Profile",
    icon: <PersonOutlineOutlinedIcon />,
    link: "/profile",
    badge: "",
  },
  {
    title: "Feed",
    icon: <NewspaperOutlinedIcon />,
    link: "/feed",
    badge: "",
  },
  {
    title: "People",
    icon: <AccountBoxOutlinedIcon />,
    link: "/People",
    badge: (
      <span className="rounded-xl text-xs bg-purple-500 text-white px-2 flex items-center justify-center w-[2rem]">
        8
      </span>
    ),
  },
  {
    title: "Photos",
    icon: <MonochromePhotosOutlinedIcon />,
    link: "/Photos",
    badge: "",
  },
];

const Sidebar = () => {
  const { profileInfo } = useStateContext();
  return (
    <div className="h-screen md:w-[24%] p-1 hidden lg:block sticky top-3">
      <div className=" bg-secondary rounded-xl overflow-hidden">
        <div className="h-[8rem] bg-gray-500 w-full overflow-hidden">
          <img src={profileInfo?.cover_image} className="h-full w-full object-cover" />
        </div>
        <div className="flex justify-between items-end translate-y-[-2rem]">
          <div className="text-center leading-none ml-3">
            <p className="font-bold text-gray-200">{profileInfo?.followers?.length - 1}</p>
            <p className="text-gray-300">followers</p>
          </div>
          <div className="w-[6rem] h-[5rem] bg-orange-500 rounded-3xl border-2 overflow-hidden">
            <img
              src={profileInfo?.profile_image}
              alt={`${profileInfo?.name}-profile-pic`}
              className="text-gray-300 h-full w-full object-cover"
            />
          </div>
          <div className="text-center leading-none mr-3">
            <p className="font-bold text-gray-200">{profileInfo?.following?.length - 1}</p>
            <p className="text-gray-300">following</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-100">{profileInfo?.name}</p>
          <p className="text-gray-200">@{profileInfo?.username}</p>
          <p className="mt-4 px-4 leading-tight text-gray-300 ">{profileInfo?.bio}</p>
        </div>
        <div className="w-full my-3 px-2">
          <Link to={`/profile/${profileInfo?.id}`}>
            <Button type={2} text="My Profile" style="w-full py-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
