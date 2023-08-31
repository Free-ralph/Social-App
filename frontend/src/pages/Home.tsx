import Feed from "./Feed";
import LeftSidebar from "../Components/LeftSidebar";
import RightSideBar from "../Components/RightSideBar";
import Navbar from "../Components/Navbar";
import { ReactNode, useEffect } from "react";
import { useStateContext } from "../context/StateContextProvider";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { motion as m, AnimatePresence } from "framer-motion";
import ProfileUser from "../Components/ProfileUser";
import Spinner from "../Components/Spinner";
import { FadeVariant } from "../Components/AnimationVariants";
import { useQuery } from "react-query";
import { PostType, RoomType, SuggestionsType } from "../types/api";
import CustomModal from "../Components/CustomModal";
import SearchIcon from "@mui/icons-material/Search";
import ChatCard from "../Components/ChatCard";
import AboutMePage from "./AboutMePage";
import MiniNav from "../Components/MiniNav";

const Home = () => {
  const { handleSnackMessage } = useStateContext();
  // basically the current page on display
  const [currPageNo, setCurrPageNo] = useState(0);
  const [currPage, setcurrPage] = useState<ReactNode | null>();
  const [openChats, setOpenChats] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [filteredFeeds, setFilteredFeeds] = useState<PostType[]>();
  const [postSearchInput, setPostSearchInput] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isRefetching: isRefetchingFeed,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: () =>
      axiosPrivate
        .get<{ feed: PostType[]; suggestions: SuggestionsType[] }>("/feed")
        .then((res) => res.data),
    onSuccess: (res) => {
      setFilteredFeeds(res.feed);
    },
    onError: () => {
      handleSnackMessage(
        "something's not right, no worries, we got you",
        "error"
      );
    },
  });

  const SearchPosts = () => {
    if (data) {
      setFilteredFeeds(
        data.feed.filter(
          (feed) =>
            postSearchInput === "" ||
            feed.profile.name
              .toLocaleLowerCase()
              .includes(postSearchInput.toLocaleLowerCase())
        )
      );
    }
  };

  const handlePageChange = (number: number) => {
    setCurrPageNo(number);
  };

  const handleCloseChats = () => {
    setOpenChats(false);
  };

  const handlePostSearchInput = (searchInput: string) => {
    setPostSearchInput(searchInput);
  };

  const toggleChatsModal = () => {
    setOpenChats(!openChats);
  };

  useEffect(() => {
    SearchPosts();
  }, [postSearchInput]);

  useEffect(() => {
    const noFeed = (
      <div className="text-gray-200 font-semibold text-center text-xl mx-[3rem] mt-7">
        No feeds to display, try follow someone or post something
      </div>
    );
    const noSuggestion = (
      <div className="text-gray-200 font-semibold text-center text-xl mx-[3rem] mt-7">
        No suggestions to display, try follow someone or post something
      </div>
    );

    var page =
      filteredFeeds && filteredFeeds.length === 0 ? (
        <Feed feed={filteredFeeds} isRefetchingFeed={isRefetchingFeed} />
      ) : (
        noFeed
      );

    switch (currPageNo) {
      case 0:
        if (filteredFeeds) {
          page = (
            <Feed feed={filteredFeeds} isRefetchingFeed={isRefetchingFeed} />
          );
        } else {
          page = noFeed;
        }
        break;
      case 1:
        if (data) {
          page = <RightSideBar suggestions={data.suggestions} />;
        } else {
          page = noSuggestion;
        }

        break;
      case 2:
        page = <ProfileUser />;
        break;

      case 3:
        page = <AboutMePage />;
        break;
    }
    setcurrPage(page);
  }, [currPageNo, data, filteredFeeds, postSearchInput]);

  return (
    <>
      <Navbar
        toggleChatsModal={toggleChatsModal}
        handlePostSearchInput={handlePostSearchInput}
        postSearchInput={postSearchInput}
      />
      <MiniNav currPageNo={currPageNo} handlePageChange={handlePageChange} />
      <div className="">
        {isLoading || isFetching ? (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <AnimatePresence>
              <m.div
                variants={FadeVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={currPageNo}
                className="block lg:hidden"
              >
                {currPage}
              </m.div>
            </AnimatePresence>
            <div className="hidden lg:flex flex-row w-full h-full justify-around">
              <LeftSidebar />
              {data && filteredFeeds && (
                <>
                  <Feed
                    feed={filteredFeeds}
                    isRefetchingFeed={isRefetchingFeed}
                  />
                  <RightSideBar suggestions={data.suggestions} />
                </>
              )}
            </div>
          </>
        )}
      </div>
      <ChatRooms openModal={openChats} handleCloseModal={handleCloseChats} />
    </>
  );
};

type ChatRoomsProps = {
  openModal: boolean;
  handleCloseModal: () => void;
};

const ChatRooms = ({ openModal, handleCloseModal }: ChatRoomsProps) => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>();
  const [searchInput, setsearchInput] = useState("");

  const { data: rooms, isLoading } = useQuery({
    queryFn: () =>
      axiosPrivate.get<RoomType[]>(`/chat/rooms`).then((res) => res.data),
    onError: () => {
      handleSnackMessage("failed to fetch rooms", "error");
    },
    onSuccess: (result) => {
      setFilteredRooms(result);
    },
  });

  const SearchNotes = () => {
    if (rooms) {
      console.log(rooms)
      setFilteredRooms(
        rooms.filter(
          (room) =>
            searchInput === "" ||
            room.member_name
              .toLocaleLowerCase()
              .includes(searchInput.toLocaleLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    SearchNotes();
  }, [searchInput]);

  return (
    <CustomModal
      openModal={openModal}
      handleCloseModal={handleCloseModal}
      title="Chats"
      height="h-[90vh]"
      width="w-[95vw] md:w-[30rem]"
    >
      {isLoading ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="flex w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setsearchInput(e.target.value)}
              className="p-2 w-[87%] h-full text-gray-200 bg-secondary"
              placeholder="Search Chats"
            />
            <p className="w-[13%] h-full flex justify-center items-center text-primary ">
              <SearchIcon />
            </p>
          </div>
          <div className="mt-5 h-[80%] p-2 border border-gray-500 rounded-lg overflow-auto">
            {filteredRooms && filteredRooms.length > 0 ? (
              filteredRooms?.map((room, index) => (
                <ChatCard
                  handleCloseNav={handleCloseModal}
                  {...room}
                  key={index}
                />
              ))
            ) : (
              <div className="w-full text-center text-gray-200 mt-2">
                {" "}
                No Conversations{" "}
              </div>
            )}
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default Home;
