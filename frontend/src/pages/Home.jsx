import Feed from "./Feed";
import LeftSidebar from "../Components/LeftSidebar";
import RightSideBar from "../Components/RightSideBar";
import Navbar from "../Components/Navbar";
import { useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AuthStateContext } from "../context/AuthProvider";

const Home = () => {
  const { handleSnackMessage } = useStateContext();
  const [feed, setFeed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const getProfileFeed = async () => {
    try {
      const response = await axiosPrivate.get("/feed");
      setFeed(response.data?.feed);
      setSuggestions(response.data?.suggestions);
      setIsLoading(false);
    } catch (error) {
      handleSnackMessage(
        "something's not right, no worries, we got you",
        "error"
      );
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getProfileFeed();
  }, []);
  return (
    <>
      <Navbar/>
      <div className="flex flex-row w-full justify-around">
        {isLoading ? (
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
        ) : (
          <>
            <LeftSidebar />
            <Feed
              feed={feed}
              getProfileFeed={getProfileFeed}
            />
            <RightSideBar
              suggestions={suggestions}
              getProfileFeed={getProfileFeed}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
