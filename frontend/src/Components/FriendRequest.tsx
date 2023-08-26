import AddBoxIcon from "@mui/icons-material/AddBox";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { SuggestionsType } from "../types/api";
import { useQueryClient, useMutation } from "react-query";

type FriendRequestProps = {} & SuggestionsType;

const FriendRequest = ({ name, profile_image, id }: FriendRequestProps) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const { mutate : followUser } = useMutation({
    mutationFn: () => axiosPrivate.get(`social/follow/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("profileInfo");
      queryClient.invalidateQueries("feed");
      axiosPrivate.get(`social/follow/${id}`);
      handleSnackMessage("Account Followed successfully", "success");
    },
    onError: () => {
      handleSnackMessage("Something went wrong", "error");
    },
  });

  const handleFollow =  () => {
    followUser()
  };
  return (
    <div className=" h-[6rem] border-2 border-alternate rounded-xl p-1 flex items-center mt-3">
      <div className="flex flex-row w-[90%] mr-1">
        <div
          className={`h-[3rem] bg-orange-500 w-[4rem] rounded-xl ml-3 mr-2 overflow-hidden`}
        >
          <img
            src={profile_image}
            loading="lazy"
            className="object-cover object-center h-full w-full"
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
          <AddBoxIcon />
        </span>
      </div>
    </div>
  );
};

export default FriendRequest;
