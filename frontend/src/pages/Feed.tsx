import { useRef, useState } from "react";
import Card from "../Components/Card";
import Button from "../Components/Button";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CustomModal from "../Components/CustomModal";
import TagIcon from "@mui/icons-material/Tag";
import { PostType } from "../types/api";
import { useMutation, useQueryClient } from "react-query";
import Spinner from "../Components/Spinner";
import { motion as m, AnimatePresence } from "framer-motion";

type FeedProps = {
  feed: PostType[];
  isRefetchingFeed: boolean;
};
const Feed = ({ feed, isRefetchingFeed }: FeedProps) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage, profileInfo } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [newPost, setNewPost] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);

  const toggleNewPost = () => {
    setShowNewPost(!showNewPost);
  };

  const { mutate: addNewPost, isLoading: isAddingPost } = useMutation({
    mutationFn: () =>
      axiosPrivate.post(
        "/timeline",
        { message: newPost, image: imageInput },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("feed");
      handleSnackMessage("posted successfully", "success");
      setNewPost("");
      setImageInput(null);
      if (imageRef.current) {
        imageRef.current.value = "";
      }
      setShowNewPost(false);
    },
    onError: () => {
      handleSnackMessage("something went wrong", "error");
    },
  });

  const handleNewPost = async () => {
    if (!newPost && !imageInput?.name) {
      handleSnackMessage(
        "you have to post something, either an image or message",
        "error"
      );
    } else {
      addNewPost();
    }
  };

  const handleImageClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  const handleImageChange = () => {
    if (imageRef.current?.files) {
      setImageInput(imageRef.current.files[0]);
    }
  };

  const handleCloseModal = () => {
    setShowNewPost(false);
  };

  return (
    <div className=" w-[95%] lg:w-[50%] p-1 mx-auto">
      {/* hidden image refrence */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif"
        className="hidden"
        ref={imageRef}
        onChange={handleImageChange}
      />

      <div className="w-full p-5 bg-secondary rounded-xl flex flex-row justify-between items-center">
        <div className="h-[3rem] w-[3rem] mr-2   lg:w-[4rem] bg-gray-500 rounded-xl overflow-hidden">
          <img
            src={profileInfo?.profile_image}
            className="h-full w-full object-cover"
          />
        </div>
        <span
          onClick={toggleNewPost}
          className="text-gray-300 text-sm sm:text-base  lg:text-lg cursor-pointer hover:text-primary transition-all delay-75"
        >
          What's on your mind?
        </span>
        <span
          className="font-semibold bg-primary text-secondary rounded-xl ml-1 py-2 px-2 lg:px-4 cursor-pointer flex items-center justify-center"
          onClick={toggleNewPost}
        >
          <TagIcon />
          Post
        </span>
      </div>
      <AnimatePresence>
        {isRefetchingFeed && (
          <m.div
            initial={{ height: 0 }}
            animate={{ height: "4rem" }}
            exit={{ height: 0, transition: { delay: 0.2 } }}
            className="w-full flex justify-center"
          >
            {" "}
            <m.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0 }}
              className="scale-[0.5]"
            >
              <Spinner />
            </m.span>
          </m.div>
        )}
      </AnimatePresence>
      {feed.length < 1 && (
        <div className="text-gray-300 font-semibold text-xl text-center mt-[3rem]">
          Post Something, Or follow someone to see your feed
        </div>
      )}
      {feed?.map((item, index) => {
        return (
          <div key={index} className="mt-3 bg-secondary rounded-xl p-5">
            <Card userProfileID={profileInfo?.id} {...item} />
          </div>
        );
      })}
      {showNewPost && (
        <CustomModal
          openModal={showNewPost}
          handleCloseModal={handleCloseModal}
          height={"h-fit "}
          width={"w-[95vw] md:w-[33rem]"}
        >
          <textarea
            className="w-full mb-5 mt-2 p-2 border-1 text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500"
            placeholder="What's on your mind?"
            rows={8}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex flex-col">
            <Button
              onClick={handleImageClick}
              text={`${
                imageRef.current?.files && imageRef.current?.files?.length > 0
                  ? "Change Photo"
                  : "Add Photo"
              }`}
              icon={<CameraAltIcon className="scale-[1.2] mr-3" />}
              style={`w-full h-[2.8rem] mt-3 ${
                imageRef.current?.files &&
                imageRef.current?.files?.length > 0 &&
                "text-primary"
              }`}
            />
            <Button
              onClick={handleNewPost}
              text={!isAddingPost ? "Post" : ""}
              icon={
                !isAddingPost ? (
                  <TagIcon />
                ) : (
                  <span className="scale-[0.5]">
                    <Spinner />
                  </span>
                )
              }
              style="w-full h-[2.8rem] mt-3"
              disabled = {isAddingPost}
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default Feed;
