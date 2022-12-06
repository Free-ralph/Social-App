import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Button from "./Button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import MonochromePhotosOutlinedIcon from "@mui/icons-material/MonochromePhotosOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { AnimatePresence, motion } from "framer-motion";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { AuthStateContext } from "../context/AuthProvider";
import { useStateContext } from "../context/ContextProvider";

const Navbar = () => {
  const { logout } = AuthStateContext();
  const { profileInfo } = useStateContext();
  const [dropDown, setDropDown] = useState(false);
  const [logDropDown, setLogDropDown] = useState(false);
  const navContent = [
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
        <span className="rounded-xl text-xs text-secondary px-2 flex items-center justify-center w-[2rem]">
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
    {
      title: "Freind Reqeusts",
      icon: <PeopleOutlineIcon />,
      link: "",
      badge: "",
    },
  ];
  const inActiveNav =
    "p-4 text-gray-200 w-[25%] text-center hover:text-gray-400 cursor-pointer";
  const activeNav =
    "p-4 text-gray-200 w-[25%] text-center hover:text-gray-400 cursor-pointer";
  return (
    <div className="w-[95%] m-auto h-[10vh] flex justify-between mb-3 items-center">
      <input
        type="text"
        placeholder={"#Explore"}
        className="p-2 w-[13rem] h-[60%] hidden lg:block text-gray-200 bg-secondary rounded-xl focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 "
      />
      <div className="flex flex-row px-1 bg-secondary rounded-xl">
        {navContent.map((item, i) => (
          <NavLink
            to={item.link}
            className={({ isActive }) => (isActive ? activeNav : inActiveNav)}
            key={i}
          >
            {item.icon}
          </NavLink>
        ))}
        <div className="p-4 text-gray-200 w-[25%] text-center hover:bg-purple-200 hover:border-purple-500 cursor-pointer">
          <MenuIcon />
        </div>
      </div>
      <div className="w-[13rem] hidden lg:block h-[60%] bg-secondary rounded-xl z-50">
        <div
          className="text-gray-200 flex w-full h-full items-center text-sm"
          onClick={() => setDropDown((prev) => !prev)}
        >
          <div className="w-[3rem] h-[90%] rounded-xl bg-primary mr-3">
            <img src={profileInfo?.profile_image} className = "object-cover object-center w-full h-full" />
          </div>
          <span className="cursor-pointer">
            {profileInfo?.name || profileInfo?.username}{" "}
            {!dropDown ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          </span>
        </div>
        <AnimatePresence>
          {dropDown && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                delay: 0,
              }}
              className="w-full p-3 rounded-xl mt-2 bg-secondary border-1 border-primary text-gray-200"
            >
              <div
                className="w-[50%] text-center m-auto flex justify-between cursor-pointer"
                onClick={() => setLogDropDown((prev) => !prev)}
              >
                <LogoutIcon /> Logout
              </div>
              {logDropDown && (
                <motion.div
                  initial={{
                    height: 0,
                  }}
                  animate={{
                    height: "fit-content",
                  }}
                  className="w-[90%] m-auto flex justify-between my-2"
                >
                  <span onClick={logout}>
                    <Button text="confirm" style={"py-1 px-2"} type={1} />
                  </span>
                  <span onClick={() => setLogDropDown(false)}>
                    <Button text="cancel" style={"py-1 px-2"} type={2} />
                  </span>
                </motion.div>
              )}
              <Link to = {`/profile/${profileInfo?.id}`} className="w-[50%] mt-3 text-center m-auto flex justify-between cursor-pointer">
                <AccountBoxIcon /> Profile
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
