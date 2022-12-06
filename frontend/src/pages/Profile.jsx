import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import HomeIcon from "@mui/icons-material/Home";
import FollowCard from "../Components/FollowCard";
import Card from "../Components/Card";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AnimatePresence, motion } from "framer-motion";
import { useStateContext } from "../context/ContextProvider";
import { ThreeDots } from "react-loader-spinner";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import { AuthStateContext } from "../context/AuthProvider";
import Button from "../Components/Button";
import CustomModal from "../Components/CustomModal";

const Months = {
  0: "January",
  1: "Febuary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "september",
  9: "October",
  10: "November",
  11: "December",
};

const Profile = () => {
  const { handleSnackMessage } = useStateContext();
  const { user } = AuthStateContext();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({
    profile_image: false,
    cover_image: false,
  });
  const [followerNav, setFollowerNav] = useState(false);
  const [profile, setProfile] = useState({});
  const [image, setImage] = useState({});
  const [updateInput, setUpdateInput] = useState({
    name : profile.name,
    bio: profile.bio,
    state: profile.state,
    city: profile.city,
  });
  const [openModal, setOpenModal] = useState(false);
  const [dateJoined, setDateJoined] = useState({
    day: 0,
    month: 1,
    year: 2022,
  });
  const axiosPrivate = useAxiosPrivate();
  const { profile_id } = useParams();
  const imageInput = useRef();

  const handleImageChange = async (e) => {
    setImageLoading((prev) => ({ ...prev, [image.type]: true }));
    try {
      const response = await axiosPrivate.post(
        `/profile/update/${profile_id}`,
        {
          [image.type]: e.target.files[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await getProfile();
      setImageLoading((prev) => ({ ...prev, [image.type]: false }));
    } catch (error) {
      console.log(error);
      setImageLoading((prev) => ({ ...prev, [image.type]: false }));
    }
  };
  const handleImageClick = async (type) => {
    imageInput.current.click();
    setImage((prev) => ({ ...prev, type: type }));
  };

  const handleUpdateBio = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        `profile/update/${profile_id}`,
        {
          name : updateInput.name,
          bio: updateInput.bio,
          state: updateInput.state,
          city: updateInput.city,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      handleSnackMessage("updated succesfully", "success");
      setOpenModal(false);
      getProfile();
    } catch (error) {
      // console.log(error);
    }
  };
  const getProfile = async () => {
    try {
      const response = await axiosPrivate.get(`/profile/${profile_id}`);
      setProfile(response.data);
      setUpdateInput((prev) => ({
        ...prev,
        name : response.data?.name,
        bio: response.data?.bio,
        city: response.data?.city,
        state: response.data?.state,
      }));
      const date = new Date(response.data.created_at);
      setDateJoined({
        day: date.getDay(),
        month: Months[date.getMonth()],
        year: date.getFullYear(),
      });
      setLoading(false);
    } catch (error) {
      handleSnackMessage("you might not have an activate profile", "error");
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    getProfile();
  }, []);
  return (
    <div className="w-screen">
      <CustomModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        height="h-fit"
        width="w-[33rem]"
      >
        <form className="h-full" onSubmit={handleUpdateBio}>
        <input
            type="text"
            placeholder="Name"
            value={updateInput.name}
            onChange={(e) =>
              setUpdateInput((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full h-[3rem] mb-3 p-2 border-1 text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <textarea
            className="w-full h-[10rem] p-2 border-1 text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Bio"
            value={updateInput.bio}
            onChange={(e) =>
              setUpdateInput((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="City"
            value={updateInput.city}
            onChange={(e) =>
              setUpdateInput((prev) => ({ ...prev, city: e.target.value }))
            }
            className="w-full h-[3rem] mt-3 p-2 border-1 text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="State"
            value={updateInput.state}
            onChange={(e) =>
              setUpdateInput((prev) => ({ ...prev, state: e.target.value }))
            }
            className="w-full h-[3rem] mt-4 p-2 border-1 text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button text="update" style="py-2 px-4 mt-3" />
        </form>
      </CustomModal>
      {!loading ? (
        <>
          <div className="w-full relative h-[15rem]">
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              ref={imageInput}
            />
            <div className="relative bg-purple-500 h-full overflow-hidden">
              {imageLoading.cover_image ? (
                <div className="w-full flex justify-center items-center h-full">
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#282828"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              ) : profile?.cover_image ? (
                <img
                  src={profile?.cover_image}
                  className="w-full object-center object-cover h-full"
                />
              ) : (
                <div className="font-bold mt-5 text-3xl text-center">
                  {" "}
                  insert a cover photo Here
                </div>
              )}
              {user?.id === profile?.author?.id && (
                <div
                  className="absolute h-full w-full flex justify-center items-center top-0 left-0 opacity-0 hover:opacity-100 transition-all delay-75 bg-[#28282897] cursor-pointer"
                  onClick={() => handleImageClick("cover_image")}
                >
                  <span className="scale-[2] text-primary">
                    <FilterHdrIcon />
                  </span>
                </div>
              )}
            </div>
            <div className="absolute left-[11.5rem] rounded-xl translate-y-[-6rem] w-fit scale-[1.5] overflow-hidden border-1 border-primary z-10">
              <div className="relative w-[7rem] h-[7rem] ">
                {imageLoading.profile_image ? (
                  <div className="w-full flex justify-center items-center h-full">
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#282828"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                ) : (
                  <img
                    src={profile?.profile_image}
                    className="w-full h-full object-center object-cover"
                  />
                )}
                {user?.id === profile?.author?.id && (
                  <div
                    className="absolute h-full w-full flex justify-center items-center top-0 left-0 opacity-0 hover:opacity-100 transition-all delay-75 bg-[#28282897] cursor-pointer"
                    onClick={() => handleImageClick("profile_image")}
                  >
                    <span className="scale-[2] text-primary">
                      <FilterHdrIcon />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Link to="/">
              <div className="absolute text-primary left-[5rem] top-[2rem] scale-[2]">
                <HomeIcon />
              </div>
            </Link>
          </div>
          <div className="w-[90%] m-auto mt-10">
            <div className="flex w-full justify-between ">
              <div className="bg-secondary h-fit rounded-xl p-5 w-[24%] sticky top-4 text-gray-200">
                <p className="font-bold text-gray-50 text-center">
                  {profile?.username}
                </p>
                <p className="text-sm text-gray-400 text-center">
                  @{profile?.author?.username}
                </p>
                <p className="mt-3 text-center">{profile?.bio}</p>
                <p className="mt-2">
                  <LocationOnIcon /> {profile?.city}, {profile?.state}
                </p>
                <p className="mt-2">
                  <DomainVerificationIcon /> Joined {dateJoined.day}{" "}
                  {dateJoined.month}, {dateJoined.year}
                </p>
                <div
                  className="text-center w-full mt-3"
                  onClick={() => setOpenModal(true)}
                >
                  {user?.id === profile?.author?.id && (
                    <Button text="update" style="py-2 px-4" />
                  )}
                </div>
              </div>
              <div className="w-[49%]">
                {profile.posts?.map((item, i) => {
                  return (
                    <div key={i} className="mt-3 bg-secondary rounded-xl p-5">
                      <Card
                        profile={profile}
                        {...item}
                        getProfile={getProfile}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="sticky top-4 bg-secondary rounded-xl p-5 w-[24%] h-fit max-h-[50rem] overflow-y-auto overflow-x-hidden text-gray-200">
                <div className="text-gray-200 flex justify-between w-full">
                  <div>
                    <div
                      onClick={() => setFollowerNav(true)}
                      className={`flex flex-col items-center cursor-pointer ${
                        followerNav && "border-b-2 border-primary"
                      } px-3`}
                    >
                      <span className="text-sm">followers</span>
                      <span
                        className={`font-bold text-lg ${
                          followerNav && "text-primary"
                        }`}
                      >
                        {profile?.followers?.length - 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setFollowerNav(false)}
                      className={`flex flex-col items-center cursor-pointer ${
                        !followerNav && "border-b-2 border-primary"
                      }  px-3`}
                    >
                      <span className="text-sm ">following</span>
                      <span
                        className={`font-bold text-lg ${
                          !followerNav && "text-primary"
                        }`}
                      >
                        {profile?.following?.length - 1}
                      </span>
                    </div>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {followerNav ? (
                    <motion.div
                      initial={{
                        x: 50,
                        opacity: 0,
                      }}
                      animate={{
                        x: 0,
                        opacity: 1,
                      }}
                      exit = {{
                        x : -50, 
                        opacity : 0
                      }}
                      transition = {{
                        duration : 0.1
                      }}
                      className="mt-3"
                      key={1}
                    >
                      {profile?.followers?.map((obj, index) => {
                        if (obj.id !== profile?.id) {
                          return (
                            <FollowCard
                              key={index}
                              authorID={profile?.author?.id}
                              follower={true}
                              {...obj}
                              getProfile={getProfile}
                            />
                          );
                        }
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={2}
                      initial={{
                        x: 50,
                        opacity: 0,
                      }}
                      animate={{
                        x: 0,
                        opacity: 1,
                      }}
                      exit = {{
                        x : -50, 
                        opacity : 0
                      }}
                      transition = {{
                        duration : 0.1
                      }}
                      className="mt-3"
                    >
                      {profile?.following?.map((obj, index) => {
                        if (obj.id !== profile?.id) {
                          return (
                            <FollowCard
                              key={index}
                              authorID={profile?.author?.id}
                              follower={false}
                              {...obj}
                              getProfile={getProfile}
                            />
                          );
                        }
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center">
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
      )}
    </div>
  );
};

export default Profile;
