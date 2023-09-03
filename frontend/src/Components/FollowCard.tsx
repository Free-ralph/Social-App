import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { authorType } from "../types/api";
import { useMutation, useQueryClient } from "react-query";
import Spinner, { OvalSpinner } from "./Spinner";
import { useState } from "react";

type FollowCardProps = {
  follower: boolean;
  name: string;
  author: authorType;
  id: number;
  profile_image: string;
  profileID: number;
};
const FollowCard = ({
  follower,
  name,
  author,
  id,
  profileID,
  profile_image,
}: FollowCardProps) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage, profileInfo } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false);

  const { mutate: unFollow, isLoading: isUnFollowing } = useMutation({
    mutationFn: () => axiosPrivate.get(`social/unfollow/${id}`),
    onSuccess: () => {
      handleSnackMessage("profile unfollowed", "success");
      queryClient.invalidateQueries("profile");
      queryClient.invalidateQueries("profileInfo");
    },
    onError: () => {
      handleSnackMessage("Something went wrong", "error");
    },
  });

  const { mutate: removeFollower, isLoading: isRemovingFollower } = useMutation(
    {
      mutationFn: () => axiosPrivate.get(`social/remove/${id}`),
      onSuccess: () => {
        handleSnackMessage("follower removed", "success");
        queryClient.invalidateQueries("profile");
        queryClient.invalidateQueries("profileInfo");
      },
      onError: () => {
        handleSnackMessage("Something went wrong", "error");
      },
    }
  );
  return (
    <div className=" bg-secondary rounded p-1 items-center">
      <div className="flex flex-row border-2 border-alternate p-2 rounded-xl justify-between items-center">
        <div className="flex">
          <div className="h-[3rem] bg-primary w-[4rem] rounded-xl ml-3 mr-2 overflow-hidden">
            <div
              className={`${
                isProfileImageLoaded && "hidden"
              } h-full w-full flex items-center justify-center`}
            >
              <OvalSpinner width="25" height="25" color="#282828" />
            </div>
            <img
              onLoad={() => setIsProfileImageLoaded(true)}
              src={profile_image}
              className={`h-full w-full object-cover object-center ${
                !isProfileImageLoaded && "hidden"
              }`}
            />
          </div>
          <div className="text-gray-200 flex flex-col">
            <span className="font-bold text-sm text-gray-100">{name}</span>
            <span className="text-gray-400">@{author?.username}</span>
          </div>
        </div>
        <div className="cursor-pointer hover:text-primary transition-all delay-75">
          {profileInfo?.id === profileID &&
            (follower ? (
              <div className="" onClick={() => removeFollower()}>
                {isRemovingFollower ? (
                  <Spinner width="30" height="30" />
                ) : (
                  <PersonRemoveIcon />
                )}
              </div>
            ) : (
              <div className="" onClick={() => unFollow()}>
                {isUnFollowing ? (
                  <Spinner width="30" height="30" />
                ) : (
                  <RemoveCircleOutlineIcon />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
