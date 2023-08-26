import Profile from "./Profile";
import { useStateContext } from "../context/StateContextProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "./Spinner";
import { ProfileType } from "../types/api";
import { useQuery } from "react-query";

const ProfilePage = () => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axiosPrivate.get<ProfileType>("/profile/user").then((res) => res.data),
    onError: () => {
      handleSnackMessage("you might not have an activate profile", "error");
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        profile && (
          <Profile
            profile={profile}
            isMobile={true}
          />
        )
      )}
    </>
  );
};

export default ProfilePage;
