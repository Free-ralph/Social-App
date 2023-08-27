import { FormEvent, useState } from "react";
import Button from "../Components/Button";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContextProvider";
import { useAuthStateContext } from "../context/AuthContextProvider";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "react-query";
import Spinner from "../Components/Spinner";
type loginInputErrors = {
  username: string[];
  password: string[];
};
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<loginInputErrors | null>(
    null
  );
  const { handleSnackMessage } = useStateContext();
  const navigate = useNavigate();
  const { setAuth } = useAuthStateContext();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: () =>
      axios
        .post("/token", {
          username,
          password,
        })
        .then((res) => res.data),
    onSuccess: (res) => {
      setAuth(res);
      navigate("/");
    },
    onError: (err: any) => {
      if (err.response.data.detail) {
        handleSnackMessage(err.response.data.detail, "error");
      } else {
        handleSnackMessage("login operation failed", "error");
      }
      setErrorMessage(err.response.data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div>
      <AnimatePresence>
        <motion.form
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
          className=" w-full lg:w-[70%] m-auto mt-[8rem] md:mt-[10rem] flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="text-center font-bold text-3xl text-primary mt-5">
            Welcome Back
          </div>
          <div className="flex flex-col w-[95%] lg:w-[65%]">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${
                errorMessage?.username ? "border-red-500" : "border-gray-300"
              } p-2 border-1 mt-4 w-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 `}
            />
            {errorMessage?.username && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.username?.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col w-[95%] lg:w-[65%]">
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${
                errorMessage?.password ? "border-red-500" : "border-gray-300"
              } p-2 border-1 mt-4 w-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 `}
            />
            {errorMessage?.password && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.password.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
            <p className="text-gray-200 mt-2 mr-auto">
              Don't have an account?{" "}
              <Link className="text-primary" to="/register">
                Join us
              </Link>
            </p>
          </div>
          <Button
            type={2}
            text={isLoading ? "" : "Submit"}
            style="w-[6rem] h-[3rem] mt-3"
            icon={isLoading && <Spinner width="30" height="30" />}
            disabled = {isLoading}
          />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default Login;
