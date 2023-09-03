import { Link } from "react-router-dom";
import { useStateContext } from "../context/StateContextProvider";
import Button from "./Button";
import { OvalSpinner } from "./Spinner";
import { useState } from "react";

const LeftSidebar = () => {
  const { profileInfo } = useStateContext();
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false);
  const [isCoverImageLoaded, setIsCoverImageLoaded] = useState(false);
  return (
    <div className="h-screen  md:w-[24%] p-1 lg:block sticky top-3">
      <div className=" bg-secondary rounded-xl overflow-hidden">
        <div className="h-[8rem] bg-gray-500 w-full overflow-hidden">
          <div
            className={`${
              isCoverImageLoaded && "hidden"
            } h-full w-full flex items-center justify-center`}
          >
            <OvalSpinner width="25" height="25" />
          </div>
          <img
            src={profileInfo?.cover_image}
            onLoad={() => setIsCoverImageLoaded(true)}
            className={`h-full w-full object-cover ${
              !isCoverImageLoaded && "hidden"
            }`}
          />
        </div>
        <div className="flex justify-between items-end translate-y-[-2rem]">
          <div className="text-center leading-none ml-3">
            <p className="font-bold text-gray-200">
              {profileInfo && profileInfo.followersCount - 1}
            </p>
            <p className="text-gray-300">followers</p>
          </div>
          <div className="w-[6rem] h-[5rem] bg-primary rounded-3xl border-2 overflow-hidden">
            <div
              className={`${
                isProfileImageLoaded && "hidden"
              } h-full w-full flex items-center justify-center`}
            >
              <OvalSpinner width="25" height="25" color="#282828" />
            </div>
            <img
              src={profileInfo?.profile_image}
              onLoad={() => setIsProfileImageLoaded(true)}
              alt={`${profileInfo?.name}-profile-pic`}
              className={`text-gray-300 h-full w-full object-cover ${
                !isProfileImageLoaded && "hidden"
              }`}
            />
          </div>
          <div className="text-center leading-none mr-3">
            <p className="font-bold text-gray-200">
              {profileInfo && profileInfo.followingCount - 1}
            </p>
            <p className="text-gray-300">following</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-100">{profileInfo?.name}</p>
          <p className="text-gray-200">@{profileInfo?.username}</p>
          <p className="mt-4 px-4 leading-tight text-gray-300 ">
            {profileInfo?.bio}
          </p>
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

export default LeftSidebar;
