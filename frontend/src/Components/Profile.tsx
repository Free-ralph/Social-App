import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
  ReactNode,
} from "react";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import HomeIcon from "@mui/icons-material/Home";
import FollowCard from "./FollowCard";
import Card from "./Card";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AnimatePresence, motion as m } from "framer-motion";
import { useStateContext } from "../context/StateContextProvider";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import CustomModal from "./CustomModal";
import HiddenImage from "./HiddenImage";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Spinner from "./Spinner";
import { FadeVariant } from "./AnimationVariants";
import { ProfileType } from "../types/api";
import Button from "./Button";
import { useMutation, useQueryClient } from "react-query";
import { formatDistanceToNow } from "date-fns";

type ProfileTypes = {
  profile: ProfileType;
  isMobile?: boolean;
};

const Profile = ({ profile, isMobile = false }: ProfileTypes) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage, profileInfo } = useStateContext();
  const [updateInput, setUpdateInput] = useState({
    name: profile?.name,
    bio: profile?.bio,
    state: profile?.state,
    city: profile?.city,
  });
  const [openModal, setOpenModal] = useState(false);
  const [currSection, setCurrSection] = useState<ReactNode>(null);
  const [currSectionNo, setCurrSectionNo] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const coverImageRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const navSectionItems = [
    {
      name: "timeline",
      icon: <NewspaperOutlinedIcon className="scale-[1.3]" />,
    },
    { name: "followers", icon: <PeopleOutlineIcon className="scale-[1.3]" /> },
  ];

  const { mutate: updateProfileImage, isLoading: isProfileImageLoading } =
    useMutation({
      mutationFn: (image: File) =>
        axiosPrivate.post(
          `/profile/update/${profile?.id}`,
          {
            profile_image: image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
      onSuccess: () => {
        handleSnackMessage("profile Image updated", "success");
        queryClient.invalidateQueries("profile");
        queryClient.invalidateQueries("profileInfo");
      },
      onError: () => {
        handleSnackMessage("profile Image update failed", "error");
      },
    });

  const { mutate: updateCoverImage, isLoading: isCoverImageLoading } =
    useMutation({
      mutationFn: (image: File) =>
        axiosPrivate.post(
          `/profile/update/${profile?.id}`,
          {
            cover_image: image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
      onSuccess: () => {
        handleSnackMessage("Cover Image updated", "success");
        queryClient.invalidateQueries("profile");
        queryClient.invalidateQueries("profileInfo");
      },
      onError: () => {
        handleSnackMessage("Cover Image update failed", "error");
      },
    });

  const { mutate: updateProfileBio, isLoading: isProfileUpdating } =
    useMutation({
      mutationFn: () =>
        axiosPrivate.post(
          `profile/update/${profile?.id}`,
          {
            name: updateInput.name,
            bio: updateInput.bio,
            state: updateInput.state,
            city: updateInput.city,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        ),
      onSuccess: () => {
        handleSnackMessage("updated succesfully", "success");
        setOpenModal(false);
        queryClient.invalidateQueries("profile");
        queryClient.invalidateQueries("profileInfo");
      },
      onError: () => {
        handleSnackMessage("Bio update failed", "error");
      },
    });

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateProfileImage(e.target.files[0]);
    }
  };

  const handleCoverImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateCoverImage(e.target.files[0]);
    }
  };

  const handleCoverImageClick = () => {
    if (coverImageRef.current) {
      coverImageRef.current.click();
    }
  };
  const handleProfileImageClick = () => {
    if (profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  const handleUpdateBio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfileBio();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    var section = <PostFeedSection profile={profile} />;
    switch (currSectionNo) {
      case 0:
        section = <PostFeedSection profile={profile} />;
        break;
      case 1:
        section = <FollowersSection profile={profile} />;
        break;
    }
    setCurrSection(section);
  }, [currSectionNo, profile]);

  return (
    <div className="w-screen">
      <CustomModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        height="h-fit"
        width="w-[95vw] md:w-[38rem] "
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
          <button disabled = {isProfileUpdating} className="rounded-xl w-[5rem] h-[2.5rem] mt-3 bg-alternate text-gray-300 border-2 border-alternate hover:bg-transparent  text-sm  font-bold transition-all delay-[10] flex items-center justify-center">
            {isProfileUpdating ? (
              <Spinner width="30" height="30" />
            ) : (
              "update"
            )}
          </button>
        </form>
      </CustomModal>

      <div className="w-full flex flex-col relative h-[12rem] md:h-[15rem]">
        <>
          {/* hidden image refs for profile and cover images */}
          <HiddenImage
            imageRef={coverImageRef}
            handleChange={handleCoverImageChange}
          />
          <HiddenImage
            imageRef={profileImageRef}
            handleChange={handleProfileImageChange}
          />
        </>
        <div className="relative bg-secondary h-full overflow-hidden">
          {isCoverImageLoading ? (
            <div className="w-full flex justify-center items-center h-full">
              <Spinner />
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
          {isMobile ? (
            <span className="absolute bottom-5 right-5 text-primary">
              <CameraEnhanceIcon
                className="scale-[1.4]"
                onClick={handleCoverImageClick}
              />
            </span>
          ) : (
            profileInfo &&
            profileInfo.id === profile.id && (
              <div
                className="absolute h-full w-full flex justify-center items-center top-0 left-0 opacity-0 hover:opacity-100 transition-all delay-75 bg-[#28282897] cursor-pointer"
                onClick={handleCoverImageClick}
              >
                <span className="scale-[2] text-primary">
                  <FilterHdrIcon />
                </span>
              </div>
            )
          )}
        </div>
        <div className="absolute right-0 lg:right-[unset] left-0 m-auto bottom-0 lg:left-[11.5rem] rounded-xl translate-y-[1.5rem] w-fit scale-[1.2] lg:scale-[1.5] overflow-hidden border-1 border-primary bg-secondary z-10">
          <div className="relative w-[7rem] h-[7rem] ">
            {isProfileImageLoading ? (
              <div className="w-full flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              <img
                src={profile.profile_image}
                className="w-full h-full object-center object-cover"
              />
            )}
            {isMobile ? (
              <span
                className="absolute bottom-2 right-2 text-primary"
                onClick={handleProfileImageClick}
              >
                <CameraEnhanceIcon className="scale-[1.1]" />
              </span>
            ) : (
              profileInfo &&
              profileInfo.id === profile.id && (
                <div
                  className="absolute h-full w-full flex justify-center items-center top-0 left-0 opacity-0 hover:opacity-100 transition-all delay-75 bg-[#28282897] cursor-pointer"
                  onClick={handleProfileImageClick}
                >
                  <span className="scale-[2] text-primary">
                    <FilterHdrIcon />
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        {!isMobile && (
          <Link to="/">
            <div className="absolute text-primary left-[2rem] top-[1.5rem] md:left-[5rem] md:top-[2rem]">
              <HomeIcon className="scale-[1.5]" />
            </div>
          </Link>
        )}
      </div>
      <div className="w-[95%] m-auto mt-10">
        <div className="flex flex-col lg:flex-row w-full justify-between ">
          <div className="bg-secondary h-fit rounded-xl p-5 w-full lg:w-[24%] lg:sticky lg:top-4 text-gray-200">
            {isProfileUpdating ? (
              <div className="w-full flex justify-center mt-9">
                <Spinner />
              </div>
            ) : (
              <>
                <p className="font-bold text-gray-50 text-center">
                  {profile.name}
                </p>
                <p className="text-sm text-gray-400 text-center">
                  @{profile?.author.username}
                </p>
                <p className="mt-3 text-center">{profile?.bio}</p>
                <p className="mt-2">
                  <LocationOnIcon /> {profile?.city}, {profile?.state}
                </p>
                <p className="mt-2">
                  <DomainVerificationIcon />{" "}
                  {formatDistanceToNow(new Date(profile.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <div
                  className="text-center w-full mt-3"
                  onClick={() => setOpenModal(true)}
                >
                  {profileInfo && profileInfo.id === profile.id && (
                    <Button text="update" style="py-2 px-4" />
                  )}
                </div>
              </>
            )}
          </div>
          <div className="w-full mb-4 flex items-center justify-around lg:hidden h-[4rem] bg-secondary mt-4 rounded-xl text-white">
            {navSectionItems.map((item, i) => (
              <span
                key={i}
                className={currSectionNo === i ? "text-primary" : ""}
                onClick={() => setCurrSectionNo(i)}
              >
                {item.icon}
              </span>
            ))}
          </div>
          <div className="lg:hidden">
            <AnimatePresence>
              <m.div
                variants={FadeVariant}
                className=""
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={currSectionNo}
              >
                {currSection}
              </m.div>
            </AnimatePresence>
          </div>
          <div className="w-full lg:w-[49%] hidden md:block">
            <PostFeedSection profile={profile} />
          </div>
          <div className="w-full lg:w-[24%] lg:sticky lg:top-4 hidden md:block">
            <FollowersSection profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

type PostFeedSectionProps = {
  profile: ProfileType;
};

const PostFeedSection = ({ profile }: PostFeedSectionProps) => {
  const { profileInfo } = useStateContext()
  return (
    <div className="w-full">
      {profile.posts.map((item, i) => {
        return (
          <div key={i} className="bg-secondary rounded-xl p-5 mb-3">
            <Card {...item} userProfileID={profileInfo?.id} />
          </div>
        );
      })}
    </div>
  );
};

type FollowerSectionProps = {} & PostFeedSectionProps;
const FollowersSection = ({ profile }: FollowerSectionProps) => {
  const [followerNav, setFollowerNav] = useState(false);
  return (
    <div className="bg-secondary rounded-xl p-5 w-full h-fit max-h-[50rem] overflow-y-auto overflow-x-hidden text-gray-200">
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
              className={`font-bold text-lg ${followerNav && "text-primary"}`}
            >
              {profile.followers.length - 1}
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
              className={`font-bold text-lg ${!followerNav && "text-primary"}`}
            >
              {profile?.following?.length - 1}
            </span>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {followerNav ? (
          <m.div
            initial={{
              x: 50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -50,
              opacity: 0,
            }}
            transition={{
              duration: 0.1,
            }}
            className="mt-3"
            key={1}
          >
            {profile.followers.map((obj, index) => {
              if (obj.id !== profile?.id) {
                return (
                  <FollowCard
                    key={index}
                    profileID={profile.id}
                    follower={true}
                    {...obj}
                  />
                );
              }
            })}
          </m.div>
        ) : (
          <m.div
            key={2}
            initial={{
              x: 50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -50,
              opacity: 0,
            }}
            transition={{
              duration: 0.1,
            }}
            className="mt-3"
          >
            {profile.following.map((obj, index) => {
              if (obj.id !== profile?.id) {
                return (
                  <FollowCard
                    key={index}
                    profileID={profile.id}
                    follower={false}
                    {...obj}
                  />
                );
              }
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
