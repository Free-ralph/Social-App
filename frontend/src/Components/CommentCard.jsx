import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyCommentCard from "./ReplyCommentCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ThreeDots } from "react-loader-spinner";
import { useStateContext } from "../context/ContextProvider";
import { useEffect } from "react";

const CommentCard = ({
  id,
  profile_image,
  author,
  message,
  isLiked,
  likes,
  commentInput,
  setReplyInputData,
  replyInputData,
  first_reply,
  getComments
}) => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [liked, setLiked] = useState(isLiked);

  const handleReplyComment = () => {
    commentInput.current.focus();
    setReplyInputData((prev) => ({
      commentID: id,
      isReplying: true,
      replyTo: author,
      firstComment: first_reply.id ? false : true,
    }));
  };

  const getReplies = async () => {
    try {
      const response = await axiosPrivate.get(`comments/comment/${id}`);
      setReplies(response.data);
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
    setLoadingReplies(false);
  };

  const handleFavourite = async () => {
    try {
      const response = await axiosPrivate.get(`/favourite/comment/${id}`);
      setLiked(response.data?.status);
      getComments()
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
  };

  useEffect(() => {
    getReplies();
  }, [replyInputData]);
  return (
    <div className="p-3 w-fit max-w-[80%] flex ">
      <div className="w-[3rem] h-[3rem] bg-primary rounded-xl mr-2 mt-1 overflow-hidden">
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
            <div>{message}</div>
            <div className="text-purple-300">
              <span 
                className="cursor-pointer"
                onClick={handleFavourite}>
                {liked ? (
                  <FavoriteIcon className="scale-75 text-red-600" />
                ) : (
                  <FavoriteBorderIcon className="scale-75" />
                )}
              </span>
              <span className="mr-2 text-xs text-gray-300" >{likes}</span>
              <span
                className=" text-sm cursor-pointer"
                onClick={handleReplyComment}
              >
                reply
              </span>
            </div>
          </div>
        </div>
        {first_reply.id && (
          <div>
            {showReplies ? (
              loadingReplies ? (
                <ThreeDots
                  height="40"
                  width="40"
                  radius="5"
                  color="#fffd01"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              ) : (
                replies?.map((comment, index) => (
                  <ReplyCommentCard key={index} {...comment} getReplies = {getReplies} />
                ))
              )
            ) : (
              <div className="mt-2 h-[2rem] flex items-center">
                <div className="w-[2rem] h-full bg-primary rounded-xl mr-1 mt-1 overflow-hidden">
                  <img
                    src={first_reply?.profile_image}
                    className=" object-cover object-center w-full h-full"
                  />
                </div>
                <span className="text-gray-200 font-bold">
                  {first_reply?.author}
                </span>
                <span className="text-gray-300 ml-2">
                  {first_reply?.message.slice(0, 20)} ...
                </span>
              </div>
            )}
            <span
              className="text-gray-400 cursor-pointer hover:text-gray-200 transition-all"
              onClick={() => setShowReplies((prev) => !prev)}
            >
              {showReplies ? <span>hide</span> : <span>view</span>} replies ...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
