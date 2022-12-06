import { useRef, useEffect, useState } from "react";
import Card from "../Components/Card";
import Button from "../Components/Button";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/ContextProvider";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const Feed = ({ feed, getProfileFeed }) => {
  const { handleSnackMessage, profileInfo } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const newPost = useRef();
  const imageRef = useRef();
  const [imageInput, setImageInput] = useState({});

  
  const handleNewPost = async () => {
    try {
      const response = await axiosPrivate.post(
        "/timeline",
        {
          message: newPost.current.value,
          image: imageInput,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      handleSnackMessage("posted successfully", 'success');
      getProfileFeed()
    } catch (error) {
      handleSnackMessage("something went wrong", 'error');
    }
    newPost.current.value = ""
    imageRef.current.value = ""
  };
  const handleImageClick = (e) => {
    imageRef.current.click();
  };
  const handleChange = () => {
    setImageInput(imageRef.current.files[0]);
  };
  return (
    <div className=" w-[96%] md:w-[50%] p-1">
      <div className="w-[100%] p-5 bg-secondary rounded-xl flex flex-row justify-between">
        <div className="h-[3rem] w-[4rem] bg-gray-500 rounded-xl overflow-hidden">
          <img src={profileInfo?.profile_image} className="h-full w-full object-cover" />
        </div>
        <div className="w-[48%] md:w-[50%] lg:w-[65%] relative">
          <input
            placeholder={`What's new ${profileInfo?.name || profileInfo?.username}`}
            ref={newPost}
            className="p-2 w-full h-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 "
          />
          <input
            type="file"
            accept = "image/jpeg,image/png,image/jpg,image/gif"
            className="hidden"
            ref={imageRef}
            onChange={handleChange}
          />
          <div
            onClick={handleImageClick}
            className={`${
              imageRef.current?.files?.length > 0
                ? "text-primary"
                : "text-gray-200"
            } absolute top-[0.5rem] right-[1rem] scale-[1.4] cursor-pointer`}
          >
            <CameraAltIcon />
          </div>
          {/* {imageRef.current?.files?.length && (
            <div className="rounded-full text-green-600 absolute top-[0.5rem] right-[1rem] scale-75">
              <CheckCircleIcon />
            </div>
          )} */}
        </div>
        <Button
          text="Post it!"
          type={1}
          icon={<TagOutlinedIcon />}
          style="w-[30%] md:w-[25%] text-sm"
          onClick={handleNewPost}
        />
      </div>
      {feed?.map((item, index) => {
        return (
          <div key={index} className="mt-3 bg-secondary rounded-xl p-5">
            <Card {...item} getProfileFeed = {getProfileFeed} />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
