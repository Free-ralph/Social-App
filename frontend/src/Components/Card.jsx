import { useEffect, useState, useRef } from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AnimatePresence, motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/ContextProvider";
import CustomModal from "./CustomModal";
import CloseIcon from "@mui/icons-material/Close";
import Button from "./Button";
import CommentCard from "./CommentCard";
import { ThreeDots } from "react-loader-spinner";
import MessageIcon from "@mui/icons-material/Message";

const Card = ({
  timestamp,
  message,
  profile,
  image,
  id,
  isLiked,
  likes,
  getProfileFeed,
  getProfile,
  commentCount,
}) => {
  const { handleSnackMessage } = useStateContext();
  const [time, setTime] = useState({
    daysPassed: 0,
    hourPassed: 0,
    minutePassed: 0,
    secondsPassed: 0,
  });
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(isLiked);
  const [openComments, setOpenComments] = useState(false);
  const [data, setData] = useState({
    comments: [],
    loadingComments: false,
  });
  const [replyInputData, setReplyInputData] = useState({
    replyTo: "",
    commentID: "",
    isReplying: false,
    firstComment: false,
  });
  const commentInput = useRef();
  const axiosPrivate = useAxiosPrivate();
  const handleFavourite = async () => {
    try {
      const response = await axiosPrivate.get(`/favourite/${id}`);
      setLiked(response.data?.status);
      if (getProfileFeed) {
        getProfileFeed();
      } else {
        getProfile();
      }
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
  };

  const getComments = async () => {
    try {
      const response = await axiosPrivate.get(`comments/post/${id}`);
      setData((prev) => ({ ...prev, comments: response.data }));
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
    setData((prev) => ({ ...prev, loadingComments: false }));
  };

  const handleAddComment = async () => {
    try {
      if (replyInputData.isReplying) {
        const response = await axiosPrivate.post(
          `/comment/reply/${replyInputData.commentID}`,
          {
            message: comment,
          }
        );
      } else {
        const response = await axiosPrivate.post(`/comment/add/${id}`, {
          message: comment,
        });
      }

      getComments();
      setComment("");
      setReplyInputData({
        replyTo: "",
        commentID: "",
        isReplying: false,
        firstComment: false,
      });
    } catch (error) {
      handleSnackMessage("something went wrong", "error");
    }
  };

  const handleCloseReply = () => {
    setReplyInputData((prev) => ({
      replyTo: "",
      isReplying: false,
      commentID: null,
    }));
  };

  const handleGetComments = async () => {
    setOpenComments(true);
    setData((prev) => ({ ...prev, loadingComments: true }));
    getComments();
  };

  useEffect(() => {
    const datePosted = new Date(timestamp).getDate();
    const currentDate = new Date().getDate();
    const hourPosted = new Date(timestamp).getHours();
    const currentHour = new Date().getHours();
    const minutePosted = new Date(timestamp).getMinutes();
    const currentMinute = new Date().getMinutes();
    const secondPosted = new Date(timestamp).getSeconds();
    const currentSecond = new Date().getSeconds();

    setTime((prev) => ({
      hourPassed: currentHour - hourPosted,
      daysPassed: currentDate - datePosted,
      minutePassed: currentMinute - minutePosted,
      secondsPassed: currentSecond - secondPosted,
    }));
  }, [timestamp]);
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
              <p className="text-gray-200 text-sm">
                {time.daysPassed === 0
                  ? time.hourPassed == 0
                    ? time.minutePassed == 0
                      ? `${time.secondsPassed} seconds(s) ago`
                      : `${time.minutePassed} minute(s) ago`
                    : `${time.hourPassed} hour(s) ago`
                  : time.daysPassed == 1
                  ? "yesterday"
                  : `${time.daysPassed} days ago`}
              </p>
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
            className="w-full rounded-lg h-full object-cover object-center text-gray-300"
            src={image}
            alt={`${profile?.name}-post`}
          />
        </div>
      )}
      <div className="w-full flex items-center justify-between px-3 h-[3rem]">
        <div className="flex items-center">
          <div
            className="mr-1 text-primary cursor-pointer"
            onClick={handleFavourite}
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
        <Link to = {`chat/${profile?.id}`} className="text-primary cursor-pointer hover:opacity-75 transition-all delay-75">
          <MessageIcon className = "scale-[1.3]"  />
        </Link>
      </div>
      <CustomModal
        openModal={openComments}
        setOpenModal={setOpenComments}
        width="w-[40rem]"
        height="h-[40rem]"
      >
        <div className="h-full w-full border-2 border-alternate relative p-3 overflow-y-auto">
          {data.loadingComments ? (
            <div className="w-fit m-auto">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fffd01"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          ) : (
            <>
              {data.comments?.length === 0 ? (
                <div className="m-auto w-fit font-bold text-gray-300 text-lg">
                  No Comments
                </div>
              ) : (
                data.comments.map((comment, i) => (
                  <CommentCard
                    key={i}
                    {...comment}
                    commentInput={commentInput}
                    setReplyInputData={setReplyInputData}
                    replyInputData={replyInputData}
                    getComments={getComments}
                  />
                ))
              )}
              <div className="p-3 w-fit h-[6rem] flex "></div>
              <div className="fixed bottom-6 left-0 w-full">
                <div className="flex justify-between w-[90%] m-auto">
                  <div className="w-full relative">
                    <AnimatePresence>
                      {replyInputData.isReplying && (
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
                              {replyInputData.replyTo}
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
                      ref={commentInput}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
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
