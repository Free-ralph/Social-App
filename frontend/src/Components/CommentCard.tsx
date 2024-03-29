import { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyCommentCard from "./ReplyCommentCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { CommentType } from "../types/api";
import { replyMetaDataType } from "./Card";
import Spinner from "./Spinner";
import { useMutation } from "react-query";

type commentCardProps = {
  commentInputRef: React.RefObject<HTMLInputElement>;
  handleReplyComment: (data: replyMetaDataType) => void;
  replyMetaData: replyMetaDataType;
} & CommentType;

const CommentCard = ({
  id,
  profile_image,
  author,
  message,
  isLiked,
  likes,
  commentInputRef,
  handleReplyComment,
  replyMetaData,
  first_reply,
}: commentCardProps) => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCountLocal, setlikeCountLocal] = useState(likes)

  const {
    data: replies,
    mutate: getReplies,
    isLoading: loadingReplies,
  } = useMutation({
    mutationFn: () =>
      axiosPrivate
        .get<CommentType[]>(`comments/comment/${id}`)
        .then((res) => res.data),
    onError: () => {
      handleSnackMessage("failed to get replies", "error");
    },
    // refetchInterval  i'm trying to discover if there's a way to trigger refetch if a state changes
  });

  const { mutate : refetchLikeCount } = useMutation({
    mutationFn : () =>
      axiosPrivate
        .get(`comment/like-count/${id}`)
        .then((res) => res.data.count),
    onSuccess : (res) => {
      setlikeCountLocal(res)
    }
  });

  const { mutate: likeComment } = useMutation({
    mutationFn: () =>
      axiosPrivate.get(`/favourite/comment/${id}`).then((res) => res.data),
    onSuccess: () => {
      
      refetchLikeCount();
    },
    onError: () => {
      setLiked(!liked);
      handleSnackMessage("like operation failed unexpectedly", "error");
    },
  });

  const ToggleLikes = () => {
    // so basicallly for a faster response, i'm effecting the like and unlike actions locally before sending the info to the server
    if (liked) {
      setlikeCountLocal((prev) => prev - 1);
    } else {
      setlikeCountLocal((prev) => prev + 1);
    }
    setLiked(!liked);
    likeComment()
  };


  useEffect(() => {
    getReplies();
  }, [replyMetaData]);

  useEffect(() => {
    refetchLikeCount()
  }, [])

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
              <span className="cursor-pointer" onClick={ToggleLikes}>
                {liked ? (
                  <FavoriteIcon className="scale-75 text-red-600" />
                ) : (
                  <FavoriteBorderIcon className="scale-75" />
                )}
              </span>
              <span className="mr-2 text-xs text-gray-300">{likeCountLocal}</span>
              <span
                className=" text-sm cursor-pointer"
                onClick={() => {
                  commentInputRef.current && commentInputRef.current.focus();
                  handleReplyComment({
                    commentID: id,
                    isReplying: true,
                    replyTo: author,
                    firstComment: first_reply.id ? false : true,
                  });
                }}
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
                <Spinner />
              ) : (
                replies?.map((comment, index) => (
                  <ReplyCommentCard
                    key={index}
                    {...comment}
                    getReplies={getReplies}
                  />
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
