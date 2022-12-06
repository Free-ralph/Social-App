import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/ContextProvider";

const ReplyCommentCard = ({
  id,
  profile_image,
  author,
  message,
  likes,
  getReplies,
  isLiked,
}) => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [liked, setLiked] = useState(isLiked);

  const handleFavourite = async () => {
    try {
      const response = await axiosPrivate.get(`/favourite/comment/${id}`);
      setLiked(response.data?.status);
      getReplies();
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
  };
  return (
    <div className="p-3 w-full flex ">
      <div className="w-[2rem] h-[2rem] bg-primary rounded-xl mr-2 mt-1 overflow-hidden">
        <img
          src={profile_image}
          className=" object-cover object-center w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <div className="w-fit">
          <div className=" min-h-[5rem] bg-alternate text-gray-300 rounded-xl px-3 py-1">
            <div>
              <span className="text-primary">{author}</span>
            </div>
            <div className="text-sm">{message}</div>
            <div className="text-purple-300 cursor-pointer" >
              <span onClick={handleFavourite}>
                {liked ? (
                  <FavoriteIcon className="scale-75 text-red-600" />
                ) : (
                  <FavoriteBorderIcon className="scale-75" />
                )}
              </span>
              <span className="text-xs text-gray-300" >{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCommentCard;
