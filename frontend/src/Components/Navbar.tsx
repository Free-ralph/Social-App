import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useStateContext } from "../context/StateContextProvider";
import { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStateContext } from "../context/AuthContextProvider";

type NavbarProps = {
  toggleChatsModal: () => void;
};

const Navbar = ({ toggleChatsModal }: NavbarProps) => {
  // const { logout } = useAuthStateContext();
  const { profileInfo } = useStateContext();
  const [openProfileNav, setOpenProfileNav] = useState(false);

  const handleOpenProfileNav = () => {
    setOpenProfileNav(true);
  };
  const handleCloseProfileNav = () => {
    setOpenProfileNav(false);
  };

  return (
    <div className="w-[95%] grid grid-cols-3 lg:grid-cols-2 mx-auto lg:h-[3.5rem] my-3 lg:mb-2">
      <div className="col-span-3 lg:col-span-1 flex justify-between h-[3rem]">
        <input
          type="text"
          placeholder={"#Explore"}
          className="w-[12rem] md:w-[15rem] p-2 lg:block text-gray-200 bg-secondary rounded-xl focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 "
        />
        <div className="flex lg:hidden gap-1">
          <div
            className="text-primary bg-secondary p-3 rounded-xl cursor-pointer flex justify-between items-center"
            onClick={toggleChatsModal}
          >
            <ChatIcon className="scale-[1.1]" />
          </div>
          <div
            onClick={handleOpenProfileNav}
            onMouseEnter={handleOpenProfileNav}
            onMouseLeave={handleCloseProfileNav}
            className="w-[3rem] rounded-xl bg-primary overflow-hidden cursor-pointer"
          >
            <img
              src={profileInfo?.profile_image}
              className="object-cover object-center w-full h-full"
            />
            <AnimatePresence>
              {openProfileNav && <ProfileNav />}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 hidden lg:flex justify-end my-auto gap-3 h-[3rem]">
        <div
          className="text-primary bg-secondary h-full px-3 flex rounded-xl cursor-pointer "
          onClick={toggleChatsModal}
        >
          <ChatIcon className="scale-[1.2] m-auto" />
        </div>
        <div
          className="w-[3rem] rounded-xl bg-primary mr-3 overflow-hidden cursor-pointer h-full"
          onClick={handleOpenProfileNav}
          onMouseEnter={handleOpenProfileNav}
          onMouseLeave={handleCloseProfileNav}
        >
          <img
            src={profileInfo?.profile_image}
            className="object-cover object-center w-full h-full"
          />
          <AnimatePresence>{openProfileNav && <ProfileNav />}</AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const ProfileNav = () => {
  const { logout } = useAuthStateContext();
  const { profileInfo } = useStateContext();
  return (
    <>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
        className=" z-[60] absolute flex flex-col justify-around px-3 py-3 right-[1rem] top-[4rem] w-[8rem] h-[5rem] bg-secondary border-primary border text-gray-200"
      >
        <Link
          to={`profile/${profileInfo?.id}`}
          className="cursor-pointer hover:text-primary transition delay-75 w-[90%]"
        >
          <AccountCircleIcon className="mr-2" />
          Profile
        </Link>
        <div
          onClick={logout}
          className="cursor-pointer hover:text-primary transition delay-75 w-[90%]"
        >
          <LogoutIcon className="mr-2" />
          Log out
        </div>
      </m.div>
    </>
  );
};
