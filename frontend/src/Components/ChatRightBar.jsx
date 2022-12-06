import React from "react";

const ChatRightBar = ({name, bio, followers, following, profile_image, cover_image, username}) => {
  return (
    <div className="w-[24%] hidden lg:block">
      <div className=" bg-secondary rounded-xl overflow-hidden">
        <div className="h-[8rem] bg-gray-500 w-full overflow-hidden">
          <img src={cover_image} className="h-full w-full object-cover" />
        </div>
        <div className="flex justify-between items-end translate-y-[-2rem]">
          <div className="text-center leading-none ml-3">
            <p className="font-bold text-gray-200">{followers?.length - 1}</p>
            <p className="text-gray-300">followers</p>
          </div>
          <div className="w-[6rem] h-[5rem] bg-orange-500 rounded-3xl border-2 overflow-hidden">
            <img
              src={profile_image}
              alt={`${name}-profile-pic`}
              className="text-gray-300 h-full w-full object-cover"
            />
          </div>
          <div className="text-center leading-none mr-3">
            <p className="font-bold text-gray-200">{following?.length - 1}</p>
            <p className="text-gray-300">following</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-100">{name}</p>
          <p className="text-gray-200">@{username}</p>
          <p className="mt-4 px-4 leading-tight text-gray-300 ">{bio}</p>
        </div>
        <div className="w-full my-3 px-2">
          {/* <Link to={`/profile/${id}`}>
            <Button type={2} text="My Profile" style="w-full py-2" />
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default ChatRightBar;
