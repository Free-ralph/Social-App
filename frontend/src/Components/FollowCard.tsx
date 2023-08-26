import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { authorType } from "../types/api";
import { useMutation, useQueryClient } from "react-query";

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

  const { mutate: unFollow } = useMutation({
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

  const { mutate: removeFollower } = useMutation({
    mutationFn: () => axiosPrivate.get(`social/remove/${id}`),
    onSuccess: () => {
      handleSnackMessage("follower removed", "success");
      queryClient.invalidateQueries("profile");
      queryClient.invalidateQueries("profileInfo");
    },
    onError: () => {
      handleSnackMessage("Something went wrong", "error");
    },
  });
  return (
    <div className=" bg-secondary rounded p-1 items-center">
      <div className="flex flex-row border-2 border-alternate p-2 rounded-xl justify-between items-center">
        <div className="flex">
          <div className="h-[3rem] bg-orange-500 w-[4rem] rounded-xl ml-3 mr-2 overflow-hidden">
            <img
              src={profile_image}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="text-gray-200 flex flex-col">
            <span className="font-bold text-sm text-gray-100">{name}</span>
            <span className="text-gray-400">@{author?.username}</span>
          </div>
        </div>
        <div>
          {profileInfo?.id === profileID &&
            (follower ? (
              <div className="" onClick={() => removeFollower()}>
                <PersonRemoveIcon />
              </div>
            ) : (
              <div className="" onClick={() => unFollow()}>
                <RemoveCircleOutlineIcon />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
