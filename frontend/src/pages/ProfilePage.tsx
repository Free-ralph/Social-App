import { useParams } from "react-router-dom";
import Profile from "../Components/Profile";
import Spinner from "../Components/Spinner";
import { useStateContext } from "../context/StateContextProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery } from "react-query";
import { ProfileType } from "../types/api";

const ProfilePage = () => {
  const { handleSnackMessage } = useStateContext();
  const { profile_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      axiosPrivate
        .get<ProfileType>(`/profile/${profile_id}`)
        .then((res) => res.data),
    onError: () => {
      handleSnackMessage("you might not have an activate profile", "error");
    }
  });

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        profile && <Profile profile={profile} />
      )}
    </>
  );
};

export default ProfilePage;
