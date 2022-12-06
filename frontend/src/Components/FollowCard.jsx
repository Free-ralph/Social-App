import React from "react";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/ContextProvider";
import { AuthStateContext } from "../context/AuthProvider";

const FollowCard = ({ follower, name, author, id, getProfile, authorID, profile_image }) => {
  const { handleSnackMessage, getUserProile } = useStateContext();
  const { user } = AuthStateContext();
  const axiosPrivate = useAxiosPrivate();
  const handleUnFollow = async () => {
    try {
      const response = await axiosPrivate.get(`social/unfollow/${id}`);
      handleSnackMessage("profile unfollowed", "success");
      getProfile();
      getUserProile();
    } catch (error) {
      handleSnackMessage("Something went wrong", "error");
    }
  };

  const handleRemoveFollower = async () => {
    try {
      const response = await axiosPrivate.get(`social/remove/${id}`);
      handleSnackMessage("profile unfollowed", "success");
      getProfile();
      getUserProile();
    } catch (error) {
      handleSnackMessage("Something went wrong", "error");
    }
  };
  return (
    <div className=" bg-secondary rounded p-1 items-center">
      <div className="flex flex-row border-2 border-alternate p-2 rounded-xl justify-between items-center">
        <div className="flex">
          <div className="h-[3rem] bg-orange-500 w-[4rem] rounded-xl ml-3 mr-2 overflow-hidden">
            <img src={profile_image} className = 'h-full w-full object-cover object-center' />
          </div>
          <div className="text-gray-200 flex flex-col">
            <span className="font-bold text-sm text-gray-100">{name}</span>
            <span className="text-gray-400">@{author?.username}</span>
          </div>
        </div>
        <div>
          {user?.id === authorID &&
            (follower ? (
              <div className="" onClick={handleRemoveFollower}>
                <PersonRemoveIcon />
              </div>
            ) : (
              <div className="" onClick={handleUnFollow}>
                <RemoveCircleOutlineIcon />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
