import { useState, useRef } from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AnimatePresence, motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import CustomModal from "./CustomModal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "./Button";
import CommentCard from "./CommentCard";
import MessageIcon from "@mui/icons-material/Message";
import { PostType, CommentType } from "../types/api";
import Spinner from "./Spinner";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient, useMutation, useQuery } from "react-query";

type CardProps = {} & PostType;

export type replyMetaDataType = {
  replyTo: string;
  commentID: number | string;
  isReplying: boolean;
  firstComment: boolean;
};

const Card = ({
  message,
  profile,
  image,
  id,
  isLiked,
  likes,
  commentCount,
  timestamp,
}: CardProps) => {
  const timePassed = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });
  const queryClient = useQueryClient();
  const { handleSnackMessage } = useStateContext();
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(isLiked);
  const [openComments, setOpenComments] = useState(false);
  const [replyMetaData, setReplyMetaData] = useState<replyMetaDataType>({
    replyTo: "",
    commentID: "",
    isReplying: false,
    firstComment: false,
  });
  const commentInputRef = useRef<HTMLInputElement>(null);
  const axiosPrivate = useAxiosPrivate();

  const { mutate: likePost } = useMutation({
    mutationFn: () =>
      axiosPrivate.get(`/favourite/${id}`).then((res) => res.data),
    onSuccess: (res) => {
      setLiked(res.status);
      queryClient.invalidateQueries("feed");
      queryClient.invalidateQueries("profile");
    },
    onError: () => {
      handleSnackMessage("like operation failed unexpectedly", "error");
    },
  });

  const {
    data: comments,
    refetch: getComments,
    isRefetching: isLoadingComments,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      axiosPrivate
        .get<CommentType[]>(`comments/post/${id}`)
        .then((res) => res.data),
    onError: () => {
      handleSnackMessage("Couldn't fetch comments", "error");
    },
    enabled: false,
  });

  const { mutate: addCommentReply } = useMutation({
    mutationFn: () =>
      axiosPrivate.post(`/comment/reply/${replyMetaData.commentID}`, {
        message: commentInput,
      }),
    onError: () => {
      handleSnackMessage("unexpectedly failed to add comment", "error");
    },
  });

  const { mutate: addComment } = useMutation({
    mutationFn: () =>
      axiosPrivate.post(`/comment/add/${id}`, {
        message: commentInput,
      }),
    onError: () => {
      handleSnackMessage("unexpectedly failed to add comment", "error");
    },
  });
  const handleCloseModal = () => {
    setOpenComments(false);
    queryClient.invalidateQueries("feed")
  };

  const handleAddComment = () => {
    if (!commentInput) {
      handleSnackMessage("No comment to add", "error");
      return;
    }
    if (replyMetaData.isReplying) {
      addCommentReply();
    } else {
      addComment();
    }
    getComments();
    setCommentInput("");
    setReplyMetaData({
      replyTo: "",
      commentID: "",
      isReplying: false,
      firstComment: false,
    });
  };

  const handleReplyComment = (data: replyMetaDataType) => {
    setReplyMetaData(data);
  };

  const handleCloseReply = () => {
    setReplyMetaData((prev) => ({
      ...prev,
      replyTo: "",
      isReplying: false,
      commentID: "",
    }));
  };

  const handleGetComments = async () => {
    setOpenComments(true);
    getComments();
  };

  return (
    <div className="">
      <div className="flex md:p-3 items-center flex-row justify-between">
        <Link to={`/profile/${profile?.id}`} className="">
          <div className="flex flex-row cursor-pointer">
            <div className="h-[3rem] bg-pink-500 w-[4rem] rounded-xl md:ml-3 mr-2 overflow-hidden">
              <img
                src={profile.profile_image}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-100">{profile?.name}</p>
              <p className="text-gray-200 text-sm">{timePassed}</p>
            </div>
          </div>
        </Link>

        <div className="border-1 border-gray-20 text-gray-200 rounded-xl px-2 cursor-pointer hover:scale-[1.1] transition-all delay-[20]">
          <MoreHorizOutlinedIcon />
        </div>
      </div>
      <p className="my-3 md:my-0 md:p-5 text-sm text-gray-200">{message}</p>
      {image && (
        <div className="cursor-pointer md:p-3 h-[20rem]">
          <img
            loading="lazy"
            className="w-full rounded-lg h-full object-cover object-top text-gray-300"
            src={image}
            alt={`${profile?.name}-post`}
          />
        </div>
      )}
      <div className="w-full flex items-center justify-between px-3 h-[3rem]">
        <div className="flex items-center">
          <div
            className="mr-1 text-primary cursor-pointer"
            onClick={() => likePost()}
          >
            <AnimatePresence mode="wait">
              {liked ? (
                <motion.span
                  initial={{
                    opacity: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0.5,
                  }}
                  key={1}
                  transition={{
                    duration: 0.1,
                  }}
                >
                  <FavoriteIcon className="scale-[1.3] text-red-600" />
                </motion.span>
              ) : (
                <motion.span
                  initial={{
                    opacity: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0.5,
                  }}
                  key={2}
                  transition={{
                    duration: 0.1,
                  }}
                >
                  <FavoriteBorderIcon className="scale-[1.3]" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-gray-300 mr-4">{likes}</span>
          <span
            className="text-primary cursor-pointer mr-1"
            onClick={handleGetComments}
          >
            <ForumIcon className="scale-[1.3]" />
          </span>
          <span className="text-gray-300">{commentCount}</span>
        </div>
        <Link
          to={`chat/${profile?.id}`}
          className="text-primary cursor-pointer hover:opacity-75 transition-all delay-75"
        >
          <MessageIcon className="scale-[1.3]" />
        </Link>
      </div>
      <CustomModal
        openModal={openComments}
        handleCloseModal={handleCloseModal}
        width="w-[95vw] md:w-[38rem]"
        height="h-[90vh]"
      >
        <div className="h-full w-full border-2 border-alternate relative p-3 overflow-y-auto">
          {isLoadingComments ? (
            <div className="w-fit m-auto">
              <Spinner />
            </div>
          ) : (
            <>
              {comments?.length === 0 ? (
                <div className="m-auto w-fit font-bold text-gray-300 text-lg">
                  No Comments
                </div>
              ) : (
                comments?.map((comment, i) => (
                  <CommentCard
                    key={i}
                    {...comment}
                    commentInputRef={commentInputRef}
                    handleReplyComment={handleReplyComment}
                    replyMetaData={replyMetaData}
                  />
                ))
              )}
              <div className="p-3 w-fit h-[6rem] flex "></div>
              <div className="fixed bottom-6 left-0 w-full">
                <div className="flex justify-between w-[90%] m-auto">
                  <div className="w-full relative">
                    <AnimatePresence>
                      {replyMetaData.isReplying && (
                        <motion.div
                          initial={{
                            y: 0,
                          }}
                          animate={{
                            y: "-100%",
                          }}
                          exit={{
                            y: 0,
                          }}
                          className="p-2 text-gray-300 bg-alternate absolute rounded-xl w-[97%] z-[-1] flex justify-between"
                        >
                          <span>
                            reply to{" "}
                            <span className="text-primary font-bold">
                              {replyMetaData.replyTo}
                            </span>
                          </span>
                          <span
                            onClick={handleCloseReply}
                            className="cursor-pointer"
                          >
                            <CloseIcon className="text-primary scale-75" />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      type="text"
                      ref={commentInputRef}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="comment"
                      className="p-2 border-1 w-[97%] h-full mr-1 text-gray-200 bg-secondary rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 border-gray-300"
                    />
                  </div>

                  <div onClick={handleAddComment}>
                    <Button text="Add" style="p-3" type={1} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default Card;
