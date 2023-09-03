import AddBoxIcon from "@mui/icons-material/AddBox";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { SuggestionsType } from "../types/api";
import { useQueryClient, useMutation } from "react-query";
import Spinner, { OvalSpinner } from "./Spinner";
import { useState } from "react";

type FriendRequestProps = {} & SuggestionsType;

const FriendRequest = ({ name, profile_image, id }: FriendRequestProps) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false);
  const { mutate: followUser, isLoading: isFollowing } = useMutation({
    mutationFn: () => axiosPrivate.get(`social/follow/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("profileInfo");
      queryClient.invalidateQueries("feed");
      axiosPrivate.get(`social/follow/${id}`);
      handleSnackMessage("Account Followed successfully", "success");
    },
    onError: (e) => {
      console.log(e);
      handleSnackMessage("Something went wrong", "error");
    },
  });

  const handleFollow = () => {
    followUser();
  };
  return (
    <div className=" h-[6rem] border-2 border-alternate rounded-xl p-1 flex items-center mt-3">
      <div className="flex flex-row w-[90%] mr-1">
        <div
          className={`h-[3rem] bg-primary w-[4rem] rounded-xl ml-3 mr-2 overflow-hidden`}
        >
          <div
            className={`${
              isProfileImageLoaded && "hidden"
            } h-full w-full flex items-center justify-center`}
          >
            <OvalSpinner width="25" height="25" color="#282828"/>
          </div>
          <img
            onLoad={() => setIsProfileImageLoaded(true)}
            src={profile_image}
            className={`object-cover object-center h-full w-full ${
              !isProfileImageLoaded && "hidden"
            }`}
            // loading="lazy"
          />
        </div>
        <div className="text-gray-200">
          <span className="font-bold text-sm text-primary">{name}</span> wants
          to become your friend
        </div>
      </div>
      <div className="flex justify-between items-center w[7%] mr-2">
        <span
          className="scale-[1.5] text-primary cursor-pointer hover:opacity-[0.6] transition-all"
          onClick={handleFollow}
        >
          {isFollowing ? <Spinner width="25" height="25" /> : <AddBoxIcon />}
        </span>
      </div>
    </div>
  );
};

export default FriendRequest;
